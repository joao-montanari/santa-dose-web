import Button from "@Components/Button";
import Loading from "@Components/Loading";
import Menu, { OptionMenuType } from "@Components/Menu";
import { NotificationType } from "@Components/Notification";
import Notification from "@Components/Notification"
import TableSales from "@Components/TableSales";
import Title from "@Components/Title";
import { AccountBox, AccountCircle, LockReset, Logout } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Spun = () => { 
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

    const handleTotalChange = (total : number) =>{
        if(product.tipo) {
            setMonthsTotal((prev) => ({
                ...prev,
                [product.tipo] : total
            }));
            console.log("Valor variavel monthsTotal: ", monthsTotal)
            console.log("Valor da variável produto", setProduct)
            console.log("vendo a variavel", setLoading)
        }
    }

    return(
        <div id="product-list-main">
            <div id="product-list-header">
                <Title
                title='Fiado'
                subTitle='Veja os valores fiados e os devedores da Adega Santa Dose'
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
                title="Fiado"
                dayColumnTitle="Quantidade Devedores"
                salesColumTitle="Dívida"
                totalLabel="Total Do Mês"
                daysInMonth={50}
                onTotalChange={handleTotalChange}
                titleNamesSpun="Nome Devedores"
            />

            <div id="buttons-align">
                <div id="buttons-justify">
                    <Button title="Salvar Os Valores Fiados" ></Button>
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