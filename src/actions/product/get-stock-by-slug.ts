"use server"
import { prisma } from "@/lib/prisma"

/**
 * Obtiene el stock disponible de un producto a partir de su slug.
 *
 * @param {string} slug - El slug único del producto.
 * @returns {Promise<number>} La cantidad de unidades en stock del producto.
 * @throws {Error} Si el producto no se encuentra o si ocurre un error en la consulta.
 * @example
 * const stock = await getStockBySlug("camiseta-azul");
 * console.log(stock); // 12
 */
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
        throw new Error("Error al obtener el stock por slug.")
    }
}