import { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface State {
    cart: CartProduct[];
    getTotalItems: () => number
    addProductToCart: (product: CartProduct) => void;
}

export const useCartStore = create<State>()(

    persist(
        (set, get) => ({
            cart: [] as CartProduct[],
            getTotalItems() {
                const { cart } = get() //obtenemos el estado actual del carrito
                return cart.reduce((total, item) => total + item.quantity, 0)
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
            }
        })
        , {
            name: "shopping-cart",
            storage: createJSONStorage(() => localStorage) // es una opción que permite elegir donde se guardará la información
        }
    )
)