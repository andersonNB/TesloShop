"use server"

import { prisma } from "@/lib/prisma"

/**
 * Obtiene un producto de la base de datos por su slug.
 *
 * @param {string} slug - El slug único del producto a buscar.
 * @returns {Promise<{
 *   id: string;
 *   description: string;
 *   inStock: number;
 *   price: number;
 *   sizes: import('@prisma/client').Size[];
 *   slug: string;
 *   tags: string[];
 *   title: string;
 *   gender: import('@prisma/client').Gender;
 *   categoryId: string;
 *   images: string[];
 * } | null>} El producto con sus imágenes o `null` si no se encuentra.
 * @throws {Error} Si ocurre un error durante la consulta a la base de datos.
 *
 * @example
 * const product = await getProductBySlug('mens_chill_crew_neck_sweatshirt');
 * if (product) {
 *   console.log(product.title, product.images);
 * }
 */
export const getProductBySlug = async (slug: string) => {

    try {

        const product = await prisma.product.findFirst({
            include: {
                images: {
                    select: {
                        url: true
                    }
                }
            },
            where: {
                slug
            }
        })

        if (!product) return null

        return {
            ...product,
            images: product.images.map(image => image.url)
        }

    } catch (error) {
        console.log(error)
        throw new Error("Error al obtener producto por slug")
    }
}