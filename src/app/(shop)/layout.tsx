import {TopMenu} from "@/components";

export default function ShopLayout({children}: {children: React.ReactNode}) {
	return (
		<main className="min-h-screen bg-amber-200">
			<TopMenu />

			{children}
		</main>
	);
}
