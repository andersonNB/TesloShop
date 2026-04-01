"use server"

import { Country } from "@/interfaces";
import { prisma } from "@/lib/prisma";




/**
 * Server action para obtener los paises.
 */
export const getCountries = async (): Promise<Country[]> => {

    try {

        const countries = await prisma.country.findMany({
            orderBy: {
                name: "asc"
            }
        })
        console.log("countries obtenidos con éxito")
        return countries

    } catch (error) {
        console.error(error)

        return []
    }

}


// podemos usar esta forma para cachear los datos y se van a estar revalidando el tiempo que le coloquemos
// "use server"

// import { Country } from "@/interfaces";
// import { prisma } from "@/lib/prisma";
// import { unstable_cache } from "next/cache";

// /**
//  * Server action para obtener los paises.
//  * Se cachea con revalidación cada 3600 segundos (1 hora).
//  */
// export const getCountries = unstable_cache(
//     async (): Promise<Country[]> => {
//         try {
//             const countries = await prisma.country.findMany({
//                 orderBy: { name: "asc" }
//             })
//             console.log("countries obtenidos con éxito") // Solo verás esto cuando se revalide
//             return countries
//         } catch (error) {
//             console.error(error)
//             return []
//         }
//     },
//     ["countries"],                         // cache key
//     { revalidate: 3600, tags: ["countries"] } // revalida cada 1h O cuando llames revalidateTag("countries")
// );
