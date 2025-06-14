import Button from "@Components/Button";
import Loading from "@Components/Loading";
import Menu, { OptionMenuType } from "@Components/Menu";
import { NotificationType } from "@Components/Notification";
import SelectOption from "@Components/SelectOption";
import TableSales from "@Components/TableSales";
import Title from "@Components/Title";
import { AccountBox, LockReset, Logout } from "@mui/icons-material";
import { OptionSelect } from "@Utils/optionSelect";
import { month_select } from "@Utils/selectsMonths.const";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Notification from "@Components/Notification"
import { addDaysExpensesValue, createMonthExpensesValue, getDaysExpensesValue } from "@Api/services/expenses";
import getPhotoUser from "@Api/services/getPhotoUser";

const Expenses = () => {
    const navigate = useNavigate()
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

    const handleTotalChange = (total : number) =>{
        if(product.tipo) {
            setMonthsTotal((prev) => ({
                    ...prev,
                    [product.tipo]: total,
            }));
            };
        }

    const handleDayValueChange = (dia: number, valor: number) => {
        if (product.tipo) {
            setMonthsTotal((prev) => ({
                ...prev,
                [`${product.tipo}-${dia}`]: valor,
            }));
        }
    };  

    async function handleSubmitExpensesDay() {
        if (!product.tipo) {
            setNote({
                message: "Selecione um mês antes de enviar os gastos do dia",
                show: true,
                type: "warning",
            });
            return;
        }
    
        setLoading(true);
    
        try {
            const registrosDiarios = Object.entries(monthsTotal)
                .filter(([key]) => key.startsWith(`${product.tipo}-`)) // Filtra apenas os valores do mês selecionado
                .map(([key, valor]) => {
                    const dia = key.split("-")[1]; // Extrai o dia da chave "mes-dia"
                    const sale = sales.find((s) => s.day === dia)
                    const reason = sale?.reason || "";
                    return { mes: product.tipo, dia: Number(dia), valor, motivo: reason};
                });

    
            for (const registro of registrosDiarios) {
            console.log("Dados enviados: ", registro)

                const response = await addDaysExpensesValue(registro);
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
            navigate("/financial/expenses");
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

    async function handleSubmitExpensesValues() {
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
                    message: "O valor total das contas deve ser maior que 0",
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
                const response = await createMonthExpensesValue(submitData); // chamando para enviar os dados
                if (response.error){
                    setNote({
                        message: "Gasto aleatório total já existente para o mês de " + product.tipo,
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
                    navigate("/financial/monthly-expenses");
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

    async function getDailyExpenses(){
        if(!product.tipo) return;
        setLoading(true)
        try{
            const response = await getDaysExpensesValue(product.tipo);
            const novosGastos: { day: string; value: string; reason: string}[] = []
            const novosValores: Record<string, number> = {}

            for(let i = 1; i <= 31; i++){
                const registro = response[1]?.find((r: {dia : number}) => r.dia === i);

                // response[1].forEach((registro: {dia: number, valor: number, motivo?: string}) => {
                    // novosValores[`${product.tipo}-${registro.dia}`] = registro.valor;
                novosGastos.push({
                        day: i.toString(),
                        value: registro ? registro.valor.toString() : "",
                        reason: registro ? registro.motivo || "" : "",
                });

                if(registro){
                    novosValores[`${product.tipo}-${i}`] = registro.valor;
                    }
                }

                setSales(novosGastos)
                setMonthsTotal(novosValores)
            // }
            // console.log("Valores de initialSales antes de passar para a tabela: ", Object.entries(monthsTotal)
            //     .filter(([key]) => key.startsWith(`${product.tipo}-`)) // Filtra apenas os valores do mês selecionado
            //     .map(([key, valor]) => ({
            //         dia: key.split("-")[1], // Extrai o dia da chave "mes-dia"
            //         mes: product.tipo, // Usa o mês selecionado 
            //         valor: valor ? valor.toString() : "0", 
            // })))
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

    return(
        <div id="product-list-main">
            <div id="product-list-header">
                <Title
                title='Gastos Aleatórios'
                subTitle='Veja os valores dos gastos aleatórios da Adega Santa Dose'
                />

                <SelectOption
                    title="Meses"
                    value={month_select.find((month) => month.value === product.tipo) || { value: '', label: '' }}
                    setValue={(selected: OptionSelect) => changeProduct('tipo', selected.value)}
                    selectList={month_select}
                    width="45%"
                />
                    
                <Menu
                    icon={<img src={getPhotoUser()} style={{ width:"35px", borderRadius: "40px", color: "#9A9494", cursor: "pointer"}}/>}
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

            <TableSales
                title="Gastos Aleatórios"
                dayColumnTitle="Dias"
                salesColumTitle="Valores Gastos"
                totalLabel="Total Do Mês"
                daysInMonth={31}
                nameAccount="Motivo Gasto"
                onTotalChange={handleTotalChange}
                onDayValueChange={handleDayValueChange}
                initialSales={Object.entries(monthsTotal)
                    .filter(([key]) => key.startsWith(`${product.tipo}-`)) // Filtra apenas os valores do mês selecionado
                    .map(([key, valor]) => ({
                        dia: key.split("-")[1], // Extrai o dia da chave "mes-dia"
                        mes: product.tipo, // Usa o mês selecionado 
                        valor: valor ? valor.toString() : "0", 
                        motivo: ""
                    }))}
                sales={sales}
                setSales={setSales}
             />

            <div id="buttons-align">
                <div id="buttons-justify">
                    <Button title="Pegar Valores De Gastos Aleatórios Salvos No Mês" onClick={getDailyExpenses} />
                    <Button title="Salvar Valores De Gastos Aleatórios Nos Dias" onClick={handleSubmitExpensesDay}/>
                    <Button title="Enviar Valores De Gastos Aleatórios Do Mês" onClick={handleSubmitExpensesValues}/>
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

export default Expenses