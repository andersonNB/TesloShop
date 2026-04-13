"use server"

import { auth } from "@/auth.config";
import { Address, ValidSizes } from "@/interfaces";
import { prisma } from "@/lib/prisma";

interface ProductToOrder {
    productId: string;
    quantity: number;
    size: ValidSizes;
}

export const placeOrder = async (productIds: ProductToOrder[], address: Address) => {


    const session = await auth()
    const userId = session?.user.id

    // Verificar sesión de usuario
    if (!userId) {
        return {
            ok: false,
            message: "No hay sesión de usuario"
        }
    }


    // Obtener la información de los productos
    // Nota: recuerden que podemos llevar +2 productos con el mismo id
    const products = await prisma.product.findMany({
        where: {
            id: {
                in: productIds.map(p => p.productId)
            }
        }
    })

    // Calcular los montons
    const itemsInOrder = productIds.reduce((count, product) => count + product.quantity, 0)


    // Los totales de tax, subtotal y total
    const { subTotal, tax, total } = productIds.reduce((totals, item) => {
        const product = products.find(p => p.id === item.productId)

        if (!product) throw new Error(`Producto no encontrado : ${item.productId}`);

        const subTotal = totals.subTotal + (product.price * item.quantity)
        const tax = totals.tax + (product.price * item.quantity * 0.15)
        const total = totals.total + (product.price * item.quantity * 1.15)

        return { subTotal, tax, total }
    }, { subTotal: 0, tax: 0, total: 0 })


    // Crear la transacción de base de datos
    try {
        const prismaTx = await prisma.$transaction(async (tx) => {

            // 1. Actualizar el stock de los productos

            const updatedProductsPromises = products.map((product) => {
                //Acumular la cantidad de productos
                const productQuantity = productIds.filter(
                    p => p.productId === product.id
                ).reduce((acc, item) => acc + item.quantity, 0)


                if (productQuantity === 0) {
                    throw new Error(`${product.id} no tiene cantidad definida`)
                }

                return tx.product.update({
                    where: {
                        id: product.id
                    },
                    data: {
                        //inStock: product.inStock - productQuantity esto no se debe hacer porque puede haber race condition
                        inStock: {
                            decrement: productQuantity
                        }
                    }
                })
            })

            const updatedProducts = await Promise.all(updatedProductsPromises)

            //Verificar valores negativos en las existencia = no hay stock
            updatedProducts.forEach(product => {
                if (product.inStock < 0) {
                    throw new Error(`No hay stock suficiente para el producto ${product.title}`)
                }
            })

            // 2. Crear la orden - Encabezada - Detalles
            const order = await tx.order.create({
                data: {
                    userId: userId,
                    itemsInOrder: itemsInOrder,
                    subTotal: subTotal,
                    tax: tax,
                    total: total,
                    orderItems: {
                        createMany: {
                            data: productIds.map(p => ({
                                productId: p.productId,
                                quantity: p.quantity,
                                size: p.size,
                                price: products.find(pr => pr.id === p.productId)?.price || 0
                            }))
                        }
                    }
                }
            })


            // 3. Crear la dirección de la orden

            const orderAddress = await tx.orderAddress.create({
                data: {
                    firstName: address.firstName,
                    lastName: address.lastName,
                    address: address.address,
                    address2: address.address2,
                    postalCode: address.postalCode,
                    city: address.city,
                    countryId: address.country,
                    phone: address.phone,
                    orderId: order.id
                }
            })

            return {
                order,
                updatedProducts,
                orderAddress: orderAddress
            }
        })

        return {
            ok: true,
            order: prismaTx.order,
            prismaTx
        }
    } catch (error: unknown) {


        const message = error instanceof Error
            ? error.message
            : "Error desconocido"

        return {
            ok: false,
            message: `Error al crear la orden ${message} `
        }
    }
}