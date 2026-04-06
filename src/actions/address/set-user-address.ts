'use server'

import { Address } from "@/interfaces"
import { prisma } from "@/lib/prisma"


/**
 * Server action que guarda o actualiza la dirección de envío de un usuario.
 *
 * Delega la lógica de crear/actualizar a {@link createOrReplaceAddress},
 * implementando un patrón "upsert" manual (busca si existe → crea o actualiza).
 *
 * @param address - Datos de la dirección provenientes del formulario de checkout.
 *                  El campo `country` contiene el ID del país (countryId), no el nombre.
 * @param userId - ID del usuario autenticado al que se le asocia la dirección.
 *
 * @returns Objeto con:
 *   - `ok: true` y `address` con los datos guardados si fue exitoso.
 *   - `ok: false` y `message` con el error si falló.
 *
 * @example
 * // Desde un componente cliente:
 * const result = await setUserAddress(formData, session.user.id);
 * if (result.ok) {
 *   console.log('Dirección guardada:', result.address);
 * }
 */
export const setUserAddress = async (address: Address, userId: string) => {

    try {

        const newAddress = await createOrReplaceAddress(address, userId)

        return {
            ok: true,
            address: newAddress?.address,
            message: "Dirección guardada correctamente"
        }
    } catch (error) {
        console.error(error)

        return {
            ok: false,
            message: "No se pudo guardar la dirección"
        }
    }
}

/**
 * Función auxiliar que implementa la lógica de "upsert" para la dirección.
 *
 * Flujo:
 *   1. Busca si ya existe una dirección para el `userId` (findUnique por userId que es @unique).
 *   2. Si NO existe → crea una nueva dirección con `prisma.userAddress.create()`.
 *   3. Si SÍ existe → actualiza la dirección existente con `prisma.userAddress.update()`.
 *
 * @param address - Datos de la dirección del formulario (interface Address).
 *                  Nota: `address.country` se mapea a `countryId` en la DB.
 * @param userId - ID del usuario. Se usa tanto para buscar la dirección existente
 *                 como para asociar la nueva dirección.
 *
 * @returns Objeto con:
 *   - `ok: true` y `address` (UserAddress de Prisma) si la operación fue exitosa.
 *   - `ok: false` y `message` si ocurrió un error en la DB.
 *
 * @remarks
 * Se podría simplificar usando `prisma.userAddress.upsert()` que combina
 * create + update en una sola operación:
 * ```ts
 * await prisma.userAddress.upsert({
 *   where: { userId },
 *   create: addressToSave,
 *   update: addressToSave,
 * });
 * ```
 */
const createOrReplaceAddress = async (address: Address, userId: string) => {

    try {

        const storeAddress = await prisma.userAddress.findUnique({
            where: {
                userId
            }
        });

        /** Objeto mapeado del formulario (Address) al modelo de Prisma (UserAddress).
         *  Nota: address.country (string del select) se mapea a countryId (FK en la DB). */
        const addressToSave = {
            userId,
            address: address.address,
            address2: address.address2,
            countryId: address.country,
            firstName: address.firstName,
            lastName: address.lastName,
            phone: address.phone,
            postalCode: address.postalCode,
            city: address.city
        }

        // Si no existe una dirección previa → crear una nueva
        if (!storeAddress) {
            const newAddress = await prisma.userAddress.create({
                data: addressToSave
            });


            return {
                ok: true,
                address: newAddress
            }
        }

        // Si ya existe una dirección → actualizar con los nuevos datos
        const updatedAddress = await prisma.userAddress.update({
            where: {
                userId
            },
            data: addressToSave
        })

        return {
            ok: true,
            address: updatedAddress
        }

    } catch (error) {
        console.error(error)

        return {
            ok: false,
            message: "No se pudo guardar la dirección"
        }
    }

}