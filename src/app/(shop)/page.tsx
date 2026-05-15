export const revalidate = 60;
import { getPaginatedProductsWithImages } from "@/actions";
import { ErrorComponent, Pagination, ProductGrid, Title } from "@/components";
import Link from "next/link";


interface Props {
	searchParams: {
		page?: string;
	}
}

export default async function Home({ searchParams }: Props) {

	const pageSearch = await searchParams
	const { products, totalPages, ok } = await getPaginatedProductsWithImages({ page: Number(pageSearch.page) })

	if (!ok) {
		// Podrías retornar un componente de error personalizado aquí
		return (
			<ErrorComponent />
		)
	}

	if (products.length === 0) {
		return (
			<div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
				<Title title="Tienda" subtitle="Aun no hay productos publicados" className="mb-0" />
				<p className="max-w-md text-gray-500">
					La base de datos ya esta conectada, pero este entorno todavia no tiene productos cargados.
				</p>
				<Link href="/auth/login" className="rounded-md bg-blue-600 px-4 py-2 text-white">
					Ir al login
				</Link>
			</div>
		)
	}

	return (
		<>
			<Title title="Tienda" subtitle="Todos los productos" className="mb-2" />
			<ProductGrid products={products} />
			<Pagination totalPages={totalPages} />
		</>
	);
}
