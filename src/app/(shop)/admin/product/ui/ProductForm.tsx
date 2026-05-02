"use client";

import { getProductBySlug } from "@/actions";
import { CategorySelect } from "./CategorySelect";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import clsx from "clsx";
import { productFormSchema, ProductFormInput, ProductFormOutput } from "@/schema/productForm";

type ProductWithImages = NonNullable<Awaited<ReturnType<typeof getProductBySlug>>>

interface Props {
    product: ProductWithImages;
    categories: { id: string; name: string }[]
}

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export const ProductForm = ({ product, categories }: Props) => {

    const { handleSubmit, register, control, formState, getValues, setValue, watch } = useForm<ProductFormInput, ProductFormOutput>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            title: product.title,
            slug: product.slug,
            description: product.description,
            price: product.price,
            inStock: product.inStock,
            sizes: product.sizes as string[],
            tags: product.tags.join(", "),
            gender: product.gender as ProductFormOutput["gender"],
            categoryId: product.categoryId,
        }
    });

    const selectedSizes = watch("sizes") ?? []

    const onSizeChanged = (size: string) => {
        const currentSizes = getValues("sizes")
        if (currentSizes.includes(size)) {
            setValue("sizes", currentSizes.filter(s => s !== size), { shouldValidate: true })
        } else {
            setValue("sizes", [...currentSizes, size], { shouldValidate: true })
        }
    }

    const onSubmit: SubmitHandler<ProductFormInput> = (data) => {
        console.log(data)
    }

    return (
        <form className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3" onSubmit={handleSubmit(onSubmit)} >
            {/* Textos */}
            <div className="w-full">
                <div className="flex flex-col mb-2">
                    <span>Título</span>
                    <input
                        type="text"
                        className="p-2 border rounded-md bg-gray-200"
                        {...register("title")}
                    />
                    {formState.errors.title && <p className="text-red-500 text-sm">{formState.errors.title.message}</p>}
                </div>

                <div className="flex flex-col mb-2">
                    <span>Slug</span>
                    <input
                        type="text"
                        className="p-2 border rounded-md bg-gray-200"
                        {...register("slug")}
                    />
                    {formState.errors.slug && <p className="text-red-500 text-sm">{formState.errors.slug.message}</p>}
                </div>

                <div className="flex flex-col mb-2">
                    <span>Descripción</span>
                    <textarea
                        rows={5}
                        className="p-2 border rounded-md bg-gray-200"
                        {...register("description")}
                    />
                    {formState.errors.description && <p className="text-red-500 text-sm">{formState.errors.description.message}</p>}
                </div>

                <div className="flex flex-col mb-2">
                    <span>Price</span>
                    <input
                        type="number"
                        className="p-2 border rounded-md bg-gray-200"
                        {...register("price")}
                    />
                    {formState.errors.price && <p className="text-red-500 text-sm">{formState.errors.price.message}</p>}
                </div>

                <div className="flex flex-col mb-2">
                    <span>Tags</span>
                    <input
                        type="text"
                        className="p-2 border rounded-md bg-gray-200"
                        {...register("tags")}
                    />
                    {formState.errors.tags && <p className="text-red-500 text-sm">{formState.errors.tags.message}</p>}
                </div>

                <div className="flex flex-col mb-2">
                    <span>Gender</span>
                    <select className="p-2 border rounded-md bg-gray-200" {...register("gender")}>
                        <option value="">[Seleccione]</option>
                        <option value="men">Men</option>
                        <option value="women">Women</option>
                        <option value="kid">Kid</option>
                        <option value="unisex">Unisex</option>
                    </select>
                    {formState.errors.gender && <p className="text-red-500 text-sm">{formState.errors.gender.message}</p>}
                </div>

                {/* Controller: CategorySelect no es un input HTML nativo */}
                <div className="flex flex-col mb-2">
                    <span>Categoria</span>
                    <Controller
                        name="categoryId"
                        control={control}
                        render={({ field }) => (
                            <CategorySelect
                                categories={categories}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                            />
                        )}
                    />
                    {formState.errors.categoryId && <p className="text-red-500 text-sm">{formState.errors.categoryId.message}</p>}
                </div>

                <button
                    type="submit"
                    className="btn-primary w-full"
                    disabled={formState.isSubmitting}
                >
                    Guardar
                </button>
            </div>

            {/* Selector de tallas y fotos */}
            <div className="w-full">
                <div className="flex flex-col">

                    <span>InStock</span>
                    <input
                        type="number"
                        className="p-2 border rounded-md bg-gray-200 mb-2"
                        {...register("inStock")}
                    />
                    {formState.errors.inStock && <p className="text-red-500 text-sm">{formState.errors.inStock.message}</p>}

                    <span>Tallas</span>
                    <div className="flex flex-wrap">
                        {SIZES.map(size => (
                            <div
                                key={size}
                                onClick={() => onSizeChanged(size)}
                                className={clsx(
                                    "p-2 border rounded-md mr-2 mb-2 w-14 transition-all text-center cursor-pointer",
                                    {
                                        "bg-blue-500 text-white": selectedSizes.includes(size)
                                    }
                                )}
                            >
                                <span>{size}</span>
                            </div>
                        ))}
                    </div>
                    {formState.errors.sizes && <p className="text-red-500 text-sm">{formState.errors.sizes.message}</p>}

                    <div className="flex flex-col mb-2">
                        <span>Fotos</span>
                        <input
                            type="file"
                            multiple
                            className="p-2 border rounded-md bg-gray-200"
                            accept="image/png, image/jpeg"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {product.images?.map(image => (
                            <div key={image.id} className="flex flex-col">
                                <Image
                                    src={`/products/${image.url}`}
                                    alt={product.title ?? ""}
                                    width={300}
                                    height={300}
                                    className="rounded-t shadow-md"
                                />
                                <button
                                    type="button"
                                    className="btn-danger rounded-b-xl"
                                    onClick={() => console.log(image.id, image.url)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </form>
    );
};