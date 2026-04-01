"use client"
import { Country } from '@/interfaces';
import { useAddressStore } from '@/store';
import clsx from 'clsx';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';


type FormInputs = {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    postalCode: string;
    city: string;
    country: string;
    phone: string;
    rememberAddress: boolean
}

interface Props {
    countries: Country[]
}

export const AddressForm = ({ countries }: Props) => {

    const { formState: { isValid }, handleSubmit, control, reset } = useForm<FormInputs>({
        defaultValues: {
            //TODO: Cargar info de la base de datos
            firstName: "",
            lastName: "",
            address: "",
            address2: "",
            postalCode: "",
            city: "",
            country: "",
            phone: "",
            rememberAddress: false
        }
    });

    const setAddress = useAddressStore(state => state.setAddress)
    const address = useAddressStore(state => state.address)

    //TODO: todo es requerido en el formulario menos dirección 2 y recordar dirección, hacer un schema correspondiente.
    const onSubmit = (data: FormInputs) => {
        console.log(data)
        setAddress(data)
    }


    useEffect(() => {
        if (address.firstName) {
            reset(address)
        }
    }, [address, reset])


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2">
            <div className="flex flex-col mb-2">
                <span>Nombres</span>
                <Controller
                    name="firstName"
                    control={control}
                    render={({ field, fieldState }) => {
                        console.log("fieldState: ", fieldState)
                        return (

                            <>
                                <input type="text" className="p-2 border rounded-md bg-gray-200" {...field} />


                                {fieldState?.error && (
                                    <p className="text-red-500">{fieldState?.error.message}</p>
                                )}

                            </>

                        )
                    }}


                />
            </div>

            <div className="flex flex-col mb-2">
                <span>Apellidos</span>
                <Controller
                    name="lastName"
                    control={control}
                    render={({ field, fieldState }) => {
                        return (
                            <>
                                <input type="text" className="p-2 border rounded-md bg-gray-200" {...field} />
                                {fieldState?.error && (
                                    <p className="text-red-500">{fieldState?.error.message}</p>
                                )}
                            </>
                        )
                    }}
                />
            </div>

            <div className="flex flex-col mb-2">
                <span>Dirección</span>
                <Controller
                    name="address"
                    control={control}
                    render={({ field, fieldState }) => {
                        return (
                            <>
                                <input type="text" className="p-2 border rounded-md bg-gray-200" {...field} />
                                {fieldState?.error && (
                                    <p className="text-red-500">{fieldState?.error.message}</p>
                                )}
                            </>
                        )
                    }}
                />
            </div>

            <div className="flex flex-col mb-2">
                <span>Dirección 2 (opcional)</span>
                <Controller
                    name="address2"
                    control={control}
                    render={({ field, fieldState }) => {
                        return (
                            <>
                                <input type="text" className="p-2 border rounded-md bg-gray-200" {...field} />
                                {fieldState?.error && (
                                    <p className="text-red-500">{fieldState?.error.message}</p>
                                )}
                            </>
                        )
                    }}
                />
            </div>

            <div className="flex flex-col mb-2">
                <span>Código postal</span>
                <Controller
                    name="postalCode"
                    control={control}
                    render={({ field, fieldState }) => {
                        return (
                            <>
                                <input type="text" className="p-2 border rounded-md bg-gray-200" {...field} />
                                {fieldState?.error && (
                                    <p className="text-red-500">{fieldState?.error.message}</p>
                                )}
                            </>
                        )
                    }}
                />
            </div>

            <div className="flex flex-col mb-2">
                <span>Ciudad</span>
                <Controller
                    name="city"
                    control={control}
                    render={({ field, fieldState }) => {
                        return (
                            <>
                                <input type="text" className="p-2 border rounded-md bg-gray-200" {...field} />
                                {fieldState?.error && (
                                    <p className="text-red-500">{fieldState?.error.message}</p>
                                )}
                            </>
                        )
                    }}
                />
            </div>

            <div className="flex flex-col mb-2">
                <span>País</span>
                <Controller
                    name="country"
                    control={control}
                    render={({ field, fieldState }) => {
                        return (
                            <>
                                <select className="p-2 border rounded-md bg-gray-200" {...field}>
                                    <option value="">[ Seleccione ]</option>
                                    {
                                        countries.map(country => (

                                            <option key={country.id} value={country.id}>{country.name}</option>

                                        ))
                                    }
                                </select>
                                {fieldState?.error && (
                                    <p className="text-red-500">{fieldState?.error.message}</p>
                                )}
                            </>
                        )
                    }}
                />
            </div>

            <div className="flex flex-col mb-2">
                <span>Teléfono</span>
                <Controller
                    name="phone"
                    control={control}
                    render={({ field, fieldState }) => {
                        return (
                            <>
                                <input type="text" className="p-2 border rounded-md bg-gray-200" {...field} />
                                {fieldState?.error && (
                                    <p className="text-red-500">{fieldState?.error.message}</p>
                                )}
                            </>
                        )
                    }}
                />
            </div>
            <div className="flex items-center">
                <label
                    className="relative flex cursor-pointer items-center rounded-full p-3"
                    htmlFor="checkbox"
                    data-ripple-dark="true"
                >
                    <Controller
                        name="rememberAddress"
                        control={control}
                        render={({ field, fieldState }) => {
                            return (
                                <>
                                    <input
                                        type="checkbox"
                                        className=" border-gray-500 before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
                                        id="checkbox"
                                        checked={field.value}
                                        onChange={field.onChange}
                                    />
                                    {fieldState?.error && (
                                        <p className="text-red-500">{fieldState?.error.message}</p>
                                    )}
                                </>
                            )
                        }}
                    />
                    <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="1"
                        >
                            <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                    </div>
                </label>

                <span>¿Recodar dirección?</span>
            </div>
            <div></div>

            <link
                rel="stylesheet"
                href="https://unpkg.com/@material-tailwind/html@latest/styles/material-tailwind.css"
            />

            <div className="flex flex-col mb-2 sm:mt-10">
                <button
                    // href="/checkout"
                    type='submit'
                    className={
                        clsx({
                            "btn-primary flex w-full sm:w-1/2 justify-center ": isValid,
                            "btn-disabled flex w-full sm:w-1/2 justify-center ": !isValid
                        })
                    }
                    disabled={!isValid}
                >
                    Siguiente.
                </button>
            </div>
        </form>
    )
}
