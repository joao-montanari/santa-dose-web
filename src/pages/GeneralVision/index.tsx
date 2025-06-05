import { LockReset, Logout, AccountBox } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import Title from '@Components/Title';
import Menu, { OptionMenuType } from '@Components/Menu';
import ChartLine from '@Components/charts/Line';
import ChartColumn from '@Components/charts/Column';

import './style.sass';
import { useEffect, useState } from 'react';
import { getMonthValue, getSalesAndType, getTypeAndQuantity } from '@Api/services/products';
import Notification, { NotificationType } from '@Components/Notification';
import Loading from '@Components/Loading';
import getPhotoUser from '@Api/services/getPhotoUser';
import ChartPizza from '@Components/charts/Pizza';

const GeneralVision = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [dataProduct, setDataProduct] = useState<{ month: string; value: number}[]>([])
    const [dataConsts, setDataConsts] = useState<{produto: string; quantidade: number}[]>([])
    const [data, setData] = useState<{ tipo: string; quantidade: number}[]>([])
    
    const [note, setNote] = useState<NotificationType>({
        message: "",
        show: false,
        type: "info"
      });

    const logout = () => {
        localStorage.removeItem("token");
        navigate('/login');
    }

    async function hangleGetSalesAndType(){
        try{
            setLoading(true)
            const data = await getSalesAndType()

            if(data.error){
                if(data.response.response.status === 401) navigate("/login");

                setNote({
                    show: true,
                    message: `${data.response.response.data.detail}`,
                    type: "error"
                })
            } else { 
                const vendas = data[1]
                console.log("Dadosss: ", vendas)
                //Agrupando os tipos de venda
                const contagemPorTipo: { [key: string]: number} = {};

                vendas.forEach((venda: {tipo: string}) =>{
                    const tipo = venda.tipo;
                    contagemPorTipo[tipo] = (contagemPorTipo[tipo] || 0) + 1;
                })

                //Converter para o gráfico
                const chartData = Object.entries(contagemPorTipo).map(([tipo, quantidade]) => ({
                    tipo,
                    quantidade,
                }));

                setData(chartData)
            }
        }catch (error){
            console.log("Erro ao buscar dados: ", error)
        }
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

    async function handleGetTypeAndValue() { 
        setLoading(true)
        const dataSells = await getTypeAndQuantity();

        if(dataSells.error){
            if(dataSells.response.response.status === 401) navigate("/login");

            setNote({
                show: true,
                message: `${dataSells.response.response.data.detail}`,
                type: "error"
            })
        } else {
            if(Array.isArray(dataSells) && dataSells.length > 1){
                const monthsArray = dataSells[1]
                console.log("Dados: ", monthsArray)


                if(Array.isArray(monthsArray)){
                    const produtoMap = monthsArray.reduce((acc: Record<string, number>, item: any) =>{
                        const produto = item.produto ;
                        const qnt = item.quantidade;
                        if(!acc[produto]) acc[produto] = 0;
                        acc[produto] += qnt;
                        return acc;
                    }, {});

                    const chartData = Object.entries(produtoMap).map(([produto, quantidade]) => ({
                        produto,
                        quantidade
                    }))
                    
                    setDataConsts(chartData);
                    
                }else{
                    console.log("Erro no data.response")
                }
            }else{
                console.log("Error", dataSells.response)
            }
        }
        setLoading(false)
    }

    useEffect(() =>{
        handleGetMonthProfit()
        handleGetTypeAndValue()
        hangleGetSalesAndType()
        setNote({
                show: true,
                message: "Os valores dos gráficos foram setados com sucesso!",
                type: "success"
            });
        
    }, []);
    

    return (
        <div id='overview-page-main'>
            <div id='overview-page-header'>
                <Title
                    title='Visão geral'
                    subTitle='Vaje estatísticas com relação ao seu comércio'
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


            <ChartLine
                data={dataConsts}
                title='Produtos vendidos por mês'
            />
            <ChartColumn
                data={dataProduct}
                title='Lucro obtido por mês'
            />

            <ChartPizza data={data}/>

            {loading && <Loading/>}

            <Notification 
                    note={note}
                    setNote={setNote}
            />

        </div>
    )
}

export default GeneralVision;