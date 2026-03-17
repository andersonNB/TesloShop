import { auth } from "@/auth.config";
import { redirect } from "next/navigation";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {

	const session = await auth()

	console.log({ session })

	//Si existe la sesión, redirigimos al usuario a la página principal
	if (session?.user) {
		redirect("/")
	}

	return (
		<main className="flex  items-center justify-center" >
			<h1 className="absolute top-20 left-20" >Hello root layout auth</h1>
			<div className="w-full sm:w-[350px] px-10">
				{children}
			</div>
		</main>
	);
}
