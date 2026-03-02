import { CartProduct, SummaryInformation } from "@/interfaces";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface State {
    cart: CartProduct[];
    getTotalItems: () => number
    getSummaryInformation: () => SummaryInformation
    addProductToCart: (product: CartProduct) => void;
    sustractProductToCart: (product: CartProduct) => void;
    deleteProductToCart: (product: CartProduct) => void;

}

export const useCartStore = create<State>()(

    persist(
        (set, get) => ({
            cart: [] as CartProduct[],
            getTotalItems() {
                const { cart } = get() //obtenemos el estado actual del carrito
                return cart.reduce((total, item) => total + item.quantity, 0)
            },
            getSummaryInformation: () => {
                const { cart } = get()

                const subTotal = cart.reduce((subTotal, product) => (product.quantity * product.price + subTotal), 0)
                const tax = subTotal * 0.15
                const total = subTotal + tax

                return {
                    subTotal,
                    tax,
                    total
                }
            },
            addProductToCart: (product: CartProduct) => {
                const { cart } = get()

                //1. Revisar si el product ya existe en el carrito con la talla seleccionada 
                const productInCart = cart.some(
                    (item) => item.id === product.id && item.size === product.size
                )

                if (!productInCart) {
                    // Si no existe, agregar el producto al carrito
                    set({
                        cart: [...cart, product]
                    })
                    return;
                }

                //2. El producto ya existe, actualizar la cantidad.
                const updatedCartProducts = cart.map((item) => {
                    if (item.id === product.id && item.size === product.size) {
                        return {
                            ...item,
                            quantity: item.quantity + product.quantity
                        }
                    }
                    return item;
                })

                set({
                    cart: updatedCartProducts
                })
            },
            sustractProductToCart: (product: CartProduct) => {
                const { cart } = get()

                const productInCart = cart.some(item => item.id === product.id && item.size === product.size)

                if (!productInCart) {
                    return []
                }

                const updatedCartProducts = cart.map((item) => {
                    if (item.id === product.id && item.size === product.size) {
                        return {
                            ...item,
                            quantity: product.quantity
                        }
                    }
                    return item
                })

                set({
                    cart: updatedCartProducts
                })
            },
            deleteProductToCart: (product: CartProduct) => {
                const { cart } = get()

                const updatedCartProducts = cart.filter(item => {
                    return item.id !== product.id || item.size !== product.size
                })
                set({
                    cart: updatedCartProducts
                })
            }
        })
        , {
            name: "shopping-cart",
            storage: createJSONStorage(() => localStorage) // es una opción que permite elegir donde se guardará la información
        }
    )
)