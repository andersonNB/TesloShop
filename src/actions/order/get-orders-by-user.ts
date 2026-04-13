"use server"

import { auth } from "@/auth.config"
import { prisma } from "@/lib/prisma"


/**
 * Obtiene todas las órdenes de compra del usuario autenticado.
 *
 * Incluye el nombre y apellido de la dirección de envío asociada
 * a cada orden mediante la relación `orderAddresses`.
 *
 * @returns {Promise<{ok: boolean, orders?: Order[], message?: string}>}
 *   - `ok: false` con `message` si el usuario no está autenticado o si ocurre un error en la BD.
 *   - `ok: true` con `orders` conteniendo la lista de órdenes del usuario.
 *
 * @example
 * const { ok, orders } = await getOrdersByUser();
 * if (!ok) return;
 * orders.forEach(order => console.log(order.total, order.orderAddresses?.firstName));
 */
export const getOrdersByUser = async () => {

    const session = await auth()

    if (!session?.user) {
        return {
            ok: false,
            message: "Debe estar autenticado para ver la orden"
        }
    }

    try {

        const orders = await prisma.order.findMany({
            where: {
                userId: session.user.id
            },
            include: {
                orderAddresses: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            }
        })

        return {
            ok: true,
            orders
        }

    } catch (error) {
        console.error(error)
        return {
            ok: false,
            message: `Error al obtener las ordenes: ${error}`
        }
    }

}