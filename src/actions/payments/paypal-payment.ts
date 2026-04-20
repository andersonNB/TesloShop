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
 * @async
 * @returns {Promise<string>} El access token como string.
 * @throws {Error} Si las credenciales `NEXT_PUBLIC_PAYPAL_CLIENT_ID` o `PAYPAL_SECRET` no están configuradas.
 * @throws {Error} Si la petición HTTP al endpoint OAuth2 de PayPal falla.
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
 *  1. Busca la orden en la base de datos por su ID.
 *  2. Obtiene un access token de PayPal.
 *  3. Crea la orden en la API de PayPal con el monto total (intent: `CAPTURE`).
 *  4. Guarda el `transactionId` de PayPal en la orden de la BD.
 *
 * @async
 * @param {string} orderId - El ID (UUID) de la orden en nuestra base de datos.
 * @returns {Promise<{ ok: true; transactionId: string } | { ok: false; message: string }>}
 *   - `ok: true` con el `transactionId` de PayPal si la orden se creó correctamente.
 *   - `ok: false` con un `message` descriptivo si ocurrió un error.
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
// Action: Capturar orden de PayPal
// =============================================================================

/**
 * Captura (cobra) una orden de PayPal previamente aprobada por el usuario.
 *
 * Flujo:
 *  1. Obtiene un access token de PayPal.
 *  2. Envía la petición de captura (POST) a la API de PayPal.
 *  3. Si el status es `COMPLETED`, extrae el `invoice_id` (nuestro `orderId`).
 *  4. Actualiza la orden en la BD como pagada (`isPaid: true`, `paidAt: Date`).
 *  5. Revalida la ruta `/orders/{orderId}` para reflejar el cambio en la UI.
 *
 * @async
 * @param {string} paypalOrderId - El ID de la orden en PayPal que fue aprobada por el usuario.
 * @returns {Promise<{ ok: true; message: string } | { ok: false; message: string }>}
 *   - `ok: true` si el pago fue capturado y la orden actualizada correctamente.
 *   - `ok: false` con un `message` descriptivo si la captura falló o el status no es `COMPLETED`.
 */
export const capturePayPalOrder = async (paypalOrderId: string) => {
    try {
        const accessToken = await getPayPalBearerToken();

        const response = await fetch(`${PAYPAL_ORDERS_URL}/${paypalOrderId}/capture`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            cache: "no-store",
        });

        const paypalOrder = await response.json();

        if (!response.ok) {
            console.error("PayPal capture order error:", paypalOrder);
            return {
                ok: false,
                message: paypalOrder?.message || "Error al capturar la orden en PayPal",
            };
        }

        const { status, purchase_units } = paypalOrder;

        if (status !== "COMPLETED") {
            return {
                ok: false,
                message: `La orden de PayPal no fue completada. Status: ${status}`,
            };
        }

        const invoiceId =
            purchase_units?.[0]?.payments?.captures?.[0]?.invoice_id as string | undefined;

        if (!invoiceId) {
            return {
                ok: false,
                message: "No se encontró el invoice_id en la captura de PayPal",
            };
        }

        await prisma.order.update({
            where: { id: invoiceId },
            data: {
                isPaid: true,
                paidAt: new Date(),
            },
        });

        revalidatePath(`/orders/${invoiceId}`);

        return {
            ok: true,
            message: "Pago capturado y orden actualizada correctamente",
        };
    } catch (error) {
        console.error("Error capturing PayPal payment:", error);
        return {
            ok: false,
            message: `Error interno al capturar pago: ${error}`,
        };
    }
};