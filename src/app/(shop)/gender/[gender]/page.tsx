import { getPaginatedProductsWithImages } from "@/actions";
import { ErrorComponent, Pagination, ProductGrid, Title } from "@/components";
import { Category } from "@/seed/seed";

interface Props {
	params: Promise<{
		gender: Category;
	}>;
}

const CategoryPage = async ({ params }: Props) => {
	const { gender } = await params;
	console.log(gender);

	const { products, totalPages, ok } = await getPaginatedProductsWithImages({ gender })

	// if (id === "kid") return notFound();

	if (!ok) {
		return <ErrorComponent />
	}

	const whichTitle = () => {
		switch (gender) {
			case "men":
				return "Articulos para hombres";
			case "women":
				return "Artículos para mujeres";
			case "kid":
				return "Artículos para niños";
			default:
				return "Artículos unisex";
		}
	};

	return (
		<>
			<Title title="Tienda" subtitle={whichTitle()} className="mb-2" />
			<ProductGrid products={products ?? []} />
			<Pagination totalPages={totalPages} />
		</>
	);
};

export default CategoryPage;
