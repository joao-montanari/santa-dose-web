import { LockReset, Logout, AccountBox, AccountCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { dataConst } from '@Utils/chart.const';

import Title from '@Components/Title';
import Menu, { OptionMenuType } from '@Components/Menu';
import ChartLine from '@Components/charts/Line';
import ChartColumn from '@Components/charts/Column';

import './style.sass';
import { useEffect, useState } from 'react';
import { getMonthValue } from '@Api/services/products';
import Notification, { NotificationType } from '@Components/Notification';
import Loading from '@Components/Loading';

const GeneralVision = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [dataProduct, setDataProduct] = useState<{ month: string; value: number}[]>([])
    
    const [note, setNote] = useState<NotificationType>({
        message: "",
        show: false,
        type: "info"
      });

    const logout = () => {
        localStorage.removeItem("token");
        navigate('/login');
    }

    async function handleGetMonthProfit() { 
        setLoading(true)
        const data = await getMonthValue();

        if(data.error){
            if(data.response.response.status === 401) navigate("/login");

            setNote({
                show: true,
                message: `${data.response.response.data.detail}`,
                type: "error"
            })
        } else {
            if(Array.isArray(data) && data.length > 1){
                const monthsArray = data[1]
                console.log("Dados: ", monthsArray)


                if(Array.isArray(monthsArray)){
                    const monthMap = monthsArray.reduce((acc: Record<string, number>, item: any) =>{
                        acc[item.mes] = item.valor;
                        return acc;
                    }, {});

                    const chartData = Object.entries(monthMap).map(([month, value]) => ({
                        month,
                        value
                    }))

                    setDataProduct(chartData);
                    console.log("vendo como passa para a variável: ", dataProduct)
                    
                }else{
                    console.log("Erro no data.response")
                }
            }else{
                console.log("Error", data.response)
            }
        }
        setLoading(false)
    }

    useEffect(() =>{
        handleGetMonthProfit()
        if(localStorage.getItem("product-operation")) {
            setNote({
                show: true,
                message: `${localStorage.getItem("product-operation")}`,
                type: "success"
            });
            localStorage.removeItem("product-operation")
        }
    }, []);
    

    return (
        <div id='overview-page-main'>
            <div id='overview-page-header'>
                <Title
                    title='Visão geral'
                    subTitle='Vaje estatísticas com relação ao seu comércio'
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


            <ChartLine
                data={dataConst}
                title='Produtos vendidos por mês'
            />
            <ChartColumn
                data={dataProduct}
                title='Lucro obtido por mês'
            />

            {loading && <Loading/>}

            <Notification 
                    note={note}
                    setNote={setNote}
            />

        </div>
    )
}

export default GeneralVision;