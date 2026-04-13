"use server"
import { auth } from "@/auth.config"
import { prisma } from "@/lib/prisma"

/**
 * Obtiene una orden por su ID desde la base de datos.
 *
 * Verifica que el usuario esté autenticado y que sea el propietario de la orden
 * antes de retornar los datos.
 *
 * @param {string} id - El ID único de la orden a buscar.
 * @returns {Promise<{ok: boolean, order?: Order, message?: string, redirect?: string}>}
 *   - `ok: false` con `redirect` si el usuario no está autenticado.
 *   - `ok: false` con `message` si la orden no existe o el usuario no tiene permisos.
 *   - `ok: true` con `order` si la orden se encontró y pertenece al usuario.
 * @throws {Error} Si ocurre un error inesperado al consultar la base de datos.
 *
 * @example
 * const result = await getOrderById("clx1abc123...");
 * if (!result.ok) {
 *   console.error(result.message);
 *   return;
 * }
 * console.log(result.order);
 */
export const getOrderById = async (id: string) => {


    const session = await auth()

    if (!session?.user) {
        return {
            ok: false,
            message: "Debe estar autenticado para ver la orden",
            redirect: "/auth/login"
        }
    }


    try {

        const order = await prisma.order.findUnique({
            where: {
                id
            }
        })


        //La direccion
        const address = await prisma.orderAddress.findUnique({
            where: {
                orderId: id
            }
        })

        //Los productos que se compraron
        const items = await prisma.orderItem.findMany({
            where: {
                orderId: id
            },
            include: {
                product: {
                    select: {
                        title: true,
                        slug: true,
                        images: {
                            select: { url: true },
                            take: 1
                        }
                    }
                }
            }
        })




        if (!order) {
            return {
                ok: false,
                message: "Orden no encontrada"
            }
        }

        if (order.userId !== session.user.id) {
            return {
                ok: false,
                message: "No tienes permiso para ver esta orden"
            }
        }

        return {
            ok: true,
            order,
            address,
            items
        }
    } catch (error) {
        console.error(error)

        return {
            ok: false,
            message: `Error al obtener la orden: ${error}`
        }
    }

}