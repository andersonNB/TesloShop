interface Props {
    categories: { id: string; name: string }[]
    value?: string
    onChange?: (value: string) => void
}

export const CategorySelect = ({ categories, value, onChange }: Readonly<Props>) => {
    return (
        <select
            className="p-2 border rounded-md bg-gray-200"
            value={value ?? ""}
            onChange={(e) => onChange?.(e.target.value)}
        >
            <option value="">[Seleccione]</option>
            {(categories ?? []).map((category) => (
                <option key={category.id} value={category.id}>
                    {category.name}
                </option>
            ))}
        </select>
    )
}
