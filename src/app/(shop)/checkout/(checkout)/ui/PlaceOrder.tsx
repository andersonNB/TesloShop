"use client"

import { OrderSummary } from "@/app/(shop)/cart/ui/OrderSummary"
import { useAddressStore } from "@/store"
import { useCartStore } from "@/utils"
import clsx from "clsx"
import { useState, useSyncExternalStore } from "react"

const emptySubscribe = () => () => { } // No necesitamos suscribirnos a nada, nunca cambia

function useHydrated() {
    return useSyncExternalStore(
        emptySubscribe,
        () => true, // En el CLIENTE → "sí, estoy cargado" ✅
        () => false // En el SERVER → "no estoy cargado" ❌
    )
}

export const PlaceOrder = () => {

    const loaded = useHydrated()
    const address = useAddressStore(state => state.address);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false)

    const cart = useCartStore(state => state.cart)

    const onPlaceOrder = async () => {
        setIsPlacingOrder(true)

        const productsToOrder = cart.map(product => ({
            productId: product.id,
            quantity: product.quantity,
            size: product.size
        }))

        console.log(productsToOrder)

        setIsPlacingOrder(false)
    }


    if (!loaded) return <div>Cargando...</div>

    return (
        <div className="bg-white rounded-xl shadow-xl p-7 ">

            <h2 className="text-2xl mb-2 font-bold">Dirección de entrega</h2>
            <div className="mb-10">
                <p className="text-xl">
                    {address.firstName} {address.lastName}
                </p>
                <p>{address.address}</p>
                <p>{address.address2}</p>
                <p>{address.postalCode}</p>
                <p>{address.city}, {address.country}</p>
                <p>{address.phone}</p>
            </div>
            {/* Divider */}
            <div className="W-full h-0.5 rounded bg-gray-200 mb-10" />

            <h2 className="text-2xl mb-2">Resumen de orden</h2>
            <OrderSummary />

            <div className="mt-5 mb-2 w-full">

                <p className="mb-5">
                    {/* Disclaimer */}
                    <span className="text-sm">
                        Al hacer clic en &quot;Colocar orden&quot;, aceptas nuestros <a href="#" className="underline">términos y condiciones</a>.
                    </span>
                </p>


                <p className="text-red-500" >Error de creación</p>

                <button
                    className={
                        clsx({
                            "btn-primary": !isPlacingOrder,
                            "btn-disabled": isPlacingOrder,
                        })
                    }
                    onClick={onPlaceOrder}
                >
                    Colocar orden
                </button>
            </div>
        </div>
    )
}