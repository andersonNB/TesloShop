'use server'

import { prisma } from "@/lib/prisma"


/**
 * Obtiene una lista de productos con sus imágenes asociadas.
 * 
 * Esta función realiza una consulta a la base de datos para obtener todos los productos,
 * incluyendo hasta dos imágenes por producto. Luego, transforma la estructura de las
 * imágenes para devolver solo un arreglo de URLs.
 * 
 * @returns {Promise<{ products: any[] }>} Un objeto que contiene la lista de productos transformados.
 * @throws {Error} Si ocurre un error al cargar los productos de la base de datos.
 */
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