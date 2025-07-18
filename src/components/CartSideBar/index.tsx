import { useCart } from "@Components/CartContext";
import React, {  Dispatch, SetStateAction, useEffect, useState } from "react";
import "./style.sass"
import { addSalesAndType, addTotalAndType, updateProduct } from "@Api/services/products";
import RadioButton from "@Components/RadioButton";
import Notification, { NotificationType } from '@Components/Notification';

interface CartSideBarProps {
    isOpen: boolean,
    onClose: () => void;
    setLoading: Dispatch<SetStateAction<boolean>>;
    currentCategory: string | null;
    handleAllButtonsValue: (category : string) => void;
}

const CartsideBar: React.FC<CartSideBarProps> = ({ 
    isOpen,
    onClose,
    setLoading,
    handleAllButtonsValue,
    currentCategory
    }) => 
    {
    
    const { cart, removeFromCart, updateItemQuantity, clearCart} = useCart();
    const total = cart.reduce((sum, item) => sum + (item.product.valor_venda ?? 0) * item.quantidade, 0);
    const [selectedPayment, setSelectedPayment] = useState<string>("")
    const [valorTotal, setValorTotal] = useState<number>(0)
    const [note, setNote] = useState<NotificationType>({
        message: "",
        show: false,
        type: "info"
      });

    const handleRadioChange = (value : string) =>{
        setSelectedPayment(value)
    }

    const handleValorTotalChange = (value : number) =>{
        setValorTotal(value);
    }

    const handleSellProduct = async () => {
        setLoading(true);

        for(const item of cart){
            const novaQuantidade = item.product.quantidade - item.quantidade;
            // let novaQuantidadeUn = item.product.quantidadeUn;

            // if(item.quantidade >= 6){
            //     novaQuantidadeUn = item.product.quantidadeUn - 1
            // }
            const quantidadeT = cart.reduce((total, item) => {
                return total + item.quantidade;
            }, 0)

            if(novaQuantidade < 0){
                setNote({
              message: "Quantidade insuficiente no estoque!",
              show: true,
              type: "warning"
                });
                setLoading(false);
                return;
            }

            // console.log("Quantidade un: ", novaQuantidadeUn)
            const updatedProduct = {
                ...item.product,
                quantidade: novaQuantidade,
                // quantidadeUn: novaQuantidadeUn,
            };

            const addTotalWType = {
                tipo : selectedPayment, 
                valor : valorTotal,
                quantidade : quantidadeT,
                produto: item.product.nome
            }

            const addTipoVendaGrafico = {
                tipo : selectedPayment
            }

            const respUpdate = await updateProduct(updatedProduct);
            const addTotalAndTypeV = await addTotalAndType(addTotalWType);
            const addTipoVendaGraficoS = await addSalesAndType(addTipoVendaGrafico);

            if(respUpdate.error){
                setNote({
                message: `${respUpdate.response.response.data.detail}`,
                show: true,
                type: "error"
              });
            }

            if(addTotalAndTypeV.error){
                setNote({
                    message: `${addTotalAndTypeV.response.response.data.detail}`,
                    show: true,
                    type: "error"
                });
                setLoading(false);
                return;
            }

            if(addTipoVendaGraficoS.error){
                setNote({
                    message: `${addTipoVendaGraficoS.response.response.data.detail}`,
                    show: true,
                    type: "error"
                })
            }

            if(respUpdate.error, addTotalAndTypeV.error, addTipoVendaGraficoS.error === false){
                setNote({
                    message: "Venda realizada com sucesso, produto atualizado!",
                    show: true,
                    type: "success"
                })
            }
        }

        setTimeout(() =>{
            clearCart();
            if(currentCategory){
                handleAllButtonsValue(currentCategory)
            }
            setLoading(false)
            onClose()
        }, 1500)
      };

     console.log("isOpen: ", isOpen)

      if(!isOpen){
        return null;
        }
    
    useEffect(() =>{
        handleValorTotalChange(total)
    }, [total])

    return(
        <>
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
                                    <p id="itemPrice">({item.quantidade} × {(item.product.valor_venda ?? 0).toFixed(2)})</p>
                                    <button onClick={() => updateItemQuantity(item.product.idProduto ?? 0, item.quantidade + 1)}>+</button>
                                    <button onClick={() => updateItemQuantity(item.product.idProduto ?? 0, item.quantidade - 1)}>-</button>
                                </div>
                                <button onClick={() => removeFromCart(item.product.idProduto ?? 0)} id="removeButton">X</button>
                            </li>
                        ))}
                    </ul>

                    <div id="radiobutton-together">
                        <div id="radiobutton-class">
                            <RadioButton title="Pix" selectedValue={selectedPayment} onChange={handleRadioChange} />Pix
                            <RadioButton title="Cartão de crédito" selectedValue={selectedPayment} onChange={handleRadioChange} />Cartão de crédito
                            <RadioButton title="Cartão de debito" selectedValue={selectedPayment} onChange={handleRadioChange} />Cartão de debito
                        </div>
                        <div id="radiobutton-class">
                            <RadioButton title="Fiado" selectedValue={selectedPayment} onChange={handleRadioChange} />Fiado
                            <RadioButton title="Dinheiro" selectedValue={selectedPayment} onChange={handleRadioChange} />Dinheiro
                        </div>
                    </div>
                    <div id="total-close">
                        <div id="total">Total: R$ {total.toFixed(2)}</div>
                        <button onClick={handleSellProduct} id="checkoutButton" disabled={cart.length === 0}> Finalizar Venda </button>
                    </div>
                </>
            )}
        </div>
        <Notification
            note={note}
            setNote={setNote} />
        </>
    )
}

export default CartsideBar