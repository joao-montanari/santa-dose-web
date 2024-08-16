import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Title from "@Components/Title";
import Input from "@Components/Input";
import SelectOption from '@Components/SelectOption';
import SelectNumber from "@Components/SelectNumber";
import Notification, { NotificationType } from "@Components/Notification";
import Loading from "@Components/Loading";
import InputWithSelect from "@Components/InputWithSelect";

import { category_select, unit_of_measure_select } from "@Utils/selects.const";
import { Product } from "@Models/product";
import { getProduct, createProduct, updateProduct } from '@Api/services/products';

import './style.sass';

const ProductForm = () => { 
    const { id } = useParams();
    const navigate = useNavigate();

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
        tipo: '',
        valor: 0,
        data_cadastro: null,
        data_validade: '',
        tamanho: '',
    });

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
                setTimeout(() => setNote(prevState => ({
                    ...prevState,
                    show: false,
                })), 3000);
            } else {
                setProduct({
                    ...data[1],
                    data_validade: formatDateFromApi(data[1].data_validade)
                });
            }
            setLoading(false);
        }
    }

    const formatDateFromApi = (date : string) => {
        let dateParts : string[] = date.split("/");
        return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    }

    const formatDateToApi = (date : string) => {
        let dateParts : string[] = date.split("-");
        return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    }

    async function handleSubmit() {
        if(
            product.data_validade !== ""
            && product.nome !== ""
            && product.quantidade > 0
            && product.tamanho !== ""
            && product.tipo !== ""
            && product.valor > 0
        ) {
            setLoading(true);
            const submitProduct : Product = {
                ...product,
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
                    setTimeout(() => setNote(prevState => ({
                        ...prevState,
                        show: false,
                    })), 3000);
                } else {
                    localStorage.setItem("product-operation", "Produto atualizado!");
                    navigate("/product-list");
                }
            } else {
                const respCreate = await createProduct(submitProduct);
                if(respCreate.error) {
                    setNote({
                        message: `${respCreate.response.response.data.detail}`,
                        show: true,
                        type: "error"
                    });
                    setTimeout(() => setNote(prevState => ({
                        ...prevState,
                        show: false,
                    })), 3000);
                } else {
                    localStorage.setItem("product-operation", "Produto criado!");
                    navigate("/product-list");
                }
            }
            setLoading(false);
        } else {
            setNote({
                message: "Preencha os campos corretamente",
                show: true,
                type: "warning"
            });
            setTimeout(() => setNote(prevState => ({
                ...prevState,
                show: false
            })), 3000);
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
            </div>
            <form id='product-form-content' onSubmit={handleSubmit}>
                <div id='product-form-container'>
                    <Input
                        title="Nome"
                        value={product.nome}
                        setValue={(value : string) => changeProduct('nome', value)}
                        width="45%"
                    />
                    <InputWithSelect
                        title="Volume"
                        value={{ label: product.tamanho, value: product.tamanho }}
                        setValue={(value : string) => changeProduct('tamanho', value)}
                        width="45%"
                        options={unit_of_measure_select}
                        type="number"
                    />
                </div>
                <div id='product-form-container'>
                    <Input
                        title="Data de validade"
                        value={product.data_validade}
                        setValue={(value : string) => changeProduct('data_validade', value)}
                        width="45%"
                        type="date"
                    />
                    <Input
                        title="Preço"
                        value={product.valor}
                        setValue={(value : number) => changeProduct('valor', value)}
                        width="45%"
                        type="number"
                    />
                </div>
                <div id='product-form-container'>
                    <SelectNumber
                        width="45%"
                        title="Quantidade"
                        value={product.quantidade}
                        setValue={(value : string | number) => changeProduct('quantidade', value)}
                    />
                    <SelectOption
                        title="Categoria"
                        value={{ value: product.tipo, label: product.tipo }}
                        setValue={(value : string | number) => changeProduct('tipo', value)}
                        selectList={category_select}
                        width="45%"
                    />
                </div>
                <button type="submit">
                    Salvar
                </button>
            </form>
            {
                loading && <Loading/>
            }
            <Notification note={note}/>
        </div>
    );
}

export default ProductForm;