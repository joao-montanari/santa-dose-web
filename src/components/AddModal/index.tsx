import Modal from "@Components/Modal"
import { useState } from "react"
import AddCircleIcon from '@mui/icons-material/AddCircle';

const AddModal = ({isOpen, 
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
            <AddCircleIcon style={{ color: "black", width: "55px", height: "55px", backgroundColor:"Yellow", borderRadius:"50%", padding: "8px" }}></AddCircleIcon>
            <h2>{titleProduct}</h2>
            <p>{description}</p>
            <div style={{ width: "100%"}}>
                <h4>Digite a quantidade que será adicionada:</h4>
                <input type="number" value={quantidade} onChange={(e) => setQuantidade(e.target.value ? parseInt(e.target.value) : 0)} style={{ width: "80px", borderRadius: "5px"}}></input>
                <button onClick={() => sales(quantidade)} style={{ backgroundColor : "Yellow", color: "black"}}  >
                    Adicionar
                </button>

                <button onClick={() => isOpen(false)} style={{ backgroundColor : "#fff", border: '1px solid #828080'}}>
                    Cancelar
                </button>
            </div>
        </Modal>

    )
}

export default AddModal