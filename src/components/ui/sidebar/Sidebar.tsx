"use client";
import {SidebarItem, SidebarItems} from "@/components/sidebar/SidebarItems";
import Link from "next/link";
import {
	IoCloseCircleOutline,
	IoLogInOutline,
	IoLogOutOutline,
	IoPeopleOutline,
	IoPersonOutline,
	IoSearchOutline,
	IoShirtOutline,
	IoTicketOutline,
} from "react-icons/io5";

const menuItemsSidebar: SidebarItem[] = [
	{
		text: "Perfil",
		icon: <IoPersonOutline size={30} />,
	},
	{
		text: "Ordenes",
		icon: <IoTicketOutline size={30} />,
	},
	{
		text: "Ingresar",
		icon: <IoLogInOutline size={30} />,
	},
	{
		text: "Salir",
		icon: <IoLogOutOutline size={30} />,
	},
];

const afterSeparationItems: SidebarItem[] = [
	{
		text: "Productos",
		icon: <IoShirtOutline size={30} />,
	},
	{
		text: "Ordenes",
		icon: <IoTicketOutline size={30} />,
	},
	{
		text: "Usuarios",
		icon: <IoPeopleOutline size={30} />,
	},
];

export const Sidebar = () => {
	return (
		<div>
			{/* Background black */}
			<div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30 ">
				1
			</div>

			{/* BLur */}
			<div className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm">
				{/* Sidemenu */}
				<nav className="fixed p-5 right-0 top-0 w-[500px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300  scroll-auto ">
					<div className=" max-h-[97%] overflow-hidden overflow-y-auto ">
						<IoCloseCircleOutline
							size={50}
							className="absolute top-5 right-10 cursor-pointer"
							onClick={() => console.log("click")}
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
							/>
						))}
						{/* Separación */}
						<div className="w-full h-px bg-gray-200 my-10" />
						{afterSeparationItems.map((items, i) => (
							<SidebarItems
								key={items.text + i}
								text={items.text}
								icon={items.icon}
							/>
						))}
					</div>
				</nav>
			</div>
		</div>
	);
};
