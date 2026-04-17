"use client"
import { createPayPalOrder, paypalCheckPayment } from "@/actions";
import {
    OnApproveDataOneTimePayments,
    OnCancelDataOneTimePayments,
    OnCompleteData,
    OnErrorData,
    PayPalOneTimePaymentButton,
} from "@paypal/react-paypal-js/sdk-v6";

interface Props {
    orderId: string;
    isPaid: boolean;
}

/**
 * Botón de pago de PayPal para una orden específica.
 *
 * Flujo del pago:
 *  1. El usuario hace clic en el botón de PayPal
 *  2. Se crea una orden en PayPal (createOrder) usando el total de nuestra BD
 *  3. PayPal muestra su ventana de pago y el usuario aprueba
 *  4. onApprove se ejecuta → verificamos el pago con PayPal y actualizamos la BD
 *
 * @param orderId - El ID de la orden en nuestra base de datos.
 * @param isPaid - Si la orden ya fue pagada (para no mostrar el botón).
 */
export const PayPalButton = ({ orderId, isPaid }: Props) => {

    if (isPaid) return null;

    /**
     * Callback que PayPal llama cuando el usuario hace clic en el botón.
     * Crea la orden en PayPal con el monto correcto desde nuestra BD.
     */
    const createOrder = async (): Promise<{ orderId: string }> => {
        const result = await createPayPalOrder(orderId);

        if (!result.ok || !result.transactionId) {
            throw new Error(result.message ?? "Error al crear la orden de PayPal");
        }

        return { orderId: result.transactionId };
    }

    /**
     * Callback que PayPal llama cuando el usuario aprueba el pago.
     * Verificamos el pago con PayPal y actualizamos la orden en la BD.
     */
    const onApprove = async (data: OnApproveDataOneTimePayments) => {
        const { orderId: paypalOrderId } = data;

        const result = await paypalCheckPayment(paypalOrderId);

        if (!result.ok) {
            console.error("Error al verificar pago:", result.message);
        }
    }



    return (
        <div className="relative z-0">
            <PayPalOneTimePaymentButton
                presentationMode="auto"
                createOrder={createOrder}
                onApprove={onApprove}
                onCancel={(data: OnCancelDataOneTimePayments) =>
                    console.log("Pago cancelado", data)
                }
                onError={(data: OnErrorData) =>
                    console.error("Error en el pago:", data)
                }
                onComplete={(data: OnCompleteData) =>
                    console.log("Flujo de pago completado", data)
                }
            />
        </div>
    )
}