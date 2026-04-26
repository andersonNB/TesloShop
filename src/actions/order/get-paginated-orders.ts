"use server"

import { Order } from "@/interfaces";
import { prisma } from "@/lib/prisma"
import { verifyAdminSession } from "../auth/verify-admin-session"


/**
 * Recupera **todas** las órdenes de compra del sistema, ordenadas de más
 * reciente a más antigua. Es una acción exclusiva para administradores.
 *
 * ### Acceso
 * - Requiere que la sesión activa tenga el rol `"admin"`.
 * - Si el usuario no tiene ese rol (o no hay sesión), devuelve `ok: false`.
 *
 * ### Datos incluidos
 * Por cada orden se incluyen los campos `firstName` y `lastName` de la
 * dirección de envío asociada (`orderAddresses`).
 *
 * @returns {Promise<{ ok: false; message: string } | { ok: true; orders: Order[] }>}
 *   - `ok: false` + `message` si el usuario no es admin o si ocurre un error de BD.
 *   - `ok: true`  + `orders`  con la lista completa de órdenes ordenadas por `createdAt` desc.
 *
 * @throws No lanza excepciones; los errores de BD se capturan y se retornan
 *   como `{ ok: false, message }`.
 *
 * @example
 * const result = await getPaginatedOrders();
 *
 * if (!result.ok) {
 *   console.error(result.message);
 *   return;
 * }
 *
 * result.orders.forEach(order => {
 *   console.log(order.id, order.total, order.orderAddresses?.firstName);
 * });
 */

interface Response { ok: boolean, orders?: Order[], message?: string }

export const getPaginatedOrders = async (): Promise<Response> => {

    const adminCheck = await verifyAdminSession()
    if (!adminCheck.ok) return adminCheck

    try {

        const orders = await prisma.order.findMany({
            orderBy: {
                createdAt: "desc"
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