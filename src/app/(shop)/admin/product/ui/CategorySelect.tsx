
interface Props {
    categories: { id: string, name: string }[]
}

export const CategorySelect = ({ categories }: Readonly<Props>) => {
    return (
        <select className="p-2 border rounded-md bg-gray-200">
            <option value="">[Seleccione]</option>
            {(categories ?? []).map((categorie) => {
                return (
                    <option key={categorie.id} value={categorie.id}>{categorie.name}</option>
                )
            })}
        </select>

    )
}
