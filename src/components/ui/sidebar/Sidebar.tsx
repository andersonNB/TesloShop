"use client";
import { logout } from "@/actions";
import { SidebarItem, SidebarItems } from "@/components/sidebar/SidebarItems";
import { useUIStore } from "@/store";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
	IoCloseCircleOutline,
	IoLogInOutline,
	IoLogOutOutline,
	IoPeopleOutline,
	IoPersonOutline,
	IoSearchOutline,
	IoShirtOutline,
	IoTicketOutline,
	IoAddSharp
} from "react-icons/io5";



export const Sidebar = () => {
	const isSideMenuOpen = useUIStore((state) => state.isSideMenuOpen);
	const closeMenu = useUIStore((state) => state.closeSideMenu);

	const { data: session, update, status } = useSession()
	const router = useRouter()
	const isAuthenticated = !!session?.user
	const isAdmin = session?.user.role === "admin"
	const isUser = session?.user.role === "user"
	console.log("Sidebar: ", session, "- status: ", status)


	const logoutAction = async () => {
		await logout()
		await update()
		closeMenu()
		router.replace("/auth/login")
	}

	const menuItemsSidebar: SidebarItem[] = [
		{
			text: "Perfil",
			icon: <IoPersonOutline size={30} />,
			href: "/profile",
			onClick: () => {
				closeMenu()
			},
			isVisible: isAuthenticated && isUser
		},
		{
			text: "Ordenes",
			icon: <IoTicketOutline size={30} />,
			href: "/orders",
			onClick: () => {
				closeMenu()
			},
			isVisible: isAuthenticated && isUser
		},
		{
			text: "Ingresar",
			icon: <IoLogInOutline size={30} />,
			href: "/auth/login",
			onClick: () => {
				closeMenu()
			},
			isVisible: !isAuthenticated
		},
		{
			text: "Salir",
			icon: <IoLogOutOutline size={30} />,
			href: "",
			onClick: logoutAction,
			isVisible: isAuthenticated
		},
	];

	const afterSeparationItems: SidebarItem[] = [
		{
			text: "Productos",
			icon: <IoShirtOutline size={30} />,
			href: "/admin/products",
			onClick: () => closeMenu(),
			isVisible: isAuthenticated && isAdmin
		},
		{
			text: "Ordenes",
			icon: <IoTicketOutline size={30} />,
			href: "/orders",
			onClick: () => closeMenu(),
			isVisible: isAuthenticated && isAdmin
		},
		{
			text: "Todas las ordenes",
			icon: <IoAddSharp size={30} />,
			href: "/admin/orders",
			onClick: () => closeMenu(),
			isVisible: isAuthenticated && isAdmin
		},
		{
			text: "Usuarios",
			icon: <IoPeopleOutline size={30} />,
			href: "/admin/users",
			onClick: () => closeMenu(),
			isVisible: isAuthenticated && isAdmin
		},
	];


	return (
		<div>
			{/* Background black */}
			{isSideMenuOpen && (
				<div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30 " />
			)}

			{/* BLur */}
			{isSideMenuOpen && (
				<div className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm" />
			)}
			{/* Sidemenu */}
			<nav
				className={clsx(
					"fixed p-5 right-0 top-0 w-[500px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300  scroll-auto",
					{
						"translate-x-full": !isSideMenuOpen,
					}
				)}
			>
				<div className=" max-h-[97%] overflow-hidden overflow-y-auto ">
					<IoCloseCircleOutline
						size={36}
						className="absolute top-2 right-10 cursor-pointer"
						onClick={() => closeMenu()}
					/>
					<div className="relative mt-14">
						<IoSearchOutline size={20} className="absolute top-2 left-2" />
						<input
							type="text"
							placeholder="Buscar"
							className="w-full bg-gray-50 rounded pl-10 py-1 pr-10 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-blue-500  "
						/>
					</div>
					{/* Menú */}
					{menuItemsSidebar.map((items) => (
						<SidebarItems
							key={items.text}
							text={items.text}
							icon={items.icon}
							href={items.href}
							onClick={items.onClick}
							isVisible={items.isVisible}
						/>
					))}
					{/* Separación */}
					<div className="w-full h-px bg-gray-200 my-10" />
					{afterSeparationItems.map((items, i) => (
						<SidebarItems
							key={items.text + i}
							text={items.text}
							icon={items.icon}
							href={items.href}
							onClick={items.onClick}
							isVisible={items.isVisible}
						/>
					))}
				</div>
			</nav>
		</div>
	);
};
