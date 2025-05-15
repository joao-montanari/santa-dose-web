import { useCart } from "@Components/CartContext";
import Modal from "@Components/Modal"
import { Product } from "@Models/product";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useState } from "react";

type SalesModalProps = {
    isOpen: (value: boolean) => void,
    open: boolean, 
    description: string, 
    product: Product;
    setIsCartOpen: (value: boolean) => void
}

    const SalesModal = ({ isOpen, open, description, product, setIsCartOpen} : SalesModalProps) => {
        const [quantidade, setQuantidade] = useState<number>(0);
        const { addToCart } = useCart();
    
    const handleAddToCart = () => { 
        if (quantidade > 0) {
            addToCart({
                quantidade,
                product,
            });
        }

        setIsCartOpen(true)
        isOpen(false);
        setQuantidade(0);
    };

    return(
        <Modal isOpen={open}>
            <AttachMoneyIcon style={{ color: "black", width: "55px", height: "55px", backgroundColor:"green", borderRadius:"50%", padding: "8px" }}/><h2>{product.nome}</h2>
            <p>{description}</p>
            <div style={{ width: "100%"}}>
                <h4>Digite a quantidade que será vendida:</h4>
                <input type="number" value={quantidade} onChange={(e) => setQuantidade(e.target.value ? parseInt(e.target.value) : 0)} style={{ width: "80px", borderRadius: "5px"}}></input>
                <button onClick={handleAddToCart}
                  style={{ backgroundColor : "Green", color: "#fff"}}  >
                    Adicionar ao carrinho
                </button>

                <button onClick={() => {isOpen(false); 
                     setQuantidade(0);
                     }} style={{ backgroundColor : "#fff", border: '1px solid #828080'}}>
                    Cancelar
                </button>
            </div>
        </Modal>

    )
}

export default SalesModal;