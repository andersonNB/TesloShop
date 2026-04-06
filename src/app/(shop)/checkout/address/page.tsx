export const revalidate = 3600

import { Title } from "@/components";
import { AddressForm } from "./ui/AddressForm";
import { getCountries, getUserAddress } from "@/actions";
import { auth } from "@/auth.config";
import { redirect } from "next/navigation";
import { Address } from "@/interfaces";

export default async function AddressPage() {

	const [countries, session] = await Promise.all([
		getCountries(),
		auth()
	])

	if (!session?.user) {
		return redirect("/auth/login?from=/checkout/address")
	}

	const userAddress = await getUserAddress(session.user.id)

	return (
		<div className="flex justify-center items-start min-h-full py-0 px-10 sm:px-0">
			<div className="w-full max-w-[1000px] flex flex-col justify-center text-left">
				<Title title="Dirección" subtitle="Dirección de entrega" />
				<AddressForm countries={countries ?? []} userStoredAddress={userAddress.address as Partial<Address>} />
			</div>
		</div>
	);
}
