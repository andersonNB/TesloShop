"use client"
import { QuantitySelector, SizeSelector } from '@/components'
import { Product } from '@/interfaces'
import { Sizes } from '@/seed/seed'
import { useState } from 'react'

interface Props {
    product: Product
}

export const AddToCart = ({ product }: Props) => {

    const [size, setSize] = useState<Sizes | undefined>()

    return (
        <>
            {/* Selector de tallas */}
            <SizeSelector
                selectedSize={size}
                availableSizes={product.sizes}
                onSizeChanged={setSize}
            />
            {/* Selector de cantidad*/}
            <QuantitySelector quantity={0} />

            {/* Button */}
            <button className="btn-primary my-5 ">Agregar al carrito</button>
        </>
    )
}