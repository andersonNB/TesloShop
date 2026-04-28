import { getProductBySlug } from "@/actions"
import { Title } from "@/components"
import { redirect } from "next/navigation"
import { ProductForm } from "../ui/ProductForm"

interface Props {
    params: {
        slug: string
    }
}

const ProductAdminPage = async ({ params }: Props) => {


    const { slug } = await params


    const product = await getProductBySlug(slug) ?? null

    if (!product) {
        redirect("/admin/products")
    }

    const title = (slug === "new") ? "Nuevo producto" : `Editar producto: ${product.title}`

    return (
        <>
            <Title title={title} />
            <ProductForm product={product} />
        </>
    )
}

export default ProductAdminPage
