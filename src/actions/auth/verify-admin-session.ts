"use server"

import { auth } from "@/auth.config"

/**
 * Verifica que la sesión activa pertenezca a un usuario con rol `"admin"`.
 *
 * Este helper centraliza la validación de acceso administrativo que de otro
 * modo se repetiría en cada Server Action protegida. Debe llamarse al inicio
 * de cualquier acción que requiera privilegios de administrador.
 *
 * ### Uso recomendado
 * ```ts
 * const adminCheck = await verifyAdminSession();
 * if (!adminCheck.ok) return adminCheck; // { ok: false, message }
 * ```
 *
 * @returns {Promise<{ ok: true } | { ok: false; message: string }>}
 *   - `ok: true`  si hay sesión válida y el usuario tiene rol `"admin"`.
 *   - `ok: false` + `message` si no hay sesión o el rol no es `"admin"`.
 *
 * @example
 * export const myAdminAction = async () => {
 *   const adminCheck = await verifyAdminSession();
 *   if (!adminCheck.ok) return adminCheck;
 *
 *   // lógica protegida ...
 * };
 */
export const verifyAdminSession = async (): Promise<{ ok: true } | { ok: false; message: string }> => {

    const session = await auth()

    if (session?.user.role !== "admin") {
        return {
            ok: false,
            message: "No tiene permiso para realizar esta acción"
        }
    }

    return { ok: true }
}
