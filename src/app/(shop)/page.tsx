import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { redirect } from "next/navigation";


interface Props {
	searchParams: {
		page?: string;
	}
}

export default async function Home({ searchParams }: Props) {

	const page = await searchParams
	const productsTemp = await getPaginatedProductsWithImages({ page: Number(page.page) })


	if (productsTemp.products.length === 0) {
		redirect("/")
	}

	return (
		<>
			<Title title="Tienda" subtitle="Todos los productos" className="mb-2" />

			<ProductGrid products={productsTemp?.products ?? []} />

			<Pagination totalPages={productsTemp.totalPages ?? 1} />
		</>
	);
}
