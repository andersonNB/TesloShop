"use server"
import { prisma } from "@/lib/prisma"

/**
 * Elimina la dirección almacenada de un usuario en la base de datos.
 *
 * @param {string} userId - El identificador único del usuario cuya dirección se desea eliminar.
 * @returns {Promise<{ ok: true, deletedAddress: import("@prisma/client").UserAddress } | { ok: false, message: string }>}
 *   - En caso de éxito: `{ ok: true, deletedAddress }` con la dirección eliminada.
 *   - En caso de error: `{ ok: false, message }` con un mensaje descriptivo del fallo.
 */
export const deleteUserAddress = async (userId: string) => {


    try {

        const existingAddress = await prisma.userAddress.findUnique({
            where: { userId }
        });


        if (!existingAddress) {
            return {
                ok: false,
                message: "La dirección actual no esta asociada a tu cuenta"
            }
        }


        const deletedAddress = await prisma.userAddress.deleteMany({
            where: {
                userId
            }
        });

        return {
            ok: true,
            deletedAddress
        }

    } catch (error) {
        console.error(error)

        return {
            ok: false,
            message: "No se pudo eliminar la dirección"
        }
    }
}