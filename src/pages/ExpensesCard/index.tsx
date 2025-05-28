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
import { addCardDaysExpensesValue, createCardMonthExpensesValue, getCardDaysExpensesValue } from "@Api/services/expensesCard";
import getPhotoUser from "@Api/services/getPhotoUser";

const ExpensesCard = () => { 
    const navigate = useNavigate()
    const [product, setProduct] = useState({tipo: '', dia: 0});
    const [loading, setLoading] = useState(false)
    const [monthsTotal, setMonthsTotal] = useState<Record<string, number>>({});
    
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

    async function handleSubmitCardExpensesDay() {
        if (!product.tipo) {
            setNote({
                message: "Selecione um mês antes de enviar os valores do dia",
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
                    return { mes: product.tipo, dia: Number(dia), valor };
                });

    
            for (const registro of registrosDiarios) {
            console.log("Dados enviados: ", registro)

                const response = await addCardDaysExpensesValue(registro);
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
            navigate("/expenses-card");
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

    async function handleSubmitCardExpensesValues() {
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
                const response = await createCardMonthExpensesValue(submitData); // chamando para enviar os dados
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
                    navigate("/expenses-card-monthly");
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

    async function getDailyBills(){
        if(!product.tipo) return;
        setLoading(true)
        try{
            const response = await getCardDaysExpensesValue(product.tipo);
            console.log("Valores de initialSales antes de passar para a tabela: ", Object.entries(monthsTotal)
                .filter(([key]) => key.startsWith(`${product.tipo}-`)) // Filtra apenas os valores do mês selecionado
                .map(([key, valor]) => ({
                    dia: key.split("-")[1], // Extrai o dia da chave "mes-dia"
                    mes: product.tipo, // Usa o mês selecionado 
                    valor: valor ? valor.toString() : "0", 
            })))
            if(response){
                const novosValores: Record<string, number> = {};
                response[1].forEach((registro: {dia: number, valor: number}) => {
                novosValores[`${product.tipo}-${registro.dia}`] = registro.valor;
                });

                setMonthsTotal(novosValores)
        }
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
                title='Dividas Cartão'
                subTitle='Veja os valores das dividas no cartão da Adega Santa Dose'
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
                title="Dividas Cartão"
                dayColumnTitle="Dias"
                salesColumTitle="Valores Cartão"
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
                    }))}
             />

            <div id="buttons-align">
                <div id="buttons-justify">
                    <Button title="Pegar Valores De Dividas Salvos No Mês" onClick={getDailyBills} />
                    <Button title="Salvar Valores De Dividas Nos Dias" onClick={handleSubmitCardExpensesDay}/>
                    <Button title="Enviar Valores De Dividas Do Mês" onClick={handleSubmitCardExpensesValues}/>
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
export default ExpensesCard