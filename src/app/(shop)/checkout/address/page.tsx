export const revalidate = 3600

import { Title } from "@/components";
import { AddressForm } from "./ui/AddressForm";
import { getCountries } from "@/actions";

export default async function AddressPage() {

	const countries = await getCountries()

	return (
		<div className="flex justify-center items-start min-h-full py-0 px-10 sm:px-0">
			<div className="w-full max-w-[1000px] flex flex-col justify-center text-left">
				<Title title="Dirección" subtitle="Dirección de entrega" />
				<AddressForm countries={countries ?? []} />
			</div>
		</div>
	);
}
