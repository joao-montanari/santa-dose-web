import Button from "@Components/Button";
import Loading from "@Components/Loading";
import Menu, { OptionMenuType } from "@Components/Menu";
import MonthBox from "@Components/MonthBox";
import { NotificationType } from "@Components/Notification";
import SelectOption from "@Components/SelectOption";
import Title from "@Components/Title";
import { AccountBox, AccountCircle, LockReset, Logout } from "@mui/icons-material";
import { OptionSelect } from "@Utils/optionSelect";
import { month_select } from "@Utils/selectsMonths.const";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Notification from "@Components/Notification"
import { deleteMonthBillsValue, getBillsMonthValue } from "@Api/services/billsMes";

const monthlyBills = () =>{
    const [loading, setLoading] = useState(false)
    const [product, setProduct] = useState({tipo: ''});
    const [dataProduct, setDataProduct] = useState<Record<string, number>>({});
    const navigate = useNavigate();
    
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

    async function handleClarValues() {
        if(!product.tipo) {
            setNote({
                message: "Selecione um mês antes de limpar os valores de contas",
                show: true,
                type: "warning",
            });
            return;
        }
            setLoading(true);

            try{
                const response = await deleteMonthBillsValue(product.tipo); // chamando para enviar os dados
                if (response.error){
                    setNote({
                        message: "Erro ao tentar limpar os valores do mês " + product.tipo,
                        show: true,
                        type: "error",
                    });
                }else{
                    setNote({
                        message: "Mês limpo com sucesso!",
                        show: true,
                        type: "success"
                    });
                    localStorage.setItem("product-operation", "Valores do mês " + product.tipo + " atualizado!");
                    window.location.reload();
                    // navigate("/monthly-sells");
                }
            }catch(error) {
                console.error("Erro ao limpar o valor", error);
                setNote({
                    message: "Erro inesperado ao limpar o valor",
                    show: true,
                    type: "error",
                });
            }finally {
                setLoading(false);
            }
    }

    async function monthValues() {
        setLoading(true);
        const data = await getBillsMonthValue();
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
                        title="Valor Mensáis De Boletos"
                        subTitle="Veja o total de boletos mensáis da Adega"/>

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
                <div id="month-justify-place">
                    <div id="month-sells-background">
                        <div id="month-title-content">
                            <h1>Boletos e seus totais mensais</h1>
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
                <div id="button-master">
                    <div id="button-justify">
                        <Button title="Deletar Valor Do Mês Desejado" onClick={handleClarValues}/>
                    {/* <DeleteModal
                        description="Tem certeza que deseja deletar este usuário? Ao fazer isto, ele não terá mais acesso ao sistema!"
                        title={`${selectUser?.username}`}
                        open={isOpenModal}
                        setOpen={setOpenModal}
                        onDelete={() => selectUser && selectUser.idUsuario && delUser(selectUser?.idUsuario)}
                    /> */}
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

export default monthlyBills