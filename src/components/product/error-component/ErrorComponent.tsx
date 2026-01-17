
export const ErrorComponent = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <h1 className="text-2xl font-bold text-red-600">Hubo un problema al cargar los productos</h1>
            <p className="text-gray-500">Por favor, verifica la conexión a la base de datos o intenta más tarde.</p>
        </div>
    )
}