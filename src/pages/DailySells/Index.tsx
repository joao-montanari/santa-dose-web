import TableSales from "@Components/TableSales"
import Title from "@Components/Title"
import "./style.sass"
import SelectOption from "@Components/SelectOption"
import { useState } from "react"
import { month_select } from "@Utils/selectsMonths.const"
import { OptionSelect } from "@Utils/optionSelect"
import Notification from "@Components/Notification"
import { createMonthValue, updateMonthValue } from "@Api/services/products"
import { NotificationType } from "@Components/Notification"
import { useNavigate } from "react-router-dom"
import Button from "@Components/Button"
import Loading from "@Components/Loading"
import Menu, { OptionMenuType } from "@Components/Menu"
import { AccountBox, AccountCircle, LockReset, Logout } from "@mui/icons-material"

const DailySells = () =>{
    const navigate = useNavigate()
    const [product, setProduct] = useState({tipo: ''});
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
                [product.tipo] : total
            }));
            console.log("Valor variavel monthsTotal: ", monthsTotal)
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
            const totalValue = monthsTotal[product.tipo] || 0;

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
                    navigate("/monthly-sells");
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

    async function handleUpdateValues() {
        if(!product.tipo) {
            setNote({
                message: "Selecione um mês antes de enviar os valores",
                show: true,
                type: "warning",
            });
            return;
        }
            const totalValue = monthsTotal[product.tipo] || 0;

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
                const response = await updateMonthValue(submitData); // chamando para enviar os dados
                if (response.error){
                    setNote({
                        message: "Erro ao atualizar os dados",
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
                    navigate("/monthly-sells");
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

    return(
        <div id="product-list-main">
            <div id="product-list-header">
                <Title
                title='Vendas Diárias'
                subTitle='Veja as vendas diárias/mensal da Adega Santa Dose'
                />

                <SelectOption
                    title="Meses"
                    value={month_select.find((month) => month.value === product.tipo) || { value: '', label: '' }}
                    setValue={(selected: OptionSelect) => changeProduct('tipo', selected.value)}
                    selectList={month_select}
                    width="45%"
                />

                <Menu
                    icon={<AccountCircle style={{ color: "#9A9494" }}/>}
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
                title="Vendas Diárias"
                dayColumnTitle="Dias"
                salesColumTitle="Valores Venda"
                totalLabel="Total Do Mês"
                daysInMonth={31}
                onTotalChange={handleTotalChange}
            />

            <div id="buttons-align">
                <div id="buttons-justify">
                    <Button title="Enviar Valores" onClick={handleSubmitValues}></Button>
                    <Button title="Atualizados Valores Do Mês Desejado" onClick={handleUpdateValues}></Button>
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