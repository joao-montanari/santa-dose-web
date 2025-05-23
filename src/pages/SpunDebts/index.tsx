import { createSpunValue, getSpunValue } from "@Api/services/fiadosMes";
import Button from "@Components/Button";
import Loading from "@Components/Loading";
import Menu, { OptionMenuType } from "@Components/Menu";
import { NotificationType } from "@Components/Notification";
import Notification from "@Components/Notification"
import TableSpun from "@Components/TableSpun";
import Title from "@Components/Title";
import { AccountBox, LockReset, Logout } from "@mui/icons-material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Eric from "../../assets/Eric.jpg"

const Spun = () => { 
    const navigate = useNavigate()
    // const [product, setProduct] = useState({dia: 0});
    const [loading, setLoading] = useState(false)
    // const [monthsTotal, setMonthsTotal] = useState<Record<string, number>>({});
    const [salesData, setSalesData] = useState<{ dia: string, name: string, valor: string}[]>([]);
    
    const [note, setNote] = useState<NotificationType>({
        message: "",
        show: false,
        type: "info"
      });

    const logout = () => {
        localStorage.removeItem("token");
        navigate('/login');
    }

    const handleDataChange = useCallback((data: {dia: string, name: string, valor: string}[]) =>{
        setSalesData((prevData) => {
            if(JSON.stringify(prevData) !== JSON.stringify(data)){
                return data;
            }
            return prevData;
        })
    }, []);

    // const handleTotalChange = (total : number) =>{
    //     console.log("Total substituido: ", total)
    // }

    const memoizedSalesData = useMemo(() => [...salesData], [salesData]);
    console.log("Vendo se está atualizando2", memoizedSalesData)

    async function handleSubmitValues() {
        // console.log("SalesData antes do envio:", salesData);
        setLoading(true)
        const normalizedData = salesData.map((item) => ({
            dia: item.dia?.toString() || "", 
            valor: item.valor?.toString() || "",
            name: item.name || "",
        }))
        // console.log("SalesData depois do envio:", normalizedData);

        if(normalizedData.length === 0 || normalizedData.every(({ valor }) => !valor || valor === "")) {
            setNote({
                message: "Erro ao calcular o total",
                show: true,
                type: "warning",
            });
            return;
        }
            console.log("SalesData antes do envio:", salesData);
            console.log("NormalizedData antes do envio:", normalizedData);
            setLoading(true);
        
            try{
                for(const {dia, valor, name} of normalizedData){
                    
                    const submitData = {
                        dia: parseInt(dia),
                        valor: valor ? parseFloat(valor) : 0,
                        name: name ? name : "",
                    }
                    console.log("Enviando dados:", submitData);
                    
                    await createSpunValue(submitData); // chamando para enviar os dados
                }

                    setNote({
                        message: "Valores enviados com sucesso!",
                        show: true,
                        type: "success"
                    });

                    const response = await getSpunValue();
                    if(response && !response.error){
                        const updatedData = response[1].map((item: {dia: number, name: string, valor: number}) => ({
                            dia: item.dia.toString(),
                            name: item.name,
                            valor: item.valor.toString(),
                        }))
                        setSalesData(updatedData)
                    }
            }catch(error) {
                console.error("Erro ao salvar valores", error);
                setNote({
                    message: "Erro inesperado ao enviar os valores",
                    show: true,
                    type: "error",
                });
            }finally {
                setLoading(false);
            }
    }   

    const generateValueSpun = () => {
        return Array.from({ length: 50 }, (_, i) => ({
            dia: i + 1, 
            name: "",
            valor: "",
        }))
    }

    useEffect(() =>{
        const handleGetValues = async() => { 
            setLoading(true)
            try{
                const response = await getSpunValue();
                console.log("Conferindo a resposta: ", response)
                if(!response || response.error){
                    setNote({
                        message: "Nenhum valor de fiado salvo",
                        show: true,
                        type: "error",
                    });
                    return;
                } 
                
                const dias = generateValueSpun();

                // Atualize o estado com os dados retornados
                const updatedData = dias.map((day) => {
                    const savedData = response[1]?.find((item: { dia: number; }) => item.dia === day.dia);
                    return savedData ? {
                        dia: savedData.dia.toString(), //Converte o dia para string
                        name: savedData.name,
                        valor: savedData.valor?.toString()
                    } : 
                        day; //Converte o dia padrão para string
                });
                
                console.log("Vendo se está atualizando", updatedData)
                // setSalesData(updatedData)
                setSalesData(updatedData);

            }catch(error){
                setNote({
                    message: "Erro inesperado ao pegar os dados2",
                    show: true,
                    type: "error"
                })
            }finally{
                setLoading(false)
            }
        }

        handleGetValues();
    }, []);

    

    return(
        <div id="product-list-main">
            <div id="product-list-header">
                <Title
                title='Fiado'
                subTitle='Veja os valores fiados e os devedores da Adega Santa Dose'
                />

                <Menu
                    icon={<img src={Eric} style={{ width:"35px", borderRadius: "40px", color: "#9A9494", cursor: "pointer"}}/>}
                    options={[
                        { label: "Editar perfil", onPress: () => navigate("/profile-form"), icon: <AccountBox/> },
                        { label: "Trocar senha", onPress: () => navigate("/change-password"), icon: <LockReset/> },
                        { label: "Sair", onPress: () => logout(), icon: <Logout/> }
                    ] as OptionMenuType[]}
                    style={{
                        margin: "0px 10px 0px 20px"
                    }}
                />
            </div>


            <TableSpun
                title="Fiado"
                dayColumnTitle="Quantidade Devedores"
                salesColumTitle="Dívida"
                totalLabel="Total Do Mês"
                daysInMonth={50}
                onDataChange={handleDataChange} 
                titleNamesSpun="Nome Devedores"
                initialData={salesData}
            />

            <div id="buttons-align">
                <div id="buttons-justify">
                    <Button title="Salvar Os Valores Fiados" onClick={handleSubmitValues}/>
                </div>
            </div>

            {
            loading && <Loading/>
            }

            <Notification 
                note={note}
                setNote={setNote}
            />
        </div>
    )
}


export default Spun