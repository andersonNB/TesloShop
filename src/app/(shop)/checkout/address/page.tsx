import { Title } from "@/components";
import { AddressForm } from "./ui/AddressForm";

export default function AddressPage() {
	return (
		<div className="flex justify-center items-start min-h-full py-0 px-10 sm:px-0">
			<div className="w-full max-w-[1000px] flex flex-col justify-center text-left">
				<Title title="Dirección" subtitle="Dirección de entrega" />
				<AddressForm />
			</div>
		</div>
	);
}
