"use server"


export const deleteProductImage = async (imageId: string | number, imageUrl: string) => {

    if (!imageUrl.startsWith('http')) {
        return {
            ok: false,
            error: "No se pueden borrar imagenes de FS"
        }
    }


    const imageName = imageUrl.split("/").pop()?.split(".")[0] ?? ""
    console.log("imageName: ", imageName)

}