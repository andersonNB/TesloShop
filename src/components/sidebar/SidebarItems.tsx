import Link from "next/link";

export interface SidebarItem {
	text: string;
	icon?: React.ReactNode;
}

export const SidebarItems = ({text, icon}: SidebarItem) => {
	return (
		<Link
			href="/"
			className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all "
		>
			{icon}
			<span className="ml-3 text-xl ">{text}</span>
		</Link>
	);
};
