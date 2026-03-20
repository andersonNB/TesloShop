"use client"
import Link from 'next/link'
import { SubmitHandler, useForm } from 'react-hook-form'

type FormInputs = {
    name: string
    email: string
    password: string
}

export const RegisterForm = () => {

    const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>()


    const onSubmit: SubmitHandler<FormInputs> = async (data: FormInputs) => {
        console.log(data)
    }
    console.log(errors)
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">

            <label htmlFor="email">Nombre completo</label>
            <input
                className="px-5 py-2 border bg-gray-200 rounded mb-5"
                type="text"
                {...register("name", { required: true })}
            />


            <label htmlFor="email">Correo electrónico</label>
            <input
                className="px-5 py-2 border bg-gray-200 rounded mb-5"
                // type="email"
                {...register("email", { required: true, pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, })}
            />
            {
                errors?.email && (
                    <p className="text-red-500">El correo electrónico no es válido</p>
                )
            }


            <label htmlFor='password'>Contraseña</label>
            <input
                className='px-5 py-2 border bg-gray-200 rounded mb-5'
                type='password'
                {...register("password", { required: true })}
            />

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
