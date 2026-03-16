import type { NextAuthConfig } from 'next-auth';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { prisma } from './lib/prisma';
import bcrypt from 'bcryptjs';

export const authConfig = {
    pages: {
        signIn: "/auth/login",
        newUser: "/auth/new-account"
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                console.log("auth.config: ", credentials)
                try {
                    const parsedCredentials = z
                        .object({ email: z.string().email(), password: z.string().min(6) })
                        .safeParse(credentials);


                    if (!parsedCredentials.success) return null

                    const { email, password } = parsedCredentials.data

                    // console.log("auth.config", { email, password })

                    //buscar el correo
                    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })

                    //Si no existe el usuario retornamos null
                    if (!user) return null

                    //Si no coincide la contraseña retornamos null
                    if (!bcrypt.compareSync(password, user.password)) return null

                    //regresar el usuario sin el password
                    const { password: _, ...rest } = user

                    //regresar el usuario
                    return rest
                } catch (error) {
                    console.error("Error en authorize: ", error)
                    return null
                }
            },
        }),
    ],
} satisfies NextAuthConfig;


export const { signIn, signOut, auth } = NextAuth(authConfig)