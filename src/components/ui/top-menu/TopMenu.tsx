"use client";
import { titleFont } from "@/config/font";
import { useUIStore } from "@/store";
import { useCartStore } from "@/utils";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { IoCartOutline, IoSearchOutline } from "react-icons/io5";

export const TopMenu = () => {
	const { openSideMenu } = useUIStore((state) => state);
	const totalItemsInCart = useCartStore(state => state.getTotalItems());

	const [hydrated, setHydrated] = useState(false);
	const hasMounted = useRef(false);

	useEffect(() => {
		if (!hasMounted.current) {
			hasMounted.current = true;
			queueMicrotask(() => setHydrated(true));
		}
	}, []);


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
					href={"/gender/men"}
				>
					Hombres
				</Link>
				<Link
					className="m-2 p-2 rounded-md transition-all hover:bg-gray-100 "
					href={"/gender/women"}
				>
					Mujeres
				</Link>

				<Link
					className="m-2 p-2 rounded-md transition-all hover:bg-gray-100 "
					href={"/gender/kid"}
				>
					Niños
				</Link>
			</div>

			{/* Search, Cart, Menu */}
			<div className="flex items-center gap-3">
				<Link href={"/search"}>
					<IoSearchOutline className="w-5 h-5" />
				</Link>

				<Link href={(hydrated && totalItemsInCart === 0) ? "/empty" : "/cart"}>
					<div className="relative">
						{
							(hydrated && totalItemsInCart > 0) && (
								<span className="fade-in absolute text-xs rounded-full px-1 font-bold -top-2 -right-2 bg-blue-700 text-white">
									{totalItemsInCart}
								</span>
							)
						}
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
