"use client"
import { QuantitySelector, SizeSelector } from '@/components'
import { Product } from '@/interfaces'
import { Sizes } from '@/seed/seed'
import { useState } from 'react'
import { IoTrashOutline } from "react-icons/io5";

interface Props {
    product: Product
}

export const AddToCart = ({ product }: Props) => {

    const [size, setSize] = useState<Sizes | undefined>()
    const [quantity, setQuantity] = useState<number>(1)
    const [isSizeSelected, setIsSizeSelected] = useState<boolean>(false)


    const addToCard = () => {
        if (!size) {
            setIsSizeSelected(true)
            return;
        }
        console.log(size, quantity)
    }

    const clearCard = () => {
        setSize(undefined)
        setQuantity(1)
    }

    return (
        <>
            {/* Selector de tallas */}
            <SizeSelector
                selectedSize={size}
                availableSizes={product.sizes}
                onSizeChanged={setSize}
                isEmptySize={isSizeSelected}
            />
            {/* Selector de cantidad*/}
            <QuantitySelector quantity={quantity} onQuantityChanged={setQuantity} />

            {/* Button */}
            <div className='flex items-center gap-6 '>
                <button className="btn-primary my-5 " onClick={addToCard}>Agregar al carrito</button>
                <button onClick={clearCard} className=' hover:bg-gray-200 hover:text-black py-2 px-2 rounded-full' ><IoTrashOutline size={20} /></button>
            </div>
        </>
    )
}