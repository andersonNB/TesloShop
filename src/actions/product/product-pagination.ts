'use server'

import { prisma } from "@/lib/prisma"


interface PaginationOptions {
    page?: number;
    take?: number
}


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
export const getPaginatedProductsWithImages = async ({ page = 1, take = 12 }: PaginationOptions) => {

    if (isNaN(Number(page))) page = 1;
    if (page < 1) page = 1;
    if (isNaN(Number(take))) take = 12;

    try {

        // 1. Obtener los productos e imágenes en paralelo (o secuencial, pero con manejo de errores)
        const [products, totalCount] = await Promise.all([
            prisma.product.findMany({
                take,
                skip: (page - 1) * take,
                include: {
                    images: {
                        take: 2,
                        select: {
                            url: true
                        }
                    }
                }
            }),
            prisma.product.count({})
        ]);

        const totalPages = Math.ceil(totalCount / take);

        return {
            ok: true,
            currentPage: page,
            totalPages,
            products: products.map(product => ({
                ...product,
                images: product.images.map(image => image.url)
            }))
        }

    } catch (error) {
        console.error(error);
        return {
            ok: false,
            message: "No se pudieron cargar los productos",
            products: [],
            currentPage: 1,
            totalPages: 1,
        }
    }

}