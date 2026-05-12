"use server"
import { prisma } from "@/lib/prisma";
import { Product, Size } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod"
import { v2 as cloudinary } from "cloudinary"


cloudinary.config(process.env.CLOUDINARY_URL ?? "");
const productSchema = z.object({

    id: z.string().uuid().optional(),
    title: z.string().min(3).max(255),
    slug: z.string().min(3).max(255),
    description: z.string(),
    price: z.coerce.number().min(0).transform(val => Number(val.toFixed(2))),
    inStock: z.coerce.number().min(0).transform(val => Number(val.toFixed(0))),
    categoryId: z.string().uuid(),
    sizes: z.coerce.string().transform(val => val.split(",")),
    tags: z.string(),
    gender: z.enum(["men", "women", "kid", "unisex"])
})

export const createUpdateProduct = async (formData: FormData) => {

    const data = Object.fromEntries(formData);
    console.log("data: ", data)

    const productParsed = productSchema.safeParse(data)
    console.log("productParsed: ", productParsed)

    if (!productParsed.success) {
        return {
            ok: false,
            errors: productParsed.error.flatten().fieldErrors
        }
    }

    const product = productParsed.data
    product.slug = product.slug.toLowerCase().replace(/ /g, "-").trim()
    const { id, ...rest } = product

    try {

        const prismaTx = await prisma.$transaction(async (tx) => {


            let product: Product
            const tagsArray = rest.tags?.split(",").map(tag => tag.trim().toLocaleLowerCase())

            if (id) {
                //Actualizar
                product = await tx.product.update({
                    where: {
                        id
                    },
                    data: {
                        ...rest,
                        sizes: {
                            set: rest.sizes as Size[]
                        },
                        tags: {
                            set: tagsArray
                        }
                    }
                })

                console.log("product updated: ", product)
            } else {
                //crear
                product = await tx.product.create({
                    data: {
                        ...rest,
                        sizes: {
                            set: rest.sizes as Size[]
                        },
                        tags: {
                            set: tagsArray
                        }
                    }
                })
            }



            if (formData.getAll("images")) {
                const images = await uploadImages(formData.getAll("images") as File[])
                console.log("imagenes en cloudinary: ", images)
            }

            return {
                product
            }

        })
        revalidatePath("/admin/products")
        revalidatePath(`/admin/product/${product.slug}`)
        revalidatePath(`/products/${product.slug}`)

        return {
            ok: true,
            product: prismaTx.product
        }
    } catch (error) {
        console.error(error)
        return {
            ok: false,
            message: "No se puedo actualizar/crear el producto",
            error
        }
    }
}


/**
 * Sube un arreglo de archivos de imagen a Cloudinary.
 * Convierte cada archivo a formato Base64 antes de realizar la carga.
 * 
 * @param {File[]} file - Arreglo de archivos de imagen a subir.
 * @returns {Promise<(string | null)[] | null>} Una promesa que resuelve en un arreglo de URLs seguras (strings) de las imágenes subidas. Retorna un arreglo que puede contener `null` si alguna imagen falla, o `null` si ocurre un error global.
 */
const uploadImages = async (file: File[]) => {
    try {

        const uploadPromises = file.map(async (image) => {


            try {

                const buffer = await image.arrayBuffer()
                const base64Image = Buffer.from(buffer).toString("base64")
                return (await cloudinary.uploader.upload(`data:${image.type};base64,${base64Image}`)).secure_url
            } catch (error) {
                console.error("Error: ", error)
                return null
            }

        })

        const results = await Promise.all(uploadPromises)
        return results

    } catch (error) {
        console.error("Error al subir las imagenes: ", error)
        return null
    }

}