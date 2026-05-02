import { z } from "zod";

export const productFormSchema = z.object({
    title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
    slug: z.string().min(3, "El slug debe tener al menos 3 caracteres"),
    description: z.string().min(3, "La descripción debe tener al menos 3 caracteres"),
    price: z.coerce.number().min(0, "El precio no puede ser negativo"),
    inStock: z.coerce.number().min(0, "El stock no puede ser negativo"),
    sizes: z.array(z.string()).min(1, "Debe seleccionar al menos una talla"),
    tags: z.string().min(1, "Debe ingresar al menos un tag"),
    gender: z.enum(["men", "women", "kid", "unisex"], {
        message: "Debe seleccionar un género válido",
    }),
    categoryId: z.string().min(1, "Debe seleccionar una categoría"),
});

export type ProductFormInput = z.input<typeof productFormSchema>;
export type ProductFormOutput = z.output<typeof productFormSchema>;