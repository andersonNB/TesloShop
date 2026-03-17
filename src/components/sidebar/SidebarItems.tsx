import Link from "next/link";

export interface SidebarItem {
	text: string;
	icon?: React.ReactNode;
	href: string
	onClick?: () => void
	isVisible: boolean
}

//TODO: como funciona el api/auth/[...nextauth]/route.ts y cuando inicio sesion por primera vez la sessión en el cliente no se actualiza debo recargar para que la tome

export const SidebarItems = ({ text, icon, href, onClick, isVisible = true }: SidebarItem) => {
	return (

		isVisible && (
			<Link
				href={href}
				className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all "
				onClick={onClick}
			>
				{icon}
				<span className="ml-3 text-xl ">{text}</span>
			</Link>
		)

	);
};
