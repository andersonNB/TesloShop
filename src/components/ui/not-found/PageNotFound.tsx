import { titleFont } from "@/config/font";
import Image from "next/image";
import Link from "next/link";

export const PageNotFound = () => {
	return (
		<div className="flex flex-col-reverse md:flex-row min-h-screen w-full justify-center items-center align-middle">
			<div className="text-center px-5 mx-5">
				<h2 className={`${titleFont.className} antialiased text-9xl`}>404</h2>
				<p className="font-semibold text-xl">Whoops! Lo sentimos mucho.</p>
				<p className="flex  justify-center items-center gap-1 font-light">
					<span>Puedes regresar al</span>
					<Link href="/" className="font-normal w-1/4 hover:underline transition-all ml-3 px-2 py-1 bg-blue-600 text-white rounded-lg">
						inicio
					</Link>
				</p>
			</div>

			<div className="px-5 mx-5">
				<Image
					src="/imgs/starman_750x750.png"
					alt="Starman"
					className="p-5 sm:p-0"
					width={550}
					height={550}
				/>
			</div>
		</div>
	);
};
