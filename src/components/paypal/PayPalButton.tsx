"use client"
import { OnCompleteData, OnErrorData, OnApproveDataOneTimePayments, OnCancelDataOneTimePayments, PayPalOneTimePaymentButton, usePayPalOneTimePaymentSession } from "@paypal/react-paypal-js/sdk-v6";

export const PayPalButton = () => {

    const { isPending, error } = usePayPalOneTimePaymentSession({
        createOrder: async () => {
            const { orderId } = await Promise.resolve({ orderId: "123" });
            return { orderId };
        },
        presentationMode: "auto",
        //@ts-expect-error beta paypal
        onApprove: (data: OnApproveDataOneTimePayments) =>
            console.log("Approved:", data),
        onCancel: (data: OnCancelDataOneTimePayments) =>
            console.log("Cancelled:", data),
        onError: (data: OnErrorData) => console.error(data),
        onComplete: (data: OnCompleteData) =>
            console.log("Payment session complete", data),
    });

    if (isPending) return <div className="animate-pulse">
        <div className="w-3/6 h-10 bg-gray-200 rounded" />
    </div>
    if (error) return <div>Error: {error.message}</div>

    return (
        <PayPalOneTimePaymentButton
            //@ts-expect-error beta paypal
            createOrder={async () => {
                const response = await Promise.resolve({ orderId: "123" });
                return response.orderId
            }}
            onApprove={async ({ orderId }: OnApproveDataOneTimePayments) => {
                await fetch(`/api/capture/${orderId}`, { method: "POST" });
                console.log("Payment approved!", orderId);
            }}
            onCancel={(data: OnCancelDataOneTimePayments) =>
                console.log("Payment cancelled", data)
            }
            onError={(data: OnErrorData) => console.error("Payment error:", data)}
            onComplete={(data: OnCompleteData) => console.log("Payment Flow Completed", data)}
        />
    )
}
