"use client"
import { getStockBySlug } from '@/actions'
import { titleFont } from '@/config/font'
import { useEffect, useState } from 'react'
import { StockSkeleton } from '../stock-skeleton/StockSkeleton'

interface Props {
    slug: string
}

export const StockLabel = ({ slug }: Props) => {

    const [stock, setStock] = useState(0)


    useEffect(() => {
        const getStock = async () => {
            const stock = await getStockBySlug(slug)
            setStock(stock)
        }
        getStock()
    }, [slug])


    return (
        <h1 className={`${titleFont.className} flex items-center gap-2 antialiased font-bold text-xl `}>
            Stock: {stock === 0 ? <StockSkeleton /> : stock}
        </h1>
    )
}