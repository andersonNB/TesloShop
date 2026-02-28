"use client"
import { QuantitySelector } from '@/components'
import { CartProduct } from '@/interfaces'
import { useCartStore } from '@/utils'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { CiTrash } from 'react-icons/ci'



export const ProductsInCart = () => {

    const productsInCart = useCartStore(state => state.cart)
    //TODO: Implementar la funcion de remover producto del carrito.
    const updateProductQuantity = useCartStore(state => state.addProductToCart)

    const [hydrated, setHydrated] = useState(false);
    const hasMounted = useRef(false);

    const onChangeQuantity = (quantity: number, product: CartProduct) => {
        console.log("onChangeQuantity: ", quantity)

        const productUpdated = {
            ...product,
            quantity
        }

        updateProductQuantity(productUpdated)


    }

    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            queueMicrotask(() => setHydrated(true));
        }
    }, []);

    if (!hydrated) return <div>Loading...</div>

    return (

        productsInCart.map((product) => (
            <div key={`${product.slug}-${product.size}`} className="flex mb-5 ">
                <Image
                    src={`/products/${product.image}`}
                    width={100}
                    height={100}
                    alt={product.title}
                    className="mr-5 rounded"
                    style={{
                        width: "100px",
                        height: "100px",
                    }}
                />
                <div>
                    <Link href={`/product/${product.slug}`} className='hover:cursor-pointer hover:underline'>
                        <p> {product.size} - {product.title ?? "Sin título"}</p>
                    </Link>
                    <p>{product.price}</p>
                    <QuantitySelector quantity={product.quantity} onQuantityChanged={(quantity) => onChangeQuantity(quantity, product)} />

                    <button className="flex items-center justify-center gap-2 underline mt-3 hover:cursor-pointer">
                        <CiTrash /> Remover
                    </button>
                </div>
            </div>
        ))

    )
}