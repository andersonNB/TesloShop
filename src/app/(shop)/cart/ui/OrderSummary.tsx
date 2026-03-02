"use client"
import { currencyFormat, useCartStore } from "@/utils"
import { useEffect, useRef, useState } from "react"

export const OrderSummary = () => {
    const totalProductsInCart = useCartStore(state => state.getTotalItems())
    const getSummaryInformation = useCartStore(state => state.getSummaryInformation)
    const { subTotal, tax, total } = getSummaryInformation()
    const [hydrated, setHydrated] = useState(false)
    const hasMounted = useRef(false)

    useEffect(() => {

        if (!hasMounted.current) {
            hasMounted.current = true;
            queueMicrotask(() => setHydrated(true));
        }
    }, [])

    if (!hydrated) return <div>Loading...</div>

    return (
        <div className="grid grid-cols-2">
            <span>No. Productos</span>
            <span className="text-right">{totalProductsInCart === 1 ? "1 articulo" : `${totalProductsInCart} articulos`} </span>

            <span>Subtotal</span>
            <span className="text-right">{currencyFormat(subTotal)}</span>

            <span>Impuestos (15%) </span>
            <span className="text-right">{currencyFormat(tax)}</span>

            <span className="mt-5 text-2xl">Total:</span>
            <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>
        </div>
    )
}