"use client"
import { titleFont } from '@/config/font'
import React from 'react'

interface Props {
    slug: string
}

export const StockLabel = ({ slug }: Props) => {




    return (
        <h1 className={`${titleFont.className} antialiased font-bold text-xl `}>
            Stock: {slug}
        </h1>
    )
}