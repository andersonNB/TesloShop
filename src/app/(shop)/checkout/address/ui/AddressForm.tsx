"use client"
import { deleteUserAddress, setUserAddress } from '@/actions';
import { ModalAddressForm } from '@/components';
import { Address, Country } from '@/interfaces';
import { addressFormSchema } from '@/schema/addressForm';
import { useAddressStore } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Control, Controller, useForm } from 'react-hook-form';


type FormInputs = {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    postalCode: string;
    city: string;
    country: string;
    phone: string;
    rememberAddress?: boolean
}

// ── Componente reutilizable para campos de texto ──
interface FormFieldProps {
    name: keyof FormInputs;
    label: string;
    control: Control<FormInputs>;
}

const FormField = ({ name, label, control }: FormFieldProps) => (
    <div className="flex flex-col mb-2">
        <span>{label}</span>
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <>
                    <input
                        type="text"
                        className="p-2 border rounded-md bg-gray-200"
                        {...field}
                        value={field.value as string ?? ""}
                    />
                    {fieldState?.error ? (
                        <p className="text-red-500">{fieldState.error.message}</p>
                    ) : null}
                </>
            )}
        />
    </div>
)

// ── Props del formulario ──
interface Props {
    countries: Country[]
    userStoredAddress?: Partial<Address>
}

export const AddressForm = ({ countries, userStoredAddress = {} }: Props) => {

    const { formState: { isValid }, handleSubmit, control, reset } = useForm<FormInputs>({
        resolver: zodResolver(addressFormSchema),
        defaultValues: {
            firstName: userStoredAddress.firstName || "",
            lastName: userStoredAddress.lastName || "",
            address: userStoredAddress.address || "",
            address2: userStoredAddress.address2 || "",
            postalCode: userStoredAddress.postalCode || "",
            city: userStoredAddress.city || "",
            country: userStoredAddress.countryId || "",
            phone: userStoredAddress.phone || "",
            rememberAddress: false
        }
    });
    const { data: session } = useSession({ required: true })
    const setAddress = useAddressStore(state => state.setAddress)
    const address = useAddressStore(state => state.address)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const router = useRouter()

    const onSubmit = async (data: FormInputs) => {
        setAddress(data)
        const { rememberAddress, ...restAddress } = data

        if (rememberAddress) {
            const response = await setUserAddress(restAddress, session!.user.id)
            if (response.ok) {
                setError("")
                setSuccess(response.message || "Dirección guardada correctamente")
            } else {
                setError(response.message || "No se pudo guardar la dirección")
            }
        } else {
            const response = await deleteUserAddress(session!.user.id)
            if (response.ok) {
                setSuccess(response.message || "Dirección eliminada correctamente")
            } else {
                setError(response.message || "No se pudo eliminar la dirección")
            }
        }
    }

    useEffect(() => {
        if (Object.keys(userStoredAddress).length === 0 && address.firstName) {
            reset(address)
        }
    }, [address, reset, userStoredAddress])


    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2">

                <FormField name="firstName" label="Nombres" control={control} />
                <FormField name="lastName" label="Apellidos" control={control} />
                <FormField name="address" label="Dirección" control={control} />
                <FormField name="address2" label="Dirección 2 (opcional)" control={control} />
                <FormField name="postalCode" label="Código postal" control={control} />
                <FormField name="city" label="Ciudad" control={control} />

                {/* País — select especial, no usa FormField */}
                <div className="flex flex-col mb-2">
                    <span>País</span>
                    <Controller
                        name="country"
                        control={control}
                        render={({ field, fieldState }) => (
                            <>
                                <select className="p-2 border rounded-md bg-gray-200" {...field}>
                                    <option value="">[ Seleccione ]</option>
                                    {countries.map(country => (
                                        <option key={country.id} value={country.id}>{country.name}</option>
                                    ))}
                                </select>
                                {fieldState?.error ? (
                                    <p className="text-red-500">{fieldState.error.message}</p>
                                ) : null}
                            </>
                        )}
                    />
                </div>

                <FormField name="phone" label="Teléfono" control={control} />

                {/* Checkbox — Recordar dirección */}
                <div className="flex items-center">
                    <label
                        className="relative flex cursor-pointer items-center rounded-full p-3"
                        htmlFor="checkbox"
                        data-ripple-dark="true"
                    >
                        <Controller
                            name="rememberAddress"
                            control={control}
                            render={({ field }) => (
                                <input
                                    type="checkbox"
                                    className="border-gray-500 before:content-[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
                                    id="checkbox"
                                    checked={!!field.value}
                                    onChange={field.onChange}
                                />
                            )}
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

                    <span>¿Recordar dirección?</span>
                </div>

                {/* Error message */}
                {error.length > 0 ? (
                    <p className="text-red-500 sm:col-span-2">{error}</p>
                ) : null}

                {/* Submit button */}
                <div className="flex flex-col mb-2 sm:col-span-2 sm:mt-10">
                    <button
                        type='submit'
                        className={
                            clsx({
                                "btn-primary flex w-full sm:w-1/2 justify-center ": isValid,
                                "btn-disabled flex w-full sm:w-1/2 justify-center ": !isValid
                            })
                        }
                    >
                        Siguiente
                    </button>
                </div>
            </form>

            <ModalAddressForm
                message={success}
                isOpen={!!success}
                onClose={() => {
                    setSuccess("")
                    router.push("/checkout")
                }}
            />
        </>
    )
}
