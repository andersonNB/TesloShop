import { Title } from "@/components";
import { initialData } from "@/seed/seed";
import clsx from "clsx";
import Image from "next/image";
import { IoCardOutline } from "react-icons/io5";

const productsInCart = [
	initialData.products[0],
	initialData.products[1],
	initialData.products[2],
];

interface Props {
	params: {
		id: string
	}
}

const OrderPage = async ({ params }: Props) => {

	const { id } = await params

	//TODO: verificar
	//redirect(/)

	return (
		<div className="flex justify-center items-start min-h-full py-0 px-10 sm:px-0">
			<div className="flex flex-col w-full max-w-[1000px]">
				<Title title={`Orden ${id}`} />

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
					{/* Carrito */}
					<div className="flex flex-col mt-5">

						<div className={
							clsx(
								"flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
								{
									"bg-red-500": true,
									"bg-green-500": false
								}
							)
						}>
							<IoCardOutline size={30} />
							<span className="mx-2">Pendiente de pago</span>
							<span className="mx-2">Pagada</span>
						</div>

						{/* Items */}
						{productsInCart.map((product) => (
							<div key={product.slug} className="flex mb-5 ">
								<Image
									src={`/products/${product.images[0]}`}
									width={100}
									height={100}
									alt={product.title}
									className="mr-5 rounded"
									style={{
										width: "100px",
										height: "100px",
									}}
								/>
								<div>
									<p>{product.title}</p>
									<p>{product.price}</p>
									<p>${product.price * 3}</p>
									<p className="font-bold" >Subtotal: ${product.price * product.inStock}</p>
								</div>
							</div>
						))}
					</div>

					{/* Checkout - resumen de la compra */}
					<div className="bg-white rounded-xl shadow-xl p-7 ">

						<h2 className="text-2xl mb-2 font-bold">Dirección de entrega</h2>
						<div className="mb-10">
							<p>Fernando Herrera</p>
							<p>Av. Siempre Viva 123</p>
							<p>Col. centro</p>
							<p>Cuidad de México</p>
						</div>
						{/* Divider */}
						<div className="W-full h-0.5 rounded bg-gray-200 mb-10" />

						<h2 className="text-2xl mb-2">Resumen de orden</h2>
						<div className="grid grid-cols-2">
							<span>No. Productos</span>
							<span className="text-right">3 artículos </span>

							<span>Subtotal</span>
							<span className="text-right">$100</span>

							<span>Impuestos (15%) </span>
							<span className="text-right">$100</span>

							<span className="mt-5 text-2xl">Total:</span>
							<span className="mt-5 text-2xl text-right">$100</span>
						</div>

						<div className="mt-5 mb-2 w-full">
							<div className={
								clsx(
									"flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
									{
										"bg-red-500": true,
										"bg-green-500": false
									}
								)
							}>
								<IoCardOutline size={30} />
								<span className="mx-2">Pendiente de pago</span>
								<span className="mx-2">Pagada</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderPage;
