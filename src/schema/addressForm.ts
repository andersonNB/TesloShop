import z from "zod"


export const addressFormSchema = z.object({
    firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
    address: z.string().min(2, "La dirección debe tener al menos 2 caracteres"),
    address2: z.string().optional(),
    postalCode: z.string().min(2, "El código postal debe tener al menos 2 caracteres"),
    city: z.string().min(2, "La ciudad debe tener al menos 2 caracteres"),
    country: z.string().min(2, "El país debe tener al menos 2 caracteres"),
    phone: z.string().min(2, "El teléfono debe tener al menos 2 caracteres"),
    rememberAddress: z.boolean().optional().default(false),
})

export type AddressForm = z.infer<typeof addressFormSchema>