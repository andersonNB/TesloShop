"use server"
import { prisma } from "@/lib/prisma"
import { v2 as cloudinary } from "cloudinary"
import { revalidatePath } from "next/cache"

/**
 * Deletes a product image from Cloudinary and the database, then revalidates relevant paths.
 *
 * @param {string | number} imageId - The ID of the image in the database.
 * @param {string} imageUrl - The URL of the image, used to extract the public ID for Cloudinary deletion.
 * @returns {Promise<{ ok: boolean, message?: string, error?: string }>} An object containing the success status and an optional message or error.
 */
export const deleteProductImage = async (imageId: string | number, imageUrl: string) => {

    if (!imageUrl.startsWith('http')) {
        return {
            ok: false,
            error: "No se pueden borrar imagenes de FS"
        }
    }


    const imageName = imageUrl.split("/").pop()?.split(".")[0] ?? ""


    try {

        await cloudinary.uploader.destroy(imageName)

        const deleteImage = await prisma.productImage.delete({
            where: {
                id: Number(imageId)
            },
            select: {
                product: {
                    select: {
                        slug: true
                    }
                }
            }
        })

        revalidatePath(`/admin/products`)
        revalidatePath(`/admin/product/${deleteImage.product.slug}`)
        revalidatePath(`products/${deleteImage.product.slug}`)


        return {
            ok: true,
            message: "Imagen borrada correctamente"
        }

    } catch (error) {
        console.error("Error al borrar la imagen: ", error)
        return {
            ok: false,
            message: "Error al borrar la imagen"
        }
    }

}