import { initialData } from "./seed";


async function  main(){
    console.log("Iniciando semilla");
    console.log(initialData)
}

(()=>{
    if(process.env.NODE_ENV === 'production') {
        throw new Error('❌ No se puede ejecutar seed en producción');
    }
    main();
})();