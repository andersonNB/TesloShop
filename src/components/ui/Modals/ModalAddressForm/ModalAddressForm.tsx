"use client"

import { useEffect, useCallback } from "react"

interface Props {
    /** Mensaje que se muestra en el modal */
    message: string
    /** Controla la visibilidad del modal */
    isOpen: boolean
    /** Callback para cerrar el modal */
    onClose: () => void
    /** Tiempo en ms antes de cerrar automáticamente (default: 3000) */
    autoCloseDuration?: number
}

/**
 * Modal de éxito para el formulario de dirección.
 * Muestra una animación de checkmark con un mensaje de confirmación.
 * Se cierra automáticamente después de un tiempo configurable o al hacer clic.
 */
export const ModalAddressForm = ({
    message,
    isOpen,
    onClose,
    autoCloseDuration = 3000
}: Props) => {

    const handleClose = useCallback(() => {
        onClose()
    }, [onClose])

    // Auto-cerrar después del tiempo configurado
    useEffect(() => {
        if (!isOpen) return

        const timer = setTimeout(() => {
            handleClose()
        }, autoCloseDuration)

        return () => clearTimeout(timer)
    }, [isOpen, autoCloseDuration, handleClose])

    // Cerrar con Escape
    useEffect(() => {
        if (!isOpen) return

        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleClose()
        }

        window.addEventListener("keydown", handleEsc)
        return () => window.removeEventListener("keydown", handleEsc)
    }, [isOpen, handleClose])

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
            aria-label="Confirmación de dirección"
        >
            {/* Backdrop con blur */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]" />

            {/* Modal Card */}
            <div
                className="relative z-10 mx-4 w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl animate-[scaleIn_0.3s_ease-out]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Checkmark animado */}
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-200">
                    <svg
                        className="h-10 w-10 text-white animate-[drawCheck_0.5s_ease-out_0.2s_both]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path
                            d="M5 13l4 4L19 7"
                            className="[stroke-dasharray:30] [stroke-dashoffset:30] animate-[strokeDash_0.5s_ease-out_0.3s_forwards]"
                        />
                    </svg>
                </div>

                {/* Texto */}
                <h3 className="mb-2 text-center text-xl font-bold text-gray-800">
                    ¡Listo!
                </h3>
                <p className="mb-6 text-center text-sm text-gray-500 leading-relaxed">
                    {message ?? "N/A"}
                </p>


                {/* Botón cerrar */}
                <button
                    onClick={handleClose}
                    className="w-full cursor-pointer rounded-xl bg-linear-to-r from-emerald-500 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition-all duration-200 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg hover:shadow-emerald-300 active:scale-[0.98]"
                >
                    Continuar
                </button>
            </div>
        </div>
    )
}