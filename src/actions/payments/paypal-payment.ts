"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// =============================================================================
// PayPal Configuration
// =============================================================================

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

// Base URL de la API de PayPal (cambiar en .env para producción: https://api-m.paypal.com)
const PAYPAL_API = process.env.PAYPAL_API || "https://api-m.sandbox.paypal.com";
const PAYPAL_OAUTH_URL = `${PAYPAL_API}/v1/oauth2/token`;
const PAYPAL_ORDERS_URL = `${PAYPAL_API}/v2/checkout/orders`;


// =============================================================================
// Helper: Obtener Access Token de PayPal
// =============================================================================

/**
 * Obtiene un Bearer access token de la API OAuth2 de PayPal.
 *
 * PayPal usa client credentials grant (Basic Auth con client_id:secret)
 * para generar un access_token de corta duración.
 *
 * @returns El access token como string.
 * @throws Error si las credenciales no están configuradas o la petición falla.
 */
const getPayPalBearerToken = async (): Promise<string> => {

    if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
        throw new Error("PayPal credentials are not configured. Check NEXT_PUBLIC_PAYPAL_CLIENT_ID and PAYPAL_SECRET in .env");
    }

    // Basic Auth: base64(client_id:secret)
    const base64Token = Buffer.from(
        `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`,
        "utf-8"
    ).toString("base64");

    const headersList = new Headers();
    headersList.append("Content-Type", "application/x-www-form-urlencoded");
    headersList.append("Authorization", `Basic ${base64Token}`);

    const response = await fetch(PAYPAL_OAUTH_URL, {
        method: "POST",
        headers: headersList,
        body: "grant_type=client_credentials",
        cache: "no-store",
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get PayPal access token: ${errorText}`);
    }

    const data = await response.json();
    return data.access_token as string;
}


// =============================================================================
// Action: Crear orden de PayPal
// =============================================================================

/**
 * Crea una orden en PayPal con el monto total de una orden de la tienda.
 *
 * Flujo:
 *  1. Busca la orden en la base de datos por su ID
 *  2. Obtiene un access token de PayPal
 *  3. Crea la orden en la API de PayPal con el monto total
 *  4. Guarda el transactionId de PayPal en la orden de la BD
 *
 * @param orderId - El ID de la orden en nuestra base de datos.
 * @returns El ID de la orden creada en PayPal (transactionId).
 */
export const createPayPalOrder = async (orderId: string) => {
    try {
        // 1. Obtener la orden de la base de datos
        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            return {
                ok: false,
                message: `Orden ${orderId} no encontrada`,
            }
        }

        // 2. Obtener access token de PayPal
        const accessToken = await getPayPalBearerToken();

        // 3. Crear la orden en PayPal
        const response = await fetch(PAYPAL_ORDERS_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [
                    {
                        // invoice_id sirve para evitar pagos duplicados
                        invoice_id: orderId,
                        amount: {
                            currency_code: "USD",
                            value: order.total.toFixed(2),
                        },
                    },
                ],
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("PayPal create order error:", errorData);
            return {
                ok: false,
                message: "Error al crear la orden en PayPal",
            }
        }

        const paypalOrder = await response.json();

        // 4. Guardar el transactionId de PayPal en nuestra BD
        await prisma.order.update({
            where: { id: orderId },
            data: { transactionId: paypalOrder.id },
        });

        return {
            ok: true,
            transactionId: paypalOrder.id as string,
        }

    } catch (error) {
        console.error("Error creating PayPal order:", error);
        return {
            ok: false,
            message: `Error interno: ${error}`,
        }
    }
}


// =============================================================================
// Action: Verificar pago de PayPal
// =============================================================================

/**
 * Verifica el pago de una transacción de PayPal y actualiza la orden en la BD.
 *
 * Flujo:
 *  1. Obtiene un access token de PayPal
 *  2. Consulta la orden en PayPal por su transactionId
 *  3. Si el status es COMPLETED, actualiza la orden en la BD como pagada
 *
 * @param paypalTransactionId - El ID de la transacción/orden en PayPal.
 * @returns Resultado indicando si la verificación fue exitosa.
 */
export const paypalCheckPayment = async (paypalTransactionId: string) => {
    try {
        // 1. Obtener access token
        const accessToken = await getPayPalBearerToken();

        // 2. Verificar el pago consultando la orden en PayPal
        const response = await fetch(`${PAYPAL_ORDERS_URL}/${paypalTransactionId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            },
            cache: "no-store",
        });

        if (!response.ok) {
            return {
                ok: false,
                message: "Error al verificar el pago en PayPal",
            }
        }

        const paypalOrder = await response.json();
        const { status, purchase_units } = paypalOrder;

        // 3. Si no está completado, el pago aún no se ha realizado
        if (status !== "COMPLETED") {
            return {
                ok: false,
                message: `La orden de PayPal aún no ha sido pagada. Status: ${status}`,
            }
        }

        // 4. Obtener el invoice_id (que es nuestro orderId de la BD)
         
        const invoiceId = purchase_units?.[0]?.payments?.captures?.[0]?.invoice_id as string | undefined;

        if (!invoiceId) {
            return {
                ok: false,
                message: "No se encontró el invoice_id en la respuesta de PayPal",
            }
        }

        // 5. Actualizar la orden en nuestra base de datos
        await prisma.order.update({
            where: { id: invoiceId },
            data: {
                isPaid: true,
                paidAt: new Date(),
            },
        });

        // 6. Revalidar la página de la orden para que se refleje el cambio
        revalidatePath(`/orders/${invoiceId}`);

        return {
            ok: true,
            message: "Pago verificado correctamente",
        }
    } catch (error) {
        console.error("Error checking PayPal payment:", error);
        return {
            ok: false,
            message: `Error interno al verificar pago: ${error}`,
        }
    }
}
