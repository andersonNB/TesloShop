export const revalidate = 0;

import { getPaginatedProductsWithImages } from '@/actions';
import { Pagination, Title } from '@/components';
import { currencyFormat } from '@/utils';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface Props {
    searchParams: Promise<{ page?: string }>
}

export default async function ProductsPage({ searchParams }: Props) {


    const pageSearch = await searchParams
    const { products, totalPages, ok } = await getPaginatedProductsWithImages({ page: Number(pageSearch.page) })

    console.log(products)

    if (!ok) {
        redirect("/auth/login")
    }

    return (
        <>
            <Title title="Mantenimiento de productos" />

            <div className="flex justify-end mb-5">
                <Link href="/admin/product/new" className="btn-primary">
                    Nuevo producto
                </Link>
            </div>

            <div className="mb-10">
                <table className="min-w-full">
                    <thead className="bg-gray-200 border-b">
                        <tr className='h-10'>
                            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-0 text-left">
                                Imagen
                            </th>
                            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-0 text-left">
                                Título
                            </th>
                            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-0 text-left">
                                Precio
                            </th>
                            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-0 text-left">
                                Genero
                            </th>
                            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-0 text-left">
                                Inventario
                            </th>
                            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-0 text-left">
                                Tallas
                            </th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            products.map(product => (
                                <tr key={product.id} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">

                                    <td className="px-6 py-0 whitespace-nowrap text-sm font-medium text-gray-900">
                                        <Link href={`/product/${product.slug}`} >
                                            <Image
                                                src={`/products/${product.images[0]}`}
                                                alt={product.title}
                                                width={50}
                                                height={50}
                                            />
                                        </Link>
                                    </td>
                                    <td className="text-sm text-gray-900 font-light px-6 py-0 whitespace-nowrap">
                                        <Link
                                            href={`/admin/product/${product.slug}`}
                                            className='hover:underline'
                                        >
                                            {product.title}
                                        </Link>
                                    </td>
                                    <td className="py-3 text-sm text-gray-900 font-light px-6">

                                        {currencyFormat(product.price)}
                                    </td>
                                    <td className="py-3 text-sm text-gray-900 font-light px-6">
                                        {product.gender}
                                    </td>
                                    <td className="py-3 text-sm text-gray-900 font-blod px-6">
                                        {product.inStock}
                                    </td>
                                    <td className="py-3 text-sm text-gray-900 font-blod px-6">
                                        {product.sizes.join(", ")}
                                    </td>

                                </tr>
                            ))
                        }
                    </tbody>
                </table>

                <Pagination totalPages={totalPages} />
            </div>
        </>
    );
}