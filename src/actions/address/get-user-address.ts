"use server"

import { prisma } from "@/lib/prisma"



export const getUserAddress = async (userId: string) => {


    try {


        const address = await prisma.userAddress.findUnique({
            where: {
                userId
            }
        })

        if (!address) {
            return {
                ok: false,
                message: "No se pudo obtener la dirección asociada a tu cuenta"
            }
        }

        return {
            ok: true,
            address,
            message: "Dirección obtenida correctamente"
        }

    } catch (error) {
        console.error(error)

        return {
            ok: false,
            message: "No se pudo obtener la dirección"
        }
    }

}