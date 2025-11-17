import {notFound} from "next/navigation";

interface Props {
	params: Promise<{
		id: string;
	}>;
}

const CategoryPage = async ({params}: Props) => {
	const {id} = await params;

	if (id === "kid") return notFound();

	return <div>Category page {id} </div>;
};

export default CategoryPage;
