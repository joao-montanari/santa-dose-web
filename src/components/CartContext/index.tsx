import { Product } from "@Models/product";
import React, {createContext, useContext, useState} from "react";

export type CartItem = {
    quantidade: number;
    product: Product;
};
    

type CartContextType = {
    cart: CartItem[];
    addToCart: (item : CartItem) => void;
    removeFromCart: (id: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children : React.ReactNode}> = ({ children }) =>{
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = (item: CartItem) =>{
        setCart((prev) =>{
            const existing = prev.find((p) => p.product.idProduto === item.product.idProduto);
            if(existing){
                return prev.map((p) =>
                    p.product.idProduto === item.product.idProduto ? {...p, quantidade: p.quantidade + item.quantidade} : p
                );
            }
            return [...prev, item];
        });
    };

    const removeFromCart = (id: number) => {
        setCart((prev) => prev.filter((item) => item.product.idProduto !== id));
    };

    const clearCart = () => setCart([]);

    return(
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
  
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("Erro no uso do carrinho")
    return context;
};