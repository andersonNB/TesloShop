import { getPaginatedProductsWithImages } from "@/actions";
import { ErrorComponent, Pagination, ProductGrid, Title } from "@/components";
import { Category } from "@/seed/seed";
import { whichGenderIs } from "@/utils";
import { Metadata } from "next";

interface Props {
	params: Promise<{
		gender: Category;
	}>;
}

export async function generateMetadata(
	{ params }: Props,
): Promise<Metadata> {
	const gender = (await params).gender

	return {
		title: whichGenderIs(gender),
		description: "Sección de articulos para " + gender,
		openGraph: {
			title: whichGenderIs(gender),
			description: "Sección de articulos para " + gender,
		}
	}
}

const CategoryPage = async ({ params }: Props) => {
	const { gender } = await params;
	const { products, totalPages, ok } = await getPaginatedProductsWithImages({ gender })

	// if (id === "kid") return notFound(); no reaction

	if (!ok) {
		return <ErrorComponent />
	}

	return (
		<>
			<Title title="Tienda" subtitle={whichGenderIs(gender)} className="mb-2" />
			<ProductGrid products={products ?? []} />
			<Pagination totalPages={totalPages} />
		</>
	);
};

export default CategoryPage;
