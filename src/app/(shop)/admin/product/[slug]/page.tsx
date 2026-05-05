import { getAllCategories, getProductBySlug } from "@/actions"
import { Title } from "@/components"
import { redirect } from "next/navigation"
import { ProductForm } from "../ui/ProductForm"

interface Props {
    params: Promise<{
        slug: string
    }>
}

const ProductAdminPage = async ({ params }: Props) => {


    const { slug } = await params

    const [product, categoriesResponse] = await Promise.all([
        getProductBySlug(slug) ?? null,
        getAllCategories()
    ])

    if (!product && slug !== "new") {
        redirect("/admin/products")
    }

    const title = (slug === "new") ? "Nuevo producto" : `Editar producto: ${product?.title ?? ""}`

    return (
        <>
            <Title title={title} />
            <ProductForm product={product ?? {}} categories={categoriesResponse.categories ?? []} />
        </>
    )
}

export default ProductAdminPage
