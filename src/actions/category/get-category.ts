"use server"
import { prisma } from "@/lib/prisma"

/**
 * Recupera **todas** las categorías disponibles en el sistema.
 *
 * ### Acceso
 * - No requiere autenticación ni rol específico.
 * - Puede usarse tanto en Server Actions como en Server Components.
 *
 * @returns {Promise<{ ok: false; message: string } | { ok: true; categories: Category[] }>}
 *   - `ok: false` + `message` si ocurre un error al consultar la base de datos.
 *   - `ok: true`  + `categories` con la lista completa de categorías.
 *
 * @throws No lanza excepciones; los errores de BD se capturan y se retornan
 *   como `{ ok: false, message }`.
 *
 * @example
 * const result = await getAllCategories();
 *
 * if (!result.ok) {
 *   console.error(result.message);
 *   return;
 * }
 *
 * result.categories.forEach(category => {
 *   console.log(category.id, category.name);
 * });
 */
export const getAllCategories = async () => {
    try {
        const categories = await prisma.category.findMany()

        console.log(categories)
        return {
            ok: true,
            categories
        }
    } catch (error) {
        console.error(error)
        return {
            ok: false,
            message: `Error al obtener las categorias ${error}`
        }
    }

}