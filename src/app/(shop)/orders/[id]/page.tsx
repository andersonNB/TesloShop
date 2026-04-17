import { getOrderById } from "@/actions";
import { PayPalButton, Title } from "@/components";
import { currencyFormat } from "@/utils";
import clsx from "clsx";
import Image from "next/image";
import { IoCardOutline } from "react-icons/io5";


interface Props {
	params: {
		id: string
	}
}

const OrderPage = async ({ params }: Props) => {

	const { id } = await params


	const { order, address, items } = await getOrderById(id)


	return (
		<div className="flex justify-center items-start min-h-full py-0 px-10 sm:px-0">
			<div className="flex flex-col w-full max-w-[1000px]">
				<Title title={`Orden #${id}`} />

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
					{/* Carrito */}
					<div className="flex flex-col mt-5">

						<div className={
							clsx(
								"flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
								{
									"bg-red-500": !order?.isPaid,
									"bg-green-500": order?.isPaid
								}
							)
						}>
							<IoCardOutline size={30} />
							<span className="mx-2">{order?.isPaid ? "Pagada" : "Pendiente de pago"}</span>
						</div>

						{/* Items */}
						{(items ?? [])?.map((product) => (
							<div key={product.product.slug} className="flex mb-5 ">
								<Image
									src={`/products/${product.product.images[0].url}`}
									width={100}
									height={100}
									alt={product.product.title ?? ""}
									className="mr-5 rounded"
									style={{
										width: "100px",
										height: "100px",
									}}
								/>
								<div>
									<p>{product.product.title}</p>
									<p>{currencyFormat(product.price)} - {product.size} x {product.quantity} </p>
									<p className="font-bold" >Subtotal: {currencyFormat(product.price * product.quantity)}</p>
								</div>
							</div>
						))}
					</div>

					{/* Checkout - resumen de la compra */}
					<div className="bg-white rounded-xl shadow-xl p-7 ">

						<h2 className="text-2xl mb-2 font-bold">Dirección de entrega</h2>
						<div className="mb-10">
							<p>{address?.firstName} {address?.lastName}</p>
							<p>{address?.address}</p>
							<p>{address?.address2}</p>
							<p>{address?.city}, {address?.countryId}</p>
							<p>{address?.phone}</p>
						</div>
						{/* Divider */}
						<div className="W-full h-0.5 rounded bg-gray-200 mb-10" />

						<h2 className="text-2xl mb-2">Resumen de orden</h2>
						<div className="grid grid-cols-2">
							<span>No. Productos</span>
							<span className="text-right">{order?.itemsInOrder || 0} artículos </span>

							<span>Subtotal</span>
							<span className="text-right">${order?.subTotal || 0}</span>

							<span>Impuestos (15%) </span>
							<span className="text-right">${order?.tax || 0}</span>

							<span className="mt-5 text-2xl">Total:</span>
							<span className="mt-5 text-2xl text-right">${order?.total || 0}</span>
						</div>

						<div className="mt-5 mb-2 w-full">
							<div className={
								clsx(
									"flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
									{
										"bg-red-500": !order?.isPaid,
										"bg-green-500": order?.isPaid
									}
								)
							}>
								<IoCardOutline size={30} />
								<span className="mx-2">{order?.isPaid ? "Pagada" : "Pendiente de pago"}</span>
							</div>

							<PayPalButton orderId={id} isPaid={order?.isPaid ?? false} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderPage;
