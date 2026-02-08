export const revalidate = 60;
import { getPaginatedProductsWithImages } from "@/actions";
import { ErrorComponent, Pagination, ProductGrid, Title } from "@/components";
import { redirect } from "next/navigation";


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
		redirect("/")
	}

	return (
		<>
			<Title title="Tienda" subtitle="Todos los productos" className="mb-2" />
			<ProductGrid products={products} />
			<Pagination totalPages={totalPages} />
		</>
	);
}
