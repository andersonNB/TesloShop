import 'dotenv/config'
import { prisma } from "../lib/prisma";
import { initialData } from './seed';

async function main() {
    console.log("Iniciando semilla");

    //1. Borrando datos anteriores
    await Promise.all([
        prisma.productImage.deleteMany(),
        prisma.product.deleteMany(),
        prisma.category.deleteMany()
    ])

    const { categories, products } = initialData

    //Insetando Categorias
    //De esta manera insertamos una sola categoria
    // await prisma.category.create({
    //     data:{
    //         name:"Shirts",

    //     }
    // })

    //Insertamos varias categorias
    const categoriesData = categories.map((category) => ({
        name: category
    }))

    await prisma.category.createMany({
        data: categoriesData
    })

    //Obtenemos los ids de las categorias que hay en la bd
    const categoriesDB = await prisma.category.findMany()

    const categoriesMap = categoriesDB.reduce((map, category) => {

        map[category.name.toLowerCase()] = category.id

        return map;
    }, {} as Record<string, string>) //<string=shirt, string=categoryID>


    //Insertando un solo producto
    // const { images, type, ...product1 } = products[0]
    // console.log({ product1 })
    // await prisma.product.create({
    //     data: {
    //         ...product1,
    //         categoryId: categoriesMap["shirts"]
    //     }
    // })

    for (const product of products) {
        const { type, images, ...restProduct } = product

        const categoryId = categoriesMap[type.toLowerCase()];

        if (!categoryId) {
            continue;
        }

        const dbProduct = await prisma.product.create({
            data: {
                ...restProduct,
                categoryId: categoryId
            }
        })

        //Images
        const imagesData = images.map(image => ({
            url: image,
            productId: dbProduct.id
        }));

        await prisma.productImage.createMany({
            data: imagesData
        })
    }

    console.log("Semilla ejecutada correctamente")
}

(() => {
    if (process.env.NODE_ENV === 'production') {
        throw new Error('❌ No se puede ejecutar seed en producción');
    }
    main();
})();