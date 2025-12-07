"use client";
import { titleFont } from "@/config/font";
import { useUIStore } from "@/store";
import Link from "next/link";
import { IoCartOutline, IoSearchOutline } from "react-icons/io5";

export const TopMenu = () => {
	const { openSideMenu } = useUIStore((state) => state);

	return (
		<nav className="flex px-5 py-0 justify-between items-center w-full sticky top-0 bg-white z-10 shadow-sm">
			{/* Logo */}
			<div>
				<Link href={"/"}>
					<span className={`${titleFont.className} antialiased font-bold`}>
						Teslo
					</span>
					<span> | Shop</span>
				</Link>
			</div>

			{/* Center Menu */}
			<div className="hidden sm:block">
				<Link
					className="m-2 p-2 rounded-md transition-all hover:bg-gray-100 "
					href={"/category/men"}
				>
					Hombres
				</Link>
				<Link
					className="m-2 p-2 rounded-md transition-all hover:bg-gray-100 "
					href={"/category/women"}
				>
					Mujeres
				</Link>

				<Link
					className="m-2 p-2 rounded-md transition-all hover:bg-gray-100 "
					href={"/category/kid"}
				>
					Niños
				</Link>
			</div>

			{/* Search, Cart, Menu */}
			<div className="flex items-center gap-3">
				<Link href={"/search"}>
					<IoSearchOutline className="w-5 h-5" />
				</Link>

				<Link href={"/cart"}>
					<div className="relative">
						<span className="absolute text-xs rounded-full px-1 font-bold -top-2 -right-2 bg-blue-700 text-white">
							3
						</span>
						<IoCartOutline className="w-5 h-5" />
					</div>
				</Link>

				<button
					className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
					onClick={() => openSideMenu()}
				>
					Menú
				</button>
			</div>
		</nav>
	);
};
