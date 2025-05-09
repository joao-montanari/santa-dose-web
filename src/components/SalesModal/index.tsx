import Modal from "@Components/Modal"
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useState } from "react";

const SalesModal = ({
    isOpen, 
    titleProduct, 
    open, 
    description, 
    sales} 
    : {
        isOpen: any,
        titleProduct: string,
        open: boolean, 
        description: string, 
        sales: any
    }) =>{

    const [quantidade, setQuantidade] = useState<number>(0)
    
    return(
        <Modal isOpen={open}>
            <AttachMoneyIcon style={{ color: "black", width: "55px", height: "55px", backgroundColor:"green", borderRadius:"50%", padding: "8px" }}></AttachMoneyIcon>
            <h2>{titleProduct}</h2>
            <p>{description}</p>
            <div style={{ width: "100%"}}>
                <h4>Digite a quantidade que será vendida:</h4>
                <input type="number" value={quantidade} onChange={(e) => setQuantidade(e.target.value ? parseInt(e.target.value) : 0)} style={{ width: "80px", borderRadius: "5px"}}></input>
                <button onClick={() => {sales(quantidade);
                  isOpen(false)
                  setQuantidade(0)}}
                  style={{ backgroundColor : "Green", color: "#fff"}}  >
                    Vender
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

export default SalesModal