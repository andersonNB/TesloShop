"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { verifyAdminSession } from "../auth/verify-admin-session"

/**
 * Cambia el **rol** de un usuario existente en el sistema.
 * Es una acción exclusiva para administradores.
 *
 * ### Acceso
 * - Requiere que la sesión activa tenga el rol `"admin"`.
 * - Si el usuario no tiene ese rol (o no hay sesión), devuelve `ok: false`
 *   sin modificar ningún dato.
 *
 * ### Revalidación
 * Tras una actualización exitosa llama a `revalidatePath("/admin/users")`
 * para refrescar la lista de usuarios en el panel de administración.
 *
 * @param {string}            userId - ID único del usuario cuyo rol se modificará.
 * @param {"admin" | "user"}  role   - Nuevo rol que se asignará al usuario.
 *
 * @returns {Promise<{ ok: false; message: string } | { ok: true; user: User }>}
 *   - `ok: false` + `message` si el solicitante no es admin o si ocurre un error de BD.
 *   - `ok: true`  + `user`    con los datos actualizados del usuario.
 *
 * @throws No lanza excepciones; los errores de BD se capturan y se retornan
 *   como `{ ok: false, message }`.
 *
 * @example
 * const result = await changeUserRole("clx123abc", "admin");
 *
 * if (!result.ok) {
 *   console.error(result.message);
 *   return;
 * }
 *
 * console.log(`Rol actualizado: ${result.user.role}`);
 */
export const changeUserRole = async (userId: string, role: "admin" | "user") => {

    const adminCheck = await verifyAdminSession()
    if (!adminCheck.ok) return adminCheck

    try {

        const user = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                role
            }
        })

        revalidatePath("/admin/users")
        return {
            ok: true,
            user
        }

    } catch (error) {
        console.error(error)
        return {
            ok: false,
            message: "Error al cambiar el rol del usuario"
        }
    }

}