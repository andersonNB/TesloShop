"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"


/**
 * Server action que registra un nuevo usuario en la base de datos.
 *
 * Crea un usuario con el nombre, email y contraseña proporcionados.
 * La contraseña se hashea con bcrypt antes de almacenarse y el email
 * se convierte a minúsculas para mantener consistencia.
 *
 * @param {string} name - Nombre completo del usuario.
 * @param {string} email - Correo electrónico del usuario (se normaliza a minúsculas).
 * @param {string} password - Contraseña en texto plano (se hashea internamente con bcrypt).
 * @returns {Promise<{ok: true, user: {id: string, name: string, email: string}} | {ok: false, message: string}>}
 *   - Si el registro es exitoso, retorna `{ ok: true, user }` con los datos del usuario creado.
 *   - Si ocurre un error, retorna `{ ok: false, message }` con un mensaje descriptivo.
 *
 * @example
 * const result = await registerUser("Juan Pérez", "juan@correo.com", "miPassword123");
 * if (result.ok) {
 *   console.log("Usuario creado:", result.user);
 * } else {
 *   console.error(result.message);
 * }
 */
export const registerUser = async (name: string, email: string, password: string) => {



    try {

        const user = await prisma.user.create({
            data: {
                name,
                email: email.toLowerCase(),
                password: bcrypt.hashSync(password, 10)
            },
            select: {
                id: true,
                name: true,
                email: true
            }
        })


        return {
            ok: true,
            user,
            message: "Usuario creado correctamente"
        }

    } catch (error) {
        console.error({ error })

        return {
            ok: false,
            message: "No se pudo crear el usuario"
        }

    }

}