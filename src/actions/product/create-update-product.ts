"use server"
import { prisma } from "@/lib/prisma";
import { Product, Size } from "@prisma/client";
import { z } from "zod"


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



        return {
            product
        }

    })

    console.log(prismaTx)
}