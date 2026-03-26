"use client"
import { authenticate } from '@/actions'
import clsx from 'clsx'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { IoInformationOutline } from 'react-icons/io5'

export const LoginForm = () => {

    const [state, dispatch] = useActionState(authenticate, undefined)
    const router = useRouter()
    const { update } = useSession()

    console.log("state: ", state)

    useEffect(() => {
        if (state === "Success") {
            //Este update sirve para actualizar la sesión de mi provider del lado del cliente ya que aunque el server tiene la info
            //no se actualiza automaticamente en el cliente
            update()
            router.replace("/")
        }
    }, [router, state, update])

    return (
        <form action={dispatch} className="flex flex-col">

            <label htmlFor="email">Correo electrónico</label>
            <input
                className="px-5 py-2 border bg-gray-200 rounded mb-5"
                type="email"
                name='email' />


            <label htmlFor="password">Contraseña</label>
            <input
                className="px-5 py-2 border bg-gray-200 rounded mb-5"
                type="password"
                name='password' />

            {state === "CredentialsSignin" && (

                <div className='flex items-center gap-3 mb-5'>
                    <IoInformationOutline className="h-5 w-5 text-red-500" />
                    <p className="text-sm text-red-500">Credenciales no son correctas</p>
                </div>
            )}

            <LoginButton />

            {/* divisor l ine */}
            <div className="flex items-center my-5">
                <div className="flex-1 border-t border-gray-500"></div>
                <div className="px-2 text-gray-800">O</div>
                <div className="flex-1 border-t border-gray-500"></div>
            </div>

            <Link
                href="/auth/new-account"
                className="btn-secondary text-center">
                Crear una nueva cuenta
            </Link>

        </form>
    )
}


function LoginButton() {

    const { pending } = useFormStatus()


    return (
        <button type="submit" className={
            clsx({
                "btn-primary w-full": !pending,
                "btn-disabled w-full cursor-not-allowed": pending
            }
            )
        } aria-disabled={pending} disabled={pending}>
            {pending ? (
                <span className="flex items-center justify-center gap-2">
                    Ingresando...
                </span>
            ) : (
                "Ingresar"
            )}
        </button>
    )
}
