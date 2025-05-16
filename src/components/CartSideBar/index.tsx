import { useCart } from "@Components/CartContext";
import React, {  Dispatch, SetStateAction } from "react";
import "./style.sass"
import { updateProduct } from "@Api/services/products";

type NotificationType = {
  message: string;
  show: boolean;
  type: "info" | "success" | "error" | "warning";
};

interface CartSideBarProps {
    isOpen: boolean,
    onClose: () => void;
    setNote: Dispatch<SetStateAction<NotificationType>>;
    setLoading: Dispatch<SetStateAction<boolean>>;
    currentCategory: string | null;
    handleAllButtonsValue: (category : string) => void;
}

const CartsideBar: React.FC<CartSideBarProps> = ({ 
    isOpen,
    onClose,
    setNote, 
    setLoading,
    handleAllButtonsValue,
    currentCategory
    }) => 
    {
    
    const { cart, removeFromCart, clearCart} = useCart();
    const total = cart.reduce((sum, item) => sum + (item.product.valor_venda ?? 0) * item.quantidade, 0);

    const handleSellProduct = async () => {
        setLoading(true);


        for(const item of cart){
            const novaQuantidade = item.product.quantidade - item.quantidade;
            // const originalProduct = productsList.find(p => p.idProduto === item.id);

            if(novaQuantidade < 0){
                setNote({
              message: "Quantidade insuficiente no estoque!",
              show: true,
              type: "warning"
                });
                setLoading(false);
                return;
            }
            const updatedProduct = {
                ...item.product,
                quantidade: novaQuantidade,
            };

            const respUpdate = await updateProduct(updatedProduct);

            if(respUpdate.error){
                setNote({
                message: `${respUpdate.response.response.data.detail}`,
                show: true,
                type: "error"
              });
              setLoading(false);
              return;
            }
        }

        clearCart();
        setNote({
                message: "Produto vendido com sucesso!",
                show: true,
                type: "success"
              });
        if(currentCategory){
            handleAllButtonsValue(currentCategory)
        }
        setLoading(false)
        onClose()
      };

     console.log("isOpen: ", isOpen)

      if(!isOpen){
        return null;
        }
    
    console.log("Carrinho montado")

    return(
        <div id="cartSidebar" className={isOpen ? 'open' : ''}>
            <div id="button-and-title">
                <h2 id="cartTitle">Carrinho</h2>
                <button id="button-close" onClick={onClose}>X</button>
            </div>
            {cart.length === 0 ? (
                <p>Carrinho Vazio</p>
            ) : (
                <>
                    <ul>
                        {cart.map((item) => (
                            <li key={item.product.idProduto} id="cartItem">
                                <div id="itemInfo">
                                    <p id="itemName">{item.product.nome}</p>
                                    <p id="itemPrice">{item.quantidade} × {(item.product.valor_venda ?? 0).toFixed(2)}</p>
                                </div>
                                <button onClick={() => removeFromCart(item.product.idProduto ?? 0)} id="removeButton">X</button>
                            </li>
                        ))}
                    </ul>
                    <div id="total">Total: R$ {total.toFixed(2)}</div>
                    <button onClick={handleSellProduct} id="checkoutButton" disabled={cart.length === 0}> Finalizar Venda </button>
                </>
            )

            }
        </div>
    )
}

export default CartsideBar