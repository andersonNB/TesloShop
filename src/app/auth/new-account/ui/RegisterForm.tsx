"use client"
import { registerUser } from '@/actions'
import clsx from 'clsx'
import Link from 'next/link'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

type FormInputs = {
    name: string
    email: string
    password: string
}

export const RegisterForm = () => {

    const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>()
    const [errorMessage, setErroMessage] = useState("")


    const onSubmit: SubmitHandler<FormInputs> = async (data: FormInputs) => {


        const { email, password, name } = data

        if (email.trim().length === 0 || password.trim().length === 0 || name.trim().length === 0) return

        const response = await registerUser(name, email, password)

        if (!response.ok) {
            setErroMessage(response.message)
            return;
        }

        setErroMessage("")
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">

            <label htmlFor="email" className={
                clsx(
                    "text-md",
                    {
                        "text-red-500": !!errors.name
                    }
                )
            }>Nombre completo</label>
            <input
                className={
                    clsx(
                        "px-5 py-2 border bg-gray-200 rounded mb-5",
                        {
                            "border-red-500": !!errors.name
                        }
                    )
                }
                type="text"
                {...register("name", { required: true })}
            />


            <label htmlFor="email" className={
                clsx(
                    "text-md",
                    {
                        "text-red-500": !!errors.email
                    }
                )
            }>Correo electrónico</label>
            <input
                className={
                    clsx(
                        "px-5 py-2 border bg-gray-200 rounded mb-5",
                        {
                            "border-red-500": !!errors.email
                        }
                    )
                }
                // type="email"
                {...register("email", { required: true, pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, })}
            />
            {/* {
                errors?.email && (
                    <p className="text-red-500">El correo electrónico no es válido</p>
                )
            } */}


            <label htmlFor='password' className={
                clsx(
                    "text-md",
                    {
                        "text-red-500": !!errors.password
                    }
                )
            }>Contraseña</label>
            <input
                className={
                    clsx(
                        "px-5 py-2 border bg-gray-200 rounded mb-5",
                        {
                            "border-red-500": !!errors.password
                        }
                    )
                }
                type='password'
                {...register("password", { required: true })}
            />

            {
                errorMessage.length > 0 && <span className='text-red-500 mb-2'>{errorMessage}</span>
            }

            <button
                type="submit"
                className="btn-primary"
            >
                Crear cuenta
            </button>


            {/* divisor l ine */}
            <div className="flex items-center my-5">
                <div className="flex-1 border-t border-gray-500"></div>
                <div className="px-2 text-gray-800">O</div>
                <div className="flex-1 border-t border-gray-500"></div>
            </div>

            <Link
                href="/auth/login"
                className="btn-secondary text-center">
                Iniciar sesión
            </Link>

        </form>
    )
}
