"use client"
import { currencyFormat, useCartStore } from '@/utils'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'



export const ProductsInCart = () => {

    const productsInCart = useCartStore(state => state.cart)

    const [hydrated, setHydrated] = useState(false);
    const hasMounted = useRef(false);

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
                    <span className='hover:cursor-pointer hover:underline'>
                        {product.size} - {product.title ?? "Sin título"} - {product.quantity}
                    </span>
                    <p className='font-bold'> {currencyFormat(product.price * product.quantity)}</p>
                </div>
            </div>
        ))

    )
}