import { prisma } from "../lib/prisma";

async function  main(){
    console.log("Iniciando semilla");
    
    //1. Borrando datos anteriores
    await Promise.all([
         prisma.productImage.deleteMany(),
         prisma.product.deleteMany(),
         prisma.category.deleteMany()
    ])

    console.log("Semilla ejecutada correctamente")
}

(()=>{
    if(process.env.NODE_ENV === 'production') {
        throw new Error('❌ No se puede ejecutar seed en producción');
    }
    main();
})();