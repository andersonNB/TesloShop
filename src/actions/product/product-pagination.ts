'use server'

import { prisma } from "@/lib/prisma"

export const getPaginatedProductsWithImages = async () => {


    try {

        const products = await prisma.product.findMany({
            include: {
                images: {
                    take: 2,
                    select: {
                        url: true
                    }
                }
            }
        })

        console.log("serverActions: ", products)

        return {
            products: products.map(product => ({
                ...product,
                images: product.images.map(image => image.url)
            }))
        }

    } catch (error) {
        console.error(error)
        throw new Error("No se pudo cargar los productos")
    }

}