"use client"
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5'


interface Props {
    totalPages: number
}

export const Pagination = ({ totalPages }: Props) => {

    const searchParams = useSearchParams()
    const pathname = usePathname()
    const currentPage = Number(searchParams.get("page") ?? 1)

    const createPageUrl = (pageNumber: number | string) => {

        const params = new URLSearchParams(searchParams)
        if (pageNumber === "...") {
            return `${pathname}?${params.toString()}` // Al retornar la combinación de ambos, lo que estás haciendo es generar un enlace que mantiene al usuario en la misma página y con los mismos parámetros actuales.
        }
        console.log(pageNumber)
        if (pageNumber === 0) {
            return `${pathname}` //similar al href
        }

        if (Number(pageNumber) > totalPages) {
            return `${pathname}?${params.toString()}`
        }

        params.set("page", pageNumber.toString())
        return `${pathname}?${params.toString()}`
    }

    return (
        <div className="flex justify-center text-center mt-10 mb-32">
            <nav aria-label="Page navigation example">
                <ul className="flex list-style-none">
                    <li className="page-item">
                        <Link href={createPageUrl(currentPage - 1)} className="page-link relative block py-1.5 px-3  border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none">
                            <IoChevronBackOutline size={30} />
                        </Link>
                    </li>
                    {
                        Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                            <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
                                <Link
                                    className={`page-link relative block py-1.5 px-3  border-0  outline-none transition-all duration-300 rounded text-gray-800  focus:shadow-none ${currentPage === page ? "bg-blue-600 text-white hover:text-white hover:bg-blue-600" : "hover:text-gray-800 hover:bg-gray-200"}`}
                                    href={createPageUrl(page)}>
                                    {page}
                                </Link>
                            </li>
                        ))
                    }

                    <li className="page-item">
                        <Link href={createPageUrl(currentPage + 1)} className="page-link relative block py-1.5 px-3  border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none">
                            <IoChevronForwardOutline size={30} />
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}