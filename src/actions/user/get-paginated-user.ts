"use server"

import { auth } from "@/auth.config"
import { prisma } from "@/lib/prisma"

interface PaginationOptions {
    page?: number;
    take?: number;
}

/**
 * Recupera una **página** de usuarios registrados en el sistema, ordenados
 * alfabéticamente por nombre. Es una acción exclusiva para administradores.
 *
 * ### Acceso
 * - Requiere que la sesión activa tenga el rol `"admin"`.
 * - Si el usuario no tiene ese rol (o no hay sesión), devuelve `ok: false`.
 *
 * ### Paginación
 * - `page` indica la página actual (mínimo 1). Por defecto `1`.
 * - `take` indica cuántos registros por página. Por defecto `10`.
 * - Internamente calcula `skip = (page - 1) * take`.
 * - Devuelve `totalPages = Math.ceil(totalCount / take)` para que el
 *   componente `<Pagination>` reciba el número de páginas, no el total
 *   de registros.
 *
 * @param {PaginationOptions} options - Opciones de paginación.
 * @param {number} [options.page=1]  - Número de página a recuperar (≥ 1).
 * @param {number} [options.take=10] - Cantidad de registros por página.
 *
 * @returns {Promise<{ ok: false; message: string } | { ok: true; users: User[]; totalPages: number; currentPage: number }>}
 *   - `ok: false` + `message` si el usuario no es admin o si ocurre un error de BD.
 *   - `ok: true`  + `users`       : página de usuarios ordenados por nombre.
 *                + `totalPages`   : número total de páginas.
 *                + `currentPage`  : página actualmente devuelta.
 *
 * @throws No lanza excepciones; los errores de BD se capturan y se retornan
 *   como `{ ok: false, message }`.
 *
 * @example
 * const result = await getPaginatedUser({ page: 2, take: 10 });
 *
 * if (!result.ok) {
 *   console.error(result.message);
 *   return;
 * }
 *
 * console.log(`Página ${result.currentPage} de ${result.totalPages}`);
 * result.users.forEach(user => {
 *   console.log(user.id, user.name, user.email);
 * });
 */
export const getPaginatedUser = async ({ page = 1, take = 10 }: PaginationOptions = {}) => {

    // Sanear valores de paginación
    if (isNaN(Number(page))) page = 1;
    if (page < 1) page = 1;
    if (isNaN(Number(take))) take = 10;

    const session = await auth()

    if (session?.user.role !== "admin") {
        return {
            ok: false,
            message: "No tiene permiso para ver los usuarios"
        }
    }

    try {

        const [users, totalCount] = await Promise.all([

            prisma.user.findMany({
                take,
                skip: (page - 1) * take,
                orderBy: {
                    name: "asc"
                }
            }),

            prisma.user.count()
        ])

        const totalPages = Math.ceil(totalCount / take);

        return {
            ok: true,
            currentPage: page,
            totalPages,
            users,
        }

    } catch (error) {

        console.error(error)

        return {
            ok: false,
            message: `Error al obtener los usuarios: ${error}`
        }

    }

}