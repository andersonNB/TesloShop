import Link from "next/link";

export interface SidebarItem {
	text: string;
	icon?: React.ReactNode;
	href: string
	onClick?: () => void
}

export const SidebarItems = ({ text, icon, href, onClick }: SidebarItem) => {
	return (
		<Link
			href={href}
			className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all "
			onClick={onClick}
		>
			{icon}
			<span className="ml-3 text-xl ">{text}</span>
		</Link>
	);
};
