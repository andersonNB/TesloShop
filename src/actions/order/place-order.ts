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

        if (!product) throw new Error(`Producto no encontrado: ${item.productId}`);

        const subTotal = totals.subTotal + (product.price * item.quantity)
        const tax = totals.tax + (product.price * item.quantity * 0.15)
        const total = totals.total + (product.price * item.quantity * 1.15)

        return { subTotal, tax, total }
    }, { subTotal: 0, tax: 0, total: 0 })


    // Crear la transacción de base de datos
    await prisma.$transaction(async (tx) => {

        // 1. Actualizar el stock de los productos
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
            updatedProducts: [],
            orderAddress: orderAddress
        }
    })
}