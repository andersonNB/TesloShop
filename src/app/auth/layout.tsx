export default function ShopLayout({ children }: { children: React.ReactNode }) {
	return (
		<main className="flex  items-center justify-center" >
			<h1 className="absolute top-20 left-20" >Hello root layout auth</h1>
			<div className="w-full sm:w-[350px] px-10">
				{children}
			</div>
		</main>
	);
}
