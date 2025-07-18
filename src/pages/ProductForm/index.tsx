import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LockReset, Logout, AccountBox } from '@mui/icons-material';

import Title from "@Components/Title";
import Input from "@Components/Input";
import SelectOption from '@Components/SelectOption';
import SelectNumber from "@Components/SelectNumber";
import Menu, { OptionMenuType } from '@Components/Menu';
import Notification, { NotificationType } from "@Components/Notification";
import Loading from "@Components/Loading";

import { category_select, unit_of_measure_select } from "@Utils/selects.const";
import { Product } from "@Models/product";
import { getProduct, createProduct, updateProduct } from '@Api/services/products';

import './style.sass';
import { OptionSelect } from "@Utils/optionSelect";
import getPhotoUser from "@Api/services/getPhotoUser";

const ProductForm = () => { 
    const { id } = useParams();
    const navigate = useNavigate();
    const [volume, setVolume] = useState<number>(0);

    const [loading, setLoading] = useState(false);
    const [note, setNote] = useState<NotificationType>({
        message: "",
        show: false,
        type: "success"
    });
    const [product, setProduct] = useState<Product>({
        idProduto: null,
        nome: '',
        quantidade: 1,
        // quantidadeUn: 0,
        tipo: '',
        valor_compra: 0,
        valor_venda: 0,
        data_cadastro: null,
        data_validade: '',
        tamanho: '',
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

    async function getSelectProduct() {
        if(id) {
            setLoading(true);
            const data = await getProduct(parseInt(id));
            
            if (data.error) {
                setNote({
                    message: `${data.response.response.data.detail}`,
                    show: true,
                    type: "error"
                });
            } else {
                const volumeFromBackEnd = parseInt(data[1].tamanho);
                const unidadeFromBackEnd = data[1].tamanho.replace(/[0-9]/g, '');

                setVolume(volumeFromBackEnd)

                setProduct({
                    ...data[1],
                    tamanho: unidadeFromBackEnd,
                    data_validade: formatDateFromApi(data[1].data_validade)
                });
            }
            setLoading(false);
        }
    }

    const formatDateFromApi = (date : string) => {
        const dateParts: string[] = date.split("/");
        return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    }

    const formatDateToApi = (date : string) => {
        const dateParts: string[] = date.split("-");
        return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    }

    async function handleSubmit() {
        if(
            product.data_validade !== ""
            && product.nome !== ""
            && product.quantidade > 0
            // && product.quantidadeUn
            && product.tamanho !== ""
            && product.tipo !== ""
            && product.valor_compra > 0
            && product.valor_venda !== undefined
        ) {
            setLoading(true);
            const submitProduct : Product = {
                ...product,
                tamanho: `${volume}${product.tamanho}`, //juntando tamanho e unidade
                data_validade: formatDateToApi(product.data_validade),
            }
            if(product.idProduto) {
                const respUpdate = await updateProduct(submitProduct);
                if(respUpdate.error) {
                    setNote({
                        message: `${respUpdate.response.response.data.detail}`,
                        show: true,
                        type: "error"
                    });
                } else {
                    setNote({
                        message: "O produto foi atualizado com sucesso!",
                        show: true,
                        type: "success"
                    });
                    setTimeout(() =>{
                        navigate("/product-list");
                    }, 1500)
                }
            } else {
                const respCreate = await createProduct(submitProduct);
                console.log("vendo os valores que estão sendo passados: ", submitProduct)
                if(respCreate.error) {
                    setNote({
                        message: `${respCreate.response.response.data.detail}`,
                        show: true,
                        type: "error"
                    });
                } else {
                    setNote({
                        message: "O produto foi criado com sucesso!",
                        show: true,
                        type: "success"
                    });
                    setTimeout(() =>{
                        navigate("/product-list");
                    }, 1500)
                }
            }
            setLoading(false);
        } else {
            setNote({
                message: "Preencha os campos corretamente",
                show: true,
                type: "warning"
            });
        }
    }

    useEffect(() => {
       getSelectProduct();
    }, []);    

    return(
        <div id='product-form-page-main'>
            <div id='product-form-header'>
                <Title
                    title="Cadastro de produto"
                    subTitle="Cadastre ou edite um produto no sistema preenchendo o formulário"
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
            <form id='product-form-content' onSubmit={handleSubmit}>
                    <>
                        <div id="product-form-container">
                            <Input
                                title="Nome"
                                value={product.nome}
                                setValue={(value : string) => changeProduct('nome', value)}
                                width="45%"
                            />
                            <Input title="Volume" value={volume} setValue={(value : number) => setVolume(value)} width="22%" type="number"/>
                            <SelectOption
                                title="Unidade"
                                value={{ label: product.tamanho.replace(/[0-9]/g, ''), value: product.tamanho.replace(/[0-9]/g, '') }}
                                setValue={(value: OptionSelect) => changeProduct('tamanho', value.value)}
                                selectList={unit_of_measure_select}
                                width="22%"
                            />
                        </div>
                        <div id='product-form-container'>
                            <Input
                                title="Data de validade"
                                value={product.data_validade}
                                setValue={(value: string) => changeProduct('data_validade', value)}
                                width="30%"
                                type="date" />
                            <Input
                                title="Preço Compra"
                                value={product.valor_compra}
                                setValue={(value: number) => changeProduct('valor_compra', value)}
                                width="30%"
                                type="number" />
                            <Input
                                title="Preço Venda"
                                value={product.valor_venda ? product.valor_venda : 0}
                                setValue={(value: number) => changeProduct('valor_venda', value)}
                                width="30%"
                                type="number" />
                        </div>
                        <div id='product-form-container'>
                                <SelectNumber
                                    width="45%"
                                    title="Quantidade"
                                    value={product.quantidade}
                                    setValue={(value: string | number) => changeProduct('quantidade', value)} />
                                {/* {product.tipo === "Fardos" &&(
                                    <SelectNumber
                                        width="30%"
                                        title="Quantidade Fardos"
                                        value={product.quantidadeUn}
                                        setValue={(value: string | number) => changeProduct('quantidadeUn', value)} />
                                )} */}
                                <SelectOption
                                    title="Categoria"
                                    value={{ value: product.tipo, label: product.tipo }}
                                    setValue={(value: OptionSelect) => changeProduct('tipo', value.value)}
                                    selectList={category_select}
                                    width="45%" />
                        </div>
                    </>
                <button type="submit">
                    Salvar
                </button>
            </form>
            {
                loading && <Loading/>
            }
            <Notification 
                note={note}
                setNote={setNote}
            />
        </div>
    );
}

export default ProductForm;