"use server"
import { signIn } from "@/auth.config";
import { AuthError } from "next-auth";


/**
 * Server action para autenticar un usuario mediante credenciales.
 *
 * Diseñada para ser usada con `useFormState` de React. Recibe el estado
 * previo y los datos del formulario, intenta iniciar sesión con Auth.js
 * y retorna un string indicando el resultado.
 *
 * @param {string | undefined} prevState - Estado previo del formulario (manejado por `useFormState`).
 * @param {FormData} formData - Datos del formulario con los campos `email` y `password`.
 * @returns {Promise<string>} Retorna `"Success"` si la autenticación es exitosa,
 *   `"CredentialsSignin"` si las credenciales son inválidas, o `"UnknownError"` para otros errores de Auth.js.
 * @throws {Error} Re-lanza errores que no sean de tipo `AuthError`.
 *
 * @example
 * // Uso con useFormState en un componente cliente
 * const [state, dispatch] = useFormState(authenticate, undefined);
 */
export async function authenticate(
    prevState: string | undefined,
    formData: FormData
) {
    try {
        // console.log("actions auth:", Object.fromEntries(formData))
        await signIn("credentials", { ...Object.fromEntries(formData), redirect: false })

        return "Success"
    } catch (error) {


        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":

                    return "CredentialsSignin"

                default:
                    return "UnknownError"
            }
        }

        throw error
    }
}



/**
 * Server action para iniciar sesión con email y contraseña.
 *
 * A diferencia de `authenticate`, esta función recibe los parámetros
 * directamente (no como `FormData`) y retorna un objeto con el estado
 * del resultado, lo que facilita su uso desde componentes cliente.
 *
 * @param {string} email - Correo electrónico del usuario.
 * @param {string} password - Contraseña del usuario.
 * @returns {Promise<{ok: true} | {ok: false, message: string}>}
 *   - Si el login es exitoso, retorna `{ ok: true }`.
 *   - Si ocurre un error, retorna `{ ok: false, message }` con un mensaje descriptivo.
 *
 * @example
 * const result = await login("juan@correo.com", "miPassword123");
 * if (result.ok) {
 *   router.replace("/");
 * } else {
 *   console.error(result.message);
 * }
 */
export const login = async (email: string, password: string) => {

    try {
        // el signIn de next-auth redirige por defecto y puede causar errores( Error: NEXT_REDIRECT) 
        // si queremos redirigir desde el cliente, debemos pasar redirect: false
        // cuando queremos hacer la dirección desde el server tenemos que tener en cuenta que la funcion signIn retorna un "error" con el tipo NEXT_REDIRECT
        // por lo tanto o lo capturamos en el trycatch o lo sacamos de dicho bloque o usamos redirect:false
        // await signIn("credentials", { email, password, redirectTo: "/" })
        await signIn("credentials", { email, password, redirect: false })


        return {
            ok: true
        }

    } catch (error) {
        console.error({ error })

        if (error instanceof AuthError) {
            return {
                ok: false,
                message: "No se pudo iniciar sesión"
            }
        }

        throw error // re-lanza  NEXT_REDIRECT 
    }
}