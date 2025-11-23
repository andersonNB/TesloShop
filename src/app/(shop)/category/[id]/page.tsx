import {ProductGrid} from "@/components";
import Title from "@/components/ui/title/Title";
import {initialData, Category} from "@/seed/seed";

interface Props {
	params: Promise<{
		id: Category;
	}>;
}

const products = initialData.products;

const CategoryPage = async ({params}: Props) => {
	const {id} = await params;

	// if (id === "kid") return notFound();

	const whichTitle = () => {
		switch (id) {
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
			<ProductGrid products={products.filter((item) => item.gender === id)} />
		</>
	);
};

export default CategoryPage;
