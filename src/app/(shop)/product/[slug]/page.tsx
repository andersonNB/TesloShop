import { ProductMobileSlideShow, ProductSlideshow, QuantitySelector, SizeSelector } from "@/components";
import { titleFont } from "@/config/font";
import { initialData } from "@/seed/seed";
import { notFound } from "next/navigation";

interface Props {
	params: {
		slug: string;
	};
}

const ProductPage = async ({ params }: Props) => {
	const { slug } = await params;
	const product = initialData.products.find((product) => product.slug === slug);

	if (!product) {
		return notFound();
	}

	return (
		<div className="mt-5 mb-20 grid md:grid-cols-3 gap-3">
			{/* Slideshow */}
			<div className="col-span-1 md:col-span-2">
				{/* Mobile Slideshow */}
				<ProductMobileSlideShow title={product.title} images={product.images}
					className="block md:hidden"
				/>
				{/* Desktop Slideshow */}
				<ProductSlideshow title={product.title} images={product.images}
					className="hidden md:block"
				/>
			</div>

			{/* Details */}
			<div className="col-span-1 px-5 ">
				<h1 className={`${titleFont.className} antialiased font-bold text-xl `}>
					{product.title}
				</h1>
				<p className="text-lg mb-5">${product.price}</p>

				{/* Selector de tallas */}

				<SizeSelector
					selectedSize={product.sizes[0]}
					availableSizes={product.sizes}
				/>
				{/* Selector de cantidad*/}
				<QuantitySelector quantity={0} />

				{/* Button */}
				<button className="btn-primary my-5 ">Agregar al carrito</button>

				{/* Descripción */}
				<h3 className="font-bold text-sm">Descripción</h3>
				<p className="font-light">{product.description}</p>
			</div>
		</div>
	);
};

export default ProductPage;
