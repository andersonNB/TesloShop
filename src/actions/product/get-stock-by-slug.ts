"use server"
import { prisma } from "@/lib/prisma"


export const getStockBySlug = async (slug: string) => {
    try {

        const product = await prisma.product.findUnique({
            where: {
                slug
            },
            select: {
                inStock: true
            }
        })

        if (!product) {
            throw new Error("No se encontro el producto")
        }

        return product.inStock

    } catch (error) {
        console.error(error)
        throw new Error("Error al obtener el stock por slug")
    }
}