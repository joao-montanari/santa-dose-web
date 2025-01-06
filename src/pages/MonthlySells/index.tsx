import Title from "@Components/Title"
import "./style.sass"
import MonthBox from "@Components/MonthBox"
import { useState, useEffect } from "react"
import { getMonthValue } from "@Api/services/products"
import { useNavigate } from "react-router-dom"
import Notification, { NotificationType } from '@Components/Notification';
import Loading from "@Components/Loading"

const MonthlySells = () =>{
    const [loading, setLoading] = useState(false)
    const [dataProduct, setDataProduct] = useState<Record<string, number>>({});
    const navigate = useNavigate();
    const [note, setNote] = useState<NotificationType>({
        message: "",
        show: false,
        type: "info"
      });

    async function monthValues() {
        setLoading(true);
        const data = await getMonthValue();
        console.log("Dados: ", data)
    
        if (data.error) {
          if(data.response.response.status === 401) navigate("/login");
    
          setNote({
            show: true,
            message: `${data.response.response.data.detail}`,
            type: "error"
          });
    
        } else {
            if (Array.isArray(data) && data.length > 1) {
                const monthsArray = data[1]

                if(Array.isArray(monthsArray)) {
                    const monthMap = monthsArray.reduce((acc: Record<string, number>, item: any) => {
                        acc[item.mes] = item.valor; 
                        return acc;
                    }, {});
                    
                    console.log("Objeto mapeado para dataProduct:", monthMap);
                    setDataProduct(monthMap);
                }else{
                    console.log("Data.response[1] não é um array", monthsArray)
                }
            } else {
                console.error("Estrutura inesperada em data.response:", data.response);
            }
        }
        setLoading(false);
    }

    useEffect(() => {
        monthValues();
        if(localStorage.getItem("product-operation")) {
          setNote({
            show: true,
            message: `${localStorage.getItem("product-operation")}`,
            type: "success"
          });
          localStorage.removeItem("product-operation");
        }
      }, []);

      const months = [
        "Janeiro", 
        "Fevereiro", 
        "Março", 
        "Abril", 
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
    ];
    
    return(
            <>
                <div id="month-sells-header">
                    <Title 
                        title="Vendas Totais Mensáis"
                        subTitle="Veja o total de vendas mensáis da Adega"/>
                </div>
                <div id="month-justify-place">
                    <div id="month-sells-background">
                        <div id="month-title-content">
                            <h1>Mêses e seus totais de vendas</h1>
                        </div>

                        <div id="month-sells-content">
                        {months
                            .reduce((acc: string[][], _, index) => {
                                if (index % 4 === 0) acc.push(months.slice(index, index + 4));
                                return acc;
                            }, [])
                            .map((group, groupIndex) => (
                                <div key={groupIndex} id="month-group">
                                    {group.map((month, index) => (
                                        <MonthBox
                                            key={index}
                                            monthName={month}
                                            totalValue={dataProduct[month] || 0} // Pega o valor ou 0 caso não exista
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                             
                    </div>
                </div>
                
                {loading && <Loading/>}

                <Notification 
                    note={note}
                    setNote={setNote}
                />
            </>

            
    )
}

export default MonthlySells