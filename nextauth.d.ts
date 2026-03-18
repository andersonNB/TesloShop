import { DefaultSession } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            name: string
            email: string
            emailVerified?: boolean
            role: string
            image?: string
            customProps?: string
        } & DefaultSession["user"],
        customProps2?: string
    }

    // interface User {
    //     id: string
    //     name: string
    //     email: string
    //     emailVerified?: boolean
    //     role: string
    //     image?: string
    //     customProps?: string
    // }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        data: {
            id: string
            name: string
            email: string
            emailVerified?: boolean
            role: string
            image?: string
            customProps?: string
        }
        customProps2?: string
    }
}