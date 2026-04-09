"use server"

import { auth } from "@/auth.config";
import { Address, ValidSizes } from "@/interfaces";

interface ProductToOrder {
    productId: string;
    quantity: number;
    size: ValidSizes;
}

export const placeOrder = async (productIds: ProductToOrder[], address: Address) => {


    const session = await auth()
    const userId = session?.user.id

    console.log(productIds, address)


    if (!userId) {
        return {
            ok: false,
            message: "No hay sesión de usuario"
        }
    }

}