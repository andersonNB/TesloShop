"use client"
import { getStockBySlug } from '@/actions'
import { titleFont } from '@/config/font'
import { useEffect, useState } from 'react'
import { StockSkeleton } from '../stock-skeleton/StockSkeleton'

interface Props {
    slug: string
}

export const StockLabel = ({ slug }: Props) => {
    const [stock, setStock] = useState<number | null>(null)

    useEffect(() => {
        const getStock = async () => {
            const stockValue = await getStockBySlug(slug)
            setStock(stockValue)
        }
        getStock()
    }, [slug])

    return (
        <h1 className={`${titleFont.className} flex items-center gap-2 antialiased font-bold text-md `}>
            Stock: {stock === null ? <StockSkeleton /> : stock}
        </h1>
    )
}
