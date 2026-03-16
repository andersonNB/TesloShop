"use server"
import { signIn } from "@/auth.config";
import { AuthError } from "next-auth";


// authorize() → retorna null
//   → Auth.js internamente → lanza CredentialsSignin
//     → signIn() en tu action → aquí es donde debes atraparlo ⬅️

export async function authenticate(
    prevState: string | undefined,
    formData: FormData
) {
    try {
        // console.log("actions auth:", Object.fromEntries(formData))
        await signIn("credentials", { ...Object.fromEntries(formData) })
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