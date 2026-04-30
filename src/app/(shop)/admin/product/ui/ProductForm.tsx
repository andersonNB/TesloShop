"use client";

import { Product } from "@/interfaces";
import { CategorySelect } from "./CategorySelect";
import { useForm } from "react-hook-form";

interface Props {
    product: Product;
    categories: { id: string, name: string }[]
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

interface FormInputs {
    title: string;
    slug: string;
    description: string;
    price: number;
    inStock: number;
    sizes: string[];
    tags: string;
    gender: "men" | "women" | "kid" | "unisex"
    categoryId: string;
    //todo imagenes
}

export const ProductForm = ({ product, categories }: Props) => {


    const { handleSubmit, register, formState } = useForm<FormInputs>({
        defaultValues: {
            title: product.title,
            slug: product.slug,
            description: product.description,
            price: product.price,
            inStock: product.inStock,
            sizes: product.sizes,
            tags: product.tags.join(", "),
            gender: product.gender,
        }
    })

    const onSubmit = (data: FormInputs) => {
        console.log(data)
    }


    return (
        <form className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3" onSubmit={handleSubmit(onSubmit)} >
            {/* Textos */}
            <div className="w-full">
                <div className="flex flex-col mb-2">
                    <span>Título</span>
                    <input type="text" value={product.title} className="p-2 border rounded-md bg-gray-200"  {...register("title", { required: true, minLength: 3 })} />
                    {
                        formState.errors.title && <p>{formState.errors.title.message}</p>
                    }
                </div>

                <div className="flex flex-col mb-2">
                    <span>Slug</span>
                    <input type="text" value={product.slug} className="p-2 border rounded-md bg-gray-200" {...register("slug", { required: true, minLength: 3 })} />
                    {
                        formState.errors.title && <p>{formState.errors.title.message}</p>
                    }
                </div>

                <div className="flex flex-col mb-2">
                    <span>Descripción</span>
                    <textarea
                        rows={5}
                        className="p-2 border rounded-md bg-gray-200"
                        {...register("description", { required: true, minLength: 3 })}
                    >{product.description}</textarea>
                    {
                        formState.errors.description && <p>{formState.errors.description.message}</p>
                    }
                </div>

                <div className="flex flex-col mb-2">
                    <span>Price</span>
                    <input type="number" value={product.price} className="p-2 border rounded-md bg-gray-200" {...register("price", { required: true, min: 0 })} />
                    {
                        formState.errors.price && <p>{formState.errors.price.message}</p>
                    }
                </div>

                <div className="flex flex-col mb-2">
                    <span>Tags</span>
                    <input type="text" value={product.tags.join(", ")} className="p-2 border rounded-md bg-gray-200" {...register("tags", { required: true, minLength: 3 })} />
                    {
                        formState.errors.tags && <p>{formState.errors.tags.message}</p>
                    }
                </div>

                <div className="flex flex-col mb-2">
                    <span>Gender</span>
                    <select value={product.gender} className="p-2 border rounded-md bg-gray-200" {...register("gender", { required: true })}>
                        <option value="">[Seleccione]</option>
                        <option value="men">Men</option>
                        <option value="women">Women</option>
                        <option value="kid">Kid</option>
                        <option value="unisex">Unisex</option>
                    </select>
                    {
                        formState.errors.gender && <p>{formState.errors.gender.message}</p>
                    }
                </div>
                <div className="flex flex-col mb-2">
                    <span>Categoria</span>
                    <CategorySelect categories={categories} />
                    {
                        formState.errors.categoryId && <p>{formState.errors.categoryId.message}</p>
                    }
                </div>

                <button
                    type="submit"
                    className="btn-primary w-full"
                    disabled={!formState.isValid}
                >
                    Guardar
                </button>
            </div>

            {/* Selector de tallas y fotos */}
            <div className="w-full">
                {/* As checkboxes */}
                <div className="flex flex-col">

                    <span>Tallas</span>
                    <div className="flex flex-wrap">

                        {
                            sizes.map(size => (
                                // bg-blue-500 text-white <--- si está seleccionado
                                <div key={size} className="flex  items-center justify-center w-10 h-10 mr-2 border rounded-md">
                                    <span>{size}</span>
                                </div>
                            ))
                        }

                    </div>


                    <div className="flex flex-col mb-2">

                        <span>Fotos</span>
                        <input
                            type="file"
                            multiple
                            className="p-2 border rounded-md bg-gray-200"
                            accept="image/png, image/jpeg"
                        />

                    </div>

                </div>
            </div>
        </form>
    );
};