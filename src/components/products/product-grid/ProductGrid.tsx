import { Product } from "@/interfaces";
import { ProductGridItem } from "./ProductGridItem";

interface Props {
	products: Product[];
}

export const ProductGrid = ({ products }: Props) => {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 gap-10 mb-10">
			{
				products.length === 0 ? (
					<div className="col-span-full flex flex-col items-center justify-center py-20">
						<span className="text-2xl font-light text-gray-500 italic">No se encontraron productos</span>
						<p className="text-gray-400 mt-2">Pruebe ajustando sus filtros o regrese más tarde.</p>
					</div>
				) : (
					products.map((product) => (
						<ProductGridItem key={product.slug} product={product} />
					))
				)
			}
		</div>
	);
};
