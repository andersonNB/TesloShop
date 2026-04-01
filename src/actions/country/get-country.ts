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