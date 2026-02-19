export const revalidate = 604800 // 1 week
import { getProductBySlug } from "@/actions";
import { ProductMobileSlideShow, ProductSlideshow, StockLabel } from "@/components";
import { titleFont } from "@/config/font";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { AddToCart } from "./ui/AddToCart";

interface Props {
	params: {
		slug: string;
	};
}

export async function generateMetadata(
	{ params }: Props,
): Promise<Metadata> {
	const slug = (await params).slug

	const product = await getProductBySlug(slug)

	return {
		title: product?.title,
		description: product?.description,
		openGraph: {
			title: product?.title,
			description: product?.description,
			images: [`/products/${product?.images[1]}`]
		}
	}
}
const ProductPage = async ({ params }: Props) => {
	const { slug } = await params;
	// const product = initialData.products.find((product) => product.slug === slug);
	const product = await getProductBySlug(slug)

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
				<StockLabel slug={product.slug ?? ""} />
				<h1 className={`${titleFont.className} antialiased font-bold text-xl `}>
					{product.title}
				</h1>
				<p className="text-lg mb-5">${product.price}</p>

				<AddToCart key={product.id} product={product} />

				{/* Descripción */}
				<h3 className="font-bold text-sm">Descripción</h3>
				<p className="font-light">{product.description}</p>
			</div>
		</div>
	);
};

export default ProductPage;
