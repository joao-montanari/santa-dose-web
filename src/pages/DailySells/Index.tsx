import TableSales from "@Components/TableSales"
import Title from "@Components/Title"
import "./style.sass"
import SelectOption from "@Components/SelectOption"
import { useEffect, useState } from "react"
import { month_select } from "@Utils/selectsMonths.const"
import { OptionSelect } from "@Utils/optionSelect"
import Notification from "@Components/Notification"
import { createMonthValue } from "@Api/services/products"
import { NotificationType } from "@Components/Notification"
import { useNavigate } from "react-router-dom"
import Button from "@Components/Button"
import Loading from "@Components/Loading"
import Menu, { OptionMenuType } from "@Components/Menu"
import { AccountBox, LockReset, Logout } from "@mui/icons-material"
import { addDaysMonthValue, getDaysMonthValue } from "@Api/services/fiadosMes"
import getPhotoUser from "@Api/services/getPhotoUser"
import { sell_type_select } from "@Utils/selectTypeSale.const"

const DailySells = () =>{
    const navigate = useNavigate()
    const [productFull, setProductFull] = useState({tipo: ''});
    const [product, setProduct] = useState({tipo: '', dia: 0});
    const [loading, setLoading] = useState(false)
    const [monthsTotal, setMonthsTotal] = useState<Record<string, number>>({});
    const [sales, setSales] = useState<{day: string, value: string, reason: string}[]>([])
    
    const [note, setNote] = useState<NotificationType>({
        message: "",
        show: false,
        type: "info"
      });

    const logout = () => {
        localStorage.removeItem("token");
        navigate('/login');
    }


    const changeProduct = (key : string, value : string | number) => {
        setProduct(prevState => ({
            ...prevState, 
            [key] : value
        }));
    }

    const changeTypeSell = (key : string, value : string | number) => {
        setProductFull(prevState => ({
            ...prevState, 
            [key] : value
        }));
    }

    const handleTotalChange = (total : number) =>{
        if(product.tipo) {
            setMonthsTotal((prev) => ({
                    ...prev,
                    [product.tipo]: total,
            }));
            };
        }

    // const [pendingValue, setPendingValue] = useState<{ dia: number, valor: number } | null>(null);

    
    const handleDayValueChange = (dia: number, valor: number) => {
        if (product.tipo && productFull.tipo) {
            setMonthsTotal((prev) => ({
                ...prev,
                [`${product.tipo}-${productFull.tipo}-${dia}`]: valor,
            }));
        }
    };  

    async function handleSubmitValuesDay() {
        if (!product.tipo) {
            setNote({
                message: "Selecione um mês antes de enviar os valores do dia",
                show: true,
                type: "warning",
            });
            return;
        }

        if (!productFull.tipo) {
            setNote({
                message: "Selecione um tipo de pagamento antes de enviar os valores do dia",
                show: true,
                type: "warning",
            });
            return;
        }
    
        setLoading(true);
    
        try {
            const registrosDiarios = Object.entries(monthsTotal)
                .filter(([key]) => key.startsWith(`${product.tipo}-${productFull.tipo}-`)) // Filtra apenas os valores do mês selecionado
                .map(([key, valor]) => {
                    const dia = key.split("-")[2]; // Extrai o dia da chave "mes-dia"
                    // const sale = sales.find((s) => s.day === dia);
                    const reason = "";
                    
                    return { mes: product.tipo, dia: Number(dia), valor, motivo: reason, tipo_venda: productFull.tipo};
                });

            console.log("Como está indo: ", registrosDiarios)
            for (const registro of registrosDiarios) {
            console.log("Dados enviados: ", registro)

                const response = await addDaysMonthValue(registro);
                if (response.error) {
                    setNote({
                        message: `Registro diário já existente para o dia ${registro.dia}`,
                        show: true,
                        type: "error",
                    });
                }
            }
    
            setNote({
                message: "Valores enviados com sucesso!",
                show: true,
                type: "success",
            });
    
            localStorage.setItem("product-operation", "Valores do mês enviados!");
            navigate("/financial/daily-sells");
            }catch(error) {
                console.error("Erro ao enviar valores", error);
                setNote({
                    message: "Erro inesperado ao enviar os valores",
                    show: true,
                    type: "error",
                });
            }finally {
                setLoading(false);
            }
    }   

    async function handleSubmitValues() {
        if(!product.tipo) {
            setNote({
                message: "Selecione um mês antes de enviar os valores",
                show: true,
                type: "warning",
            });
            return;
        }
            const totalValue = Object.entries(monthsTotal)
                .filter(([key]) => key.startsWith(`${product.tipo}-`)) // Filtra valores do mês selecionado
                .reduce((acc, [, valor]) => acc + valor, 0);

            if(totalValue <= 0) {
                setNote({
                    message: "O valor total deve ser maior que 0",
                    show: true,
                    type: "warning",
                });
                return;
            }

            setLoading(true);

            const submitData = {
                mes: product.tipo,
                valor: totalValue,
            };

            try{
                const response = await createMonthValue(submitData); // chamando para enviar os dados
                if (response.error){
                    setNote({
                        message: "Registro mensal já existente para o mês de " + product.tipo,
                        show: true,
                        type: "error",
                    });
                }else{
                    setNote({
                        message: "Valores enviados com sucesso!",
                        show: true,
                        type: "success"
                    });
                    localStorage.setItem("product-operation", "Valores do mês enviados!");
                    navigate("/financial/monthly-sells");
                }
            }catch(error) {
                console.error("Erro ao enviar valores", error);
                setNote({
                    message: "Erro inesperado ao enviar os valores",
                    show: true,
                    type: "error",
                });
            }finally {
                setLoading(false);
            }
    }

    async function getDailySells(){
        if (!product.tipo) {
            setNote({
                message: "Selecione um mês antes de enviar os valores do dia",
                show: true,
                type: "warning",
            });
            return;
        }

        if (!productFull.tipo) {
            setNote({
                message: "Selecione um tipo de pagamento antes de enviar os valores do dia",
                show: true,
                type: "warning",
            });
            return;
        }
        setLoading(true)
        try{
            const response = await getDaysMonthValue(product.tipo, productFull.tipo);
            console.log("Valores: ", response[1])
            const novosGastos: { day: string; value: string; reason: string}[] = []
            const novosValores: Record<string, number> = {}

            for(let i = 1; i <= 31; i++){
                const registro = response[1]?.find((r: {dia : number}) => r.dia === i);

                // response[1].forEach((registro: {dia: number, valor: number, motivo?: string}) => {
                    // novosValores[`${product.tipo}-${registro.dia}`] = registro.valor;
                novosGastos.push({
                        day: i.toString(),
                        value: registro ? registro.valor.toString() : "",
                        reason: registro ? registro.motivo || "" : ""
                });

                if(registro){
                    novosValores[`${product.tipo}-${i}`] = registro.valor;
                    }
                }

                setSales(novosGastos)
                setMonthsTotal(novosValores)
        //     console.log("Valores de initialSales antes de passar para a tabela: ", Object.entries(monthsTotal)
        //         .filter(([key]) => key.startsWith(`${product.tipo}-`)) // Filtra apenas os valores do mês selecionado
        //         .map(([key, valor]) => ({
        //             dia: key.split("-")[1], // Extrai o dia da chave "mes-dia"
        //             mes: product.tipo, // Usa o mês selecionado 
        //             valor: valor ? valor.toString() : "0", 
        //     })))
        //     if(response){
        //         const novosValores: Record<string, number> = {};
        //         response[1].forEach((registro: {dia: number, valor: number}) => {
        //         novosValores[`${product.tipo}-${registro.dia}`] = registro.valor;
        //         });

        //         setMonthsTotal(novosValores)
        // }
        }catch (error){
            setNote({
                message: "Erro ao carregar os valores do mês",
                show: true, 
                type: "error"
            });
        }finally{
            setLoading(false);
        }
    }

    // useEffect(() => {
    //     if (pendingValue && product.tipo) {
    //         setMonthsTotal((prev) => ({
    //             ...prev,
    //             [`${product.tipo}-${pendingValue.dia}`]: pendingValue.valor,
    //         }));
    //     }
    // }, [pendingValue, product.tipo]);

    return(
        <div id="product-list-main">
            <div id="product-list-header">
                <Title
                    title='Vendas Diárias'
                    subTitle='Veja as vendas diárias/mensal da Adega Santa Dose' />

                <SelectOption
                    title="Meses"
                    value={month_select.find((month) => month.value === product.tipo) || { value: '', label: '' }}
                    setValue={(selected: OptionSelect) => changeProduct('tipo', selected.value)}
                    selectList={month_select}
                    width="23%" />
                
                <SelectOption
                    title="Tipo de Pagamento"
                    value={sell_type_select.find((type) => type.value === productFull.tipo) || { value: '', label: ''}}
                    setValue={(selected: OptionSelect) => changeTypeSell('tipo', selected.value)}
                    selectList={sell_type_select}
                    width="23%" />

                <Menu
                        icon={<img src={getPhotoUser()} style={{ width:"35px", borderRadius: "40px", color: "#9A9494", cursor: "pointer"}} />}
                        options={[
                            { label: "Editar perfil", onPress: () => navigate("/profile-form"), icon: <AccountBox /> },
                            { label: "Trocar senha", onPress: () => navigate("/change-password"), icon: <LockReset /> },
                            { label: "Sair", onPress: () => logout(), icon: <Logout /> }
                        ] as OptionMenuType[]}
                        style={{
                            margin: "0px 10px 0px 20px"
                }} />
                
                   
        </div><TableSales
                title="Vendas Diárias"
                dayColumnTitle="Dias"
                salesColumTitle="Valores Venda"
                totalLabel="Total Do Mês"
                daysInMonth={31}
                onTotalChange={handleTotalChange}
                onDayValueChange={handleDayValueChange}
                initialSales={Object.entries(monthsTotal)
                    .filter(([key]) => key.startsWith(`${product.tipo}-`)) // Filtra apenas os valores do mês selecionado
                    .map(([key, valor]) => ({
                        dia: key.split("-")[1], // Extrai o dia da chave "mes-dia"
                        mes: product.tipo, // Usa o mês selecionado 
                        valor: valor ? valor.toString() : "0",
                        motivo: "",
                        card: ""
                    }))} 
                    sales={sales}
                    setSales={setSales}
                    /><div id="buttons-align">
                <div id="buttons-justify">
                    <Button title="Pegar Valores Salvos No Mês" onClick={getDailySells} />
                    <Button title="Salvar Valores Do Dia" onClick={handleSubmitValuesDay} />
                    <Button title="Enviar Valores Do Mês" onClick={handleSubmitValues} />
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

export default DailySells

