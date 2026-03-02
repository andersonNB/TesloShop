import { Title } from "@/components";
import { initialData } from "@/seed/seed";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ProductsInCart } from "./ui/ProductsInCart";
import { OrderSummary } from "./ui/OrderSummary";

const productsInCart = [
	initialData.products[0],
	initialData.products[1],
	initialData.products[2],
];

const CardPage = () => {

	if (productsInCart.length === 0) return redirect("/empty")

	return (
		<div className="flex justify-center items-start min-h-full py-0 px-10 sm:px-0">
			<div className="flex flex-col w-full max-w-[1000px]">
				<Title title="Carrito" />

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
					{/* Carrito */}
					<div className="flex flex-col mt-5">
						<span className="text-xl">Agregar más items</span>
						<Link href="/" className="underline mb-5">
							Continúa comprando
						</Link>
						{/* Items */}
						<ProductsInCart />
					</div>

					{/* Checkout - resumen de la compra */}
					<div className="bg-white rounded-xl shadow-xl p-7 h-fit ">
						<h2 className="text-2xl mb-2">Resumen de orden</h2>
						<OrderSummary />

						<div className="mt-5 mb-2 w-full">
							<Link
								className="flex btn-primary justify-center "
								href={"/checkout/address"}
							>
								Checkout
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CardPage;
