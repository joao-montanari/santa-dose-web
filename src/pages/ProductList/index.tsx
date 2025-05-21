import React, { useState, useEffect } from 'react';
import { Clear, LockReset, Logout, AccountBox, AccountCircle, Edit } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";

import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import ButtonValue from '@Components/ButtonValue';
import Title from '@Components/Title';
import Table from '@Components/Table';
import Search from '@Components/Search';
import DeleteModal from '@Components/DeleteModal';
import Loading from '@Components/Loading';
import Menu, { OptionMenuType } from '@Components/Menu';
import Notification, { NotificationType } from '@Components/Notification';

import { listProducts, deleteProduct, getProductByName, updateProduct } from '@Api/services/products';
import { Product } from '@Models/product';

import { exportExcelProduct } from '@Utils/exportExcel';
import formatPercent from '@Utils/formatPercent'

import './style.sass';
import { useUser } from '../../UserContext';
import SalesModal from '@Components/SalesModal';
import AddModal from '@Components/AddModal';
import CartsideBar from '@Components/CartSideBar';

import Eric from "../../assets/Eric.jpg"

const HomePage = () => {
  const navigate = useNavigate();

  const [showAllButtons, setShowAllButtons] = useState(true)

  const [showButtonsCerveja, setShowButtonsCerveja] = useState(false)
  const [showButtonsAlcoólicos, setShowButtonsAlcoólicos] = useState(false)
  const [showButtonsNaoAlcoólicos, setShowButtonsNaoAlcoólicos] = useState(false)

  const [showButtonsCopao, setShowButtonsCopao] = useState(false)
  const [showButtonsCopaoOptions, setShowButtonsCopaoOptions] = useState(false)
  const [showButtonsCopaoOptionWhisky, setShowButtonsCopaoOptionWhisky] = useState(false)
  const [showButtonsCopaoOptionGin, setShowButtonsCopaoOptionGin] = useState(false)
  const [showButtonsCopaoOptionVodka, setShowButtonsCopaoOptionVodka] = useState(false)

  const [showButtonsCombo, setShowButtonsCombo] = useState(false)
  const [showButtonsComboOptions, setShowButtonsComboOptions] = useState(false)

  const [showButtonsRefrigerante, setShowButtonsRefrigerante] = useState(false)
  const [showButtonsBebidasQuente, setShowButtonsBebidasQuentes] = useState(false)
  const [showButtonsEnergeticos, setShowButtonsEnergeticos] = useState(false)
  const [showButtonsTabacaria, setShowButtonsTabacaria] = useState(false)
  const [showButtonsSalgadinhos, setShowButtonsSalgadinhos] = useState(false)
  const [showButtonsCarvaoGeloDrinksP, setShowButtonsCarvaoGeloDrinksP] = useState(false)
  const [showButtonsDoces, setShowButtonsDoces] = useState(false)

  const [search, setSearch] = useState<string>('');
  const [startPage, setStartPage] = useState<number>(0);
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const [isOpenModalAdd, setOpenModalAdd] = useState<boolean>(false);

  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [isOpenModalSales, setOpenModalSales] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [note, setNote] = useState<NotificationType>({
    message: "",
    show: false,
    type: "info"
  });

  const [results, setResults] = useState<Product[]>();
  const [productList, setProductList] = useState<Product[]>([]);
  const [dataProduct, setDataProduct] = useState<Product[]>([]);

  const [currentCategory, setCurrentCategory] = useState<string | null>(null);

  const { user } = useUser();

  const handleVoltar = (setButtons : React.Dispatch<React.SetStateAction<boolean>>) => {
    setButtons(false) 
    setDataProduct([]);
    setShowAllButtons(true)
  }

  const logout = () => {
    localStorage.removeItem("token");
    navigate('/login');
}

  const handleAllButtonsValue = (button : string) =>{
      setCurrentCategory(button) //salvando a categoria atual dos botões  
      setShowAllButtons(false)
      console.log(showButtonsCopaoOptions)
      console.log(showButtonsComboOptions)
      
      const buttonActions: Record<string, () => void> = {
          "Cerveja": () => setShowButtonsCerveja(true),
          "Cervejas Alcoólicas": () => { 
            setShowButtonsCerveja(false);
            setShowButtonsAlcoólicos(true)
          },
          "Cervejas Não Alcoólicas": () =>{
            setShowButtonsCerveja(false);
            setShowButtonsNaoAlcoólicos(true)
          },
          "VoltarCervejasAlcoolicas": () => {
            setShowButtonsCerveja(true);
            setShowButtonsAlcoólicos(false)
          },
          "VoltarCervejasNaoAlcoolicas": () => {
            setShowButtonsCerveja(true);
            setShowButtonsNaoAlcoólicos(false)
          },

          "Refrigerante": () => setShowButtonsRefrigerante(true),
          "Bebidas Quentes": () => setShowButtonsBebidasQuentes(true),
          "Copao": () => setShowButtonsCopao(true),

          "Copao Whisky": () => {
            setShowButtonsCopao(false)
            setShowButtonsCopaoOptionWhisky(true)
          },
          "Copao Gin": () => {
            setShowButtonsCopao(false)
            setShowButtonsCopaoOptionGin(true)
          }, 
          "Copao Vodka": () =>{
            setShowButtonsCopao(false)
            setShowButtonsCopaoOptionVodka(true)
          },
          "CopaoVoltarOpcoes": () =>{
            setShowButtonsCopao(true)
            setShowButtonsCopaoOptions(false)
          },
            "VoltarOpcoesCopao": () => {
              setShowButtonsCopao(true)
              setShowButtonsCopaoOptionWhisky(false)
              setShowButtonsCopaoOptionGin(false)
              setShowButtonsCopaoOptionVodka(false)
          },

          "Combo Vodka": () => {
            setShowButtonsCombo(false)
            setShowButtonsComboOptions(true)
          },
          "Combo Gim": () => {
            setShowButtonsCombo(false)
            setShowButtonsComboOptions(true)
          },
          "Combo Whisky": () => {
            setShowButtonsCombo(false)
            setShowButtonsComboOptions(true)
          },
          "ComboVoltarOpcoes": () => {
            setShowButtonsCombo(true)
            setShowButtonsComboOptions(false)
          },
          "Combo": () => {
            setShowButtonsCombo(true)
          },
          "Energéticos": () => {
            setShowButtonsEnergeticos(true)
          },
          "Tabacaria": () => {
            setShowButtonsTabacaria(true)
          },
          "Salgadinhos": () => {
            setShowButtonsSalgadinhos(true)
          },
          "Doces": () => {
            setShowButtonsDoces(true)
          },
          "Carvão": () => {
            setShowButtonsCarvaoGeloDrinksP(true)
            getProductsBySpecific("Carvao");
          },
          "Gelo": () => {
            setShowButtonsCarvaoGeloDrinksP(true)
            getProductsBySpecific("Gelo");
          },
          "Drinks Prontos": () => {
            setShowButtonsCarvaoGeloDrinksP(true)
            getProductsBySpecific("Drinks Prontos");
          },
          "Doses": () => {
            setShowButtonsCarvaoGeloDrinksP(true)
            getProductsBySpecific("Doses");
          },

          
      };

        if (buttonActions[button]) {
            buttonActions[button]();
        } else {
        // Ação padrão caso o botão não esteja no mapeamento
            setDataProduct([]);
            getProductsBySpecific(button);
    }
      console.log("Valor", button)
  }

  const setRangeList = (start : number, amount : number) => {
    const rangeList: Product[] = [];
    const dataBase = search && results ? results : dataProduct;

    if (start < dataBase.length && start >= 0) {
      for (let index = 0; index < amount; index++) {
        if (start + index < dataBase.length) {
          const product = dataBase[start + index];
          rangeList.push(product);
        }
      }
      setStartPage(start);
      setProductList(rangeList);
    }
  }

  async function handleAddProduct(quantidadeAdd: number) {
    if(
      selectedProduct
      && selectedProduct?.quantidade !== undefined
    ) {
      const novaQuantidade = selectedProduct.quantidade + quantidadeAdd
      console.log("vendo se atualizou o valor2: ", novaQuantidade)
      
      if(novaQuantidade < 0){
        setNote({
          message: "Quantidade insuficiente no estoque!",
          show: true,
          type: "warning"
        })
      }

      const submitProduct : Product = {
        idProduto: selectedProduct.idProduto,
        nome: selectedProduct.nome,
        tamanho: selectedProduct.tamanho,
        tipo: selectedProduct.tipo,
        valor_compra: selectedProduct.valor_compra,
        valor_venda: selectedProduct.valor_venda,
        quantidade: novaQuantidade,
        data_validade: selectedProduct.data_validade,
      }
      setLoading(true);
      if(selectedProduct.idProduto){
        const respUpdate = await updateProduct(submitProduct)
        if(respUpdate.error){
          setNote({
            message: `${respUpdate.response.response.data.detail}`,
            show: true,
            type: "error"
          });
        } else { 
          localStorage.setItem("product-operation", "Produto vendido!");
          setOpenModalSales(false)
          if(currentCategory){
            handleAllButtonsValue(currentCategory)
          }
        }
      }
      setLoading(false)
    } else {
      setNote({
        message: "Preencha os campos corretamente",
        show: true,
        type: "warning"
      });
    }

  }

  async function delProduct(id : number) {
    setLoading(true);
    const deleteResponse = await deleteProduct(id);
    setOpenModal(false);

    if (deleteResponse.error) {
      setNote({
        show: true,
        message: `${deleteResponse.response.response.data.detail}`,
        type: "error"
      });
    } else {
      getProducts();
    }

    setLoading(false);
  }

  async function getProductsBySpecific(value : string) {
    setLoading(true);
    const data = await getProductByName(value);
    console.log("Resposta da API (getByName):", data);

    if (data.error) {
      if(data.response.response.status === 401) navigate("/login");

      setNote({
        show: true,
        message: `${data.response.response.data.detail}`,
        type: "error"
      });
    }else {
      console.log("Dados que estão sendo pegos: ", data[1])
      setDataProduct(data[1]);
    }

    setLoading(false);
    console.log("Valor para pegar no banco: ", value)
  }
  async function getProducts( ) {
    setLoading(true);
    const data = await listProducts();

    if (data.error) {
      if(data.response.response.status === 401) navigate("/login");

      setNote({
        show: true,
        message: `${data.response.response.data.detail}`,
        type: "error"
      });

    } else {
      setDataProduct(data[1]);
    }

    setLoading(false);
  }

  useEffect(() => {
    if(!search) {
      setResults(dataProduct);
    } else {
      const searchResult : Product[] = dataProduct.filter((element) => 
        element.nome.toLowerCase().indexOf(search.toLowerCase()) != -1 ||
        element.data_validade.toLowerCase().indexOf(search.toLowerCase()) != -1 ||
        element.valor_compra.toString().indexOf(search.toLowerCase()) != -1 ||
        element.quantidade.toString().indexOf(search.toLowerCase()) != -1
      );
      setResults(searchResult);
    }
  }, [search]);

  useEffect(() => {
    setRangeList(0, 10);
  }, [results]);

  useEffect(() => {
    setProductList(dataProduct);
    setRangeList(0, 10);
  }, [dataProduct]);

  useEffect(() => {
    // getProducts();
    
    if(localStorage.getItem("product-operation")) {
      setNote({
        show: true,
        message: `${localStorage.getItem("product-operation")}`,
        type: "success"
      });
      localStorage.removeItem("product-operation");
    }
  }, []);

  return (
    <>
      <div id="product-list-main" >
        <div id='product-list-header' >
        <Title
          title='Lista de produtos'
          subTitle='Veja a lista de produtos cadastrados no sistema'
        />
        <div id='product-list-header-content'>
          <Search
            placeholder='Pesquise por um produto'
            value={search}
            setValue={setSearch}
          />
          <Menu
            icon={<img src={Eric} style={{ width:"35px", borderRadius: "40px", color: "#9A9494", cursor: "pointer"}}/>}
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
      </div>
        
        <div id='product-list-title'>
            <div id='product-list-title-space'>
                <h1>Selecione a categoria para aparecer os produtos</h1>
            </div>
            <div id='product-list-button'>
                {showAllButtons && (
                  <>
                    <ButtonValue title='Doses' valueClick="Doses" onClick={() => handleAllButtonsValue("Doses")}/>
                    <ButtonValue title='Cerveja' valueClick="Cerveja" onClick={() => handleAllButtonsValue("Cerveja")}/>
                    <ButtonValue title='Bebidas Quentes' valueClick="Bebidas Quentes" onClick={() => handleAllButtonsValue("Bebidas Quentes")}/>
                    <ButtonValue title='Copão' valueClick="Copao" onClick={() => handleAllButtonsValue("Copao")}/>
                    <ButtonValue title='Drinks Prontos' valueClick="Drinks Prontos" onClick={() => handleAllButtonsValue("Drinks Prontos")}/>
                    <ButtonValue title='Combo' valueClick="Combo" onClick={() => handleAllButtonsValue("Combo")}/>
                    <ButtonValue title='Refrigerante' valueClick="Refrigerante" onClick={() => handleAllButtonsValue("Refrigerante")}/>
                    <ButtonValue title='Energéticos' valueClick="Energéticos" onClick={() => handleAllButtonsValue("Energéticos")}/>
                    <ButtonValue title='Tabacaria' valueClick="Tabacaria" onClick={() => handleAllButtonsValue("Tabacaria")}/>
                    <ButtonValue title='Carvão' valueClick="Carvão" onClick={() => handleAllButtonsValue("Carvão")}/>
                    <ButtonValue title='Gelo' valueClick="Gelo" onClick={() => handleAllButtonsValue("Gelo")}/>
                    <ButtonValue title='Salgadinhos' valueClick="Salgadinhos" onClick={() => handleAllButtonsValue("Salgadinhos")}/>
                    <ButtonValue title='Doces' valueClick="Doces" onClick={() => handleAllButtonsValue("Doces")}/>
                  </>
                )}

                {showButtonsCerveja &&(
                  <>
                    <ButtonValue title='Cervejas Alcoólicas' valueClick="Cervejas Alcoólicas" onClick={() => handleAllButtonsValue("Cervejas Alcoólicas")}/>
                    <ButtonValue title='Cervejas Não Alcoólicas' valueClick="Cervejas Não Alcoólicas" onClick={() => handleAllButtonsValue("Cervejas Não Alcoólicas")}/>
                    <ButtonValue title='Voltar' valueClick="Voltar" onClick={() => handleVoltar(setShowButtonsCerveja)}/>
                  </>
                )}

                {showButtonsAlcoólicos &&(
                  <>
                    <ButtonValue title='Barrigudinhas' valueClick="Barrigudinhas" onClick={() => handleAllButtonsValue("Barrigudinhas")}/>
                    <ButtonValue title='Cerveja 269ml' valueClick="Cerveja 269mla" onClick={() => handleAllButtonsValue("Cerveja 269mla")}/>
                    <ButtonValue title='Cerveja Long Neck 330ml' valueClick="Cerveja Long Neck 330mla" onClick={() => handleAllButtonsValue("Cerveja long neck 330mla")}/>
                    <ButtonValue title='Cerveja 350ml' valueClick="Cerveja 350mla" onClick={() => handleAllButtonsValue("Cerveja 350mla")}/>
                    <ButtonValue title='Cerveja Tubão' valueClick="Cerveja tubaoa" onClick={() => handleAllButtonsValue("Cerveja tubaoa")}/>
                    <ButtonValue title='Cerveja 600ml' valueClick="Cerveja 600mla" onClick={() => handleAllButtonsValue("Cerveja 600mla")}/>
                    {/* <ButtonValue title='Voltar' valueClick="Voltar" onClick={() => handleVoltar(setShowButtonsAlcoólicos)}/> */}
                    <ButtonValue title='Voltar' valueClick="Voltar" onClick={() => handleAllButtonsValue("VoltarCervejasAlcoolicas")}/>
                  </>
                )}

                {showButtonsNaoAlcoólicos &&(
                  <>
                    <ButtonValue title='Cerveja 269ml' valueClick="Cerveja 269ml" onClick={() => handleAllButtonsValue("Cerveja 269mlna")}/>
                    <ButtonValue title='Cerveja Long Neck 330ml' valueClick="Cerveja Long Neck 330ml" onClick={() => handleAllButtonsValue("Cerveja long neck 330mlna")}/>
                    <ButtonValue title='Cerveja 350ml' valueClick="Cerveja 350ml" onClick={() => handleAllButtonsValue("Cerveja 350mlna")}/>
                    <ButtonValue title='Cerveja Tubão' valueClick="Cerveja Tubão" onClick={() => handleAllButtonsValue("Cerveja tubaona")}/>
                    <ButtonValue title='Cerveja 600ml' valueClick="Cerveja 600ml" onClick={() => handleAllButtonsValue("Cerveja 600mlna")}/>
                    {/* <ButtonValue title='Voltar' valueClick="Voltar" onClick={() => handleVoltar(setShowButtonsAlcoólicos)}/> */}
                    <ButtonValue title='Voltar' valueClick="Voltar" onClick={() => handleAllButtonsValue("VoltarCervejasNaoAlcoolicas")}/>
                  </>
                )}

                {showButtonsCopao &&(
                  <>
                    <ButtonValue title='Whisky' valueClick="Copao Whisky" onClick={() => handleAllButtonsValue("Copao Whisky")}/>
                    <ButtonValue title='Gin' valueClick="Copao Gin" onClick={() => handleAllButtonsValue("Copao Gin")}/>
                    <ButtonValue title='Vodka' valueClick="Copao Vodka" onClick={() => handleAllButtonsValue("Copao Vodka")}/>
                    <ButtonValue title='Voltar' valueClick="Copao Voltar" onClick={() => handleVoltar(setShowButtonsCopao)}/>
                  </>
                )}

                {/* Arrumar aqui, se pá vai ter que fazer um botão para cada tipo, whisky, gim e vodka */}

                {showButtonsCopaoOptionWhisky&&(
                  <>
                    <ButtonValue title='Energético 2L' valueClick="Energetico2LC" onClick={() => handleAllButtonsValue("Whiskyc2l")}/>
                    <ButtonValue title='Monster/RedBull (Lata)' valueClick="MonsterC" onClick={() => handleAllButtonsValue("Whiskycel")}/>
                    <ButtonValue title='Voltar' valueClick="Copao Voltar" onClick={() => handleAllButtonsValue("VoltarOpcoesCopao")}/>
                  </>
                )}

                {showButtonsCopaoOptionGin&&(
                  <>
                    <ButtonValue title='Energético 2L' valueClick="Energetico2LC" onClick={() => handleAllButtonsValue("Ginc2l")}/>
                    <ButtonValue title='Monster/RedBull (Lata)' valueClick="MonsterC" onClick={() => handleAllButtonsValue("Gincel")}/>
                    <ButtonValue title='Voltar' valueClick="Copao Voltar" onClick={() => handleAllButtonsValue("VoltarOpcoesCopao")}/>
                  </>
                )}

                {showButtonsCopaoOptionVodka&&(
                  <>
                    <ButtonValue title='Energético 2L' valueClick="Energetico2LC" onClick={() => handleAllButtonsValue("Vodkac2l")}/>
                    <ButtonValue title='Monster/RedBull (Lata)' valueClick="MonsterC" onClick={() => handleAllButtonsValue("Vodkacel")}/>
                    <ButtonValue title='Voltar' valueClick="Copao Voltar" onClick={() => handleAllButtonsValue("VoltarOpcoesCopao")}/>
                  </>
                )}

                {showButtonsCombo &&(
                  <>
                  <ButtonValue title='Whisky' valueClick="Combo Whisky" onClick={() => handleAllButtonsValue("Combo whisky")}/>
                  <ButtonValue title='Gin' valueClick="Combo Gin" onClick={() => handleAllButtonsValue("Combo gin")}/>
                    <ButtonValue title='Vodka' valueClick="Combo Vodka" onClick={() => handleAllButtonsValue("Combo vodka")}/>
                    <ButtonValue title='Voltar' valueClick="Combo Voltar" onClick={() => handleVoltar(setShowButtonsCombo)}/>
                  </>
                )}

                {/* {showButtonsComboOptions && (
                  <>
                    <ButtonValue title='Energético 2L' valueClick="Energetico2LC" onClick={() => handleAllButtonsValue("Energetico2LCombo")}/>
                    <ButtonValue title='Monster/RedBull (Lata)' valueClick="MonsterR" onClick={() => handleAllButtonsValue("MonsterCombo")}/>
                    <ButtonValue title='Voltar' valueClick="Copao Voltar" onClick={() => handleAllButtonsValue("ComboVoltarOpcoes")}/>
                  </>
                )} */}

                {showButtonsRefrigerante &&(
                  <>
                    <ButtonValue title='Refrigerante Descartável 2L' valueClick="Refrigerante Descartável" onClick={() => handleAllButtonsValue("Refrigerante descartavel")}/>
                    <ButtonValue title='Refrigerante Retornável' valueClick="Refrigerante Retornável" onClick={() => handleAllButtonsValue("Refrigerante retornavel")}/>
                    <ButtonValue title='Refrigerante 1L' valueClick="Refrigerante 1L" onClick={() => handleAllButtonsValue("Refrigerante 1l")}/>
                    <ButtonValue title='Refrigerante 600ml' valueClick="Refrigerante 600ml" onClick={() => handleAllButtonsValue("Refrigerante 600ml")}/>
                    <ButtonValue title='Refrigerante 200ml' valueClick="Refrigerante 200ml" onClick={() => handleAllButtonsValue("Refrigerante 200ml")}/>
                    <ButtonValue title='Latas' valueClick="Latas" onClick={() => handleAllButtonsValue("Refrigerante lata")}/>
                    <ButtonValue title='Voltar' valueClick="Voltar" onClick={() => handleVoltar(setShowButtonsRefrigerante)}/>
                  </>
                )}

                {showButtonsBebidasQuente &&(
                  <>
                    <ButtonValue title='Whisky' valueClick="Whisky" onClick={() => handleAllButtonsValue("Whiskyg")}/>
                    <ButtonValue title='Gin' valueClick="Gin" onClick={() => handleAllButtonsValue("Ging")}/>
                    <ButtonValue title='Vodka' valueClick="Vodka" onClick={() => handleAllButtonsValue("Vodkag")}/>
                    <ButtonValue title='Cachaça' valueClick="Cachaça" onClick={() => handleAllButtonsValue("Cachacag")}/>
                    <ButtonValue title='Licor' valueClick="Licor" onClick={() => handleAllButtonsValue("Licorg")}/>
                    <ButtonValue title='Vinhos' valueClick="Vinhos" onClick={() => handleAllButtonsValue("Vinhos")}/>
                    <ButtonValue title='Voltar' valueClick="Voltar" onClick={() => handleVoltar(setShowButtonsBebidasQuentes)}/>
                  </>
                )}

                {showButtonsEnergeticos &&(
                  <>
                    <ButtonValue title='Gatorade' valueClick='Gatorade' onClick={() => handleAllButtonsValue("Gatorade")}/>
                    <ButtonValue title='Energéticos 2L' valueClick="Energéticos 2L" onClick={() => handleAllButtonsValue("Energéticos 2l")}/>
                    <ButtonValue title='Energéticos Lata 473ml' valueClick="Energéticos Lata 473ml" onClick={() => handleAllButtonsValue("Energéticos lata 473ml")}/>
                    <ButtonValue title='Energéticos Lata 269ml' valueClick="Energéticos Lata 269ml" onClick={() => handleAllButtonsValue("Energéticos lata 269ml")}/>
                    <ButtonValue title='Voltar' valueClick="Voltar" onClick={() => handleVoltar(setShowButtonsEnergeticos)}/>
                  </>
                )}

                {showButtonsTabacaria &&(
                  <>
                    <ButtonValue title='Isqueiros' valueClick='Isqueiros' onClick={() => handleAllButtonsValue("Isqueiros")}/>
                    <ButtonValue title='Cigarros' valueClick="Cigarros" onClick={() => handleAllButtonsValue("Cigarros")}/>
                    <ButtonValue title='Palheiros' valueClick="Palheiros" onClick={() => handleAllButtonsValue("Palheiros")}/>
                    <ButtonValue title='Piteira' valueClick="Piteira" onClick={() => handleAllButtonsValue("Piteira")}/>
                    <ButtonValue title='Tabaco' valueClick="Tabaco" onClick={() => handleAllButtonsValue("Tabaco")}/>
                    <ButtonValue title='Slick' valueClick="Slick" onClick={() => handleAllButtonsValue("Slick")}/>
                    <ButtonValue title='Cuia' valueClick="Cuia" onClick={() => handleAllButtonsValue("Cuia")}/>
                    <ButtonValue title='Sedas' valueClick="Sedas" onClick={() => handleAllButtonsValue("Sedas")}/>
                    <ButtonValue title='Essências' valueClick="Essencias" onClick={() => handleAllButtonsValue("Essencias")}/>
                    <ButtonValue title='Carvão' valueClick="Carvao" onClick={() => handleAllButtonsValue("Carvao narga")}/>
                    <ButtonValue title='Voltar' valueClick="Voltar" onClick={() => handleVoltar(setShowButtonsTabacaria)}/>
                  </>
                )}
                {showButtonsCarvaoGeloDrinksP &&(
                  <>
                    <ButtonValue title='Voltar' valueClick="Voltar" onClick={() => handleVoltar(setShowButtonsCarvaoGeloDrinksP)}/>
                  </>
                )}

                {showButtonsSalgadinhos &&(
                  <>
                    <ButtonValue title='Fabitos' valueClick="Fabitos" onClick={() => handleAllButtonsValue("Fabitos")}/>
                    <ButtonValue title='Batata' valueClick="Batata" onClick={() => handleAllButtonsValue("Batata")}/>
                    <ButtonValue title='Torcida' valueClick="Torcida" onClick={() => handleAllButtonsValue("Torcida")}/>
                    <ButtonValue title='Voltar' valueClick="Voltar" onClick={() => handleVoltar(setShowButtonsSalgadinhos)}/>
                  </>
                )}

                {showButtonsDoces &&(
                    <>
                      <ButtonValue title='Balas' valueClick="Balas" onClick={() => handleAllButtonsValue("Balas")}/>
                      <ButtonValue title='Chiclete' valueClick="Chiclete" onClick={() => handleAllButtonsValue("Chiclete")}/>
                      <ButtonValue title='Doces De Pote' valueClick="Doces De Pote" onClick={() => handleAllButtonsValue("Doces De Pote")}/>
                      <ButtonValue title='Chocolate' valueClick="Chocolate" onClick={() => handleAllButtonsValue("Chocolate")}/>
                      <ButtonValue title='Pirulito' valueClick="Pirulito" onClick={() => handleAllButtonsValue("Pirulito")}/>
                      <ButtonValue title='Voltar' valueClick="Voltar" onClick={() => handleVoltar(setShowButtonsDoces)}/>
                    </>
                )}
            </div>
        </div>

      <div className="table-container">
        <Table
          onNextPage={() => setRangeList(startPage + 10, 10)}
          onReturnPage={() => setRangeList(startPage - 10, 10)}
          onExportData={() => exportExcelProduct(dataProduct, "Lista de Produtos")}
          columns={[...(user?.is_admin ? ["Editar Produto"] : []),"Nome", "Validade", "Quantidade", "Valor Venda", ...(user?.is_admin ? ["% Ganho No Produto"] : []), "Vender Produto", "Adicionar Produto", "Excluir Produto" ]}//adiciona apenas se for admin 
          title="Lista de produtos"
        >
          {
            //  productList?.length > 0 && 
            productList.map((product, index) => (
              <ul key={index}>
                <li style={{ minWidth: "180px", paddingLeft: "20px", justifyContent: "center"}}>{<Edit
                    onClick={() => {
                      navigate(`/product-form/${product.idProduto}`);
                    }}
                  />}</li>
                <li style={{ width: "100%", justifyContent: "center", paddingLeft: "20px" }}>{product.nome}</li>
                <li style={{ paddingLeft: "20px", justifyContent: "center", minWidth: '180px' }}>{product.data_validade}</li>
                <li style={{ paddingLeft: "20px", justifyContent: "center", minWidth: '180px' }}>{product.quantidade}</li>
                <li style={{ paddingLeft: "20px", justifyContent: "center", minWidth: '180px' }}>{product.valor_venda}</li>
                {user?.is_admin && (
                      <li style={{ paddingLeft: "20px", justifyContent: "center", minWidth: '180px'}}>{formatPercent(product.percentual_lucro)} </li>
                )}
                <li id="product-list-options" style={{ minWidth: "180px" }} >
                  <ShoppingBasketIcon
                    onClick={() => {
                      // navigate(`/product-form/${product.idProduto}`);
                      setSelectedProduct(product)
                      setOpenModalSales(true)
                    }}
                  />
                </li>
                
                <li id="product-list-options" style={{ minWidth: "180px" }} >
                  <AddIcon
                    onClick={() => {
                      setSelectedProduct(product)
                      setOpenModalAdd(true)
                    }}
                  />
                </li>
                <li id="product-list-options" style={{ minWidth: "180px" }} >
                  <Clear 
                    onClick={() => {
                      setOpenModal(true);
                      setSelectedProduct(product);
                    }} 
                  />
                </li>
              </ul>
            ))
          }
          </Table>
        </div>
      </div>
      
        

      <DeleteModal
        description='Tem certeza que deseja deletar este item? Ao fazer isso todos os registros relacionados a ele serão deletados também!'
        title={`${selectedProduct?.nome}`}
        open={isOpenModal}
        setOpen={setOpenModal}
        onDelete={() => selectedProduct && selectedProduct.idProduto && delProduct(selectedProduct.idProduto)}
      />

      {selectedProduct && (
        <SalesModal
        product={selectedProduct}
        open={isOpenModalSales}
        description='Tem certeza que deseja vender este item? Ao fazer, será reduzido da quantidade total do produto, a quantidade vendida, alterando o estoque total do item!'
        isOpen={setOpenModalSales}
        setIsCartOpen={setIsCartOpen}
        // price={selectedProduct?.valor_venda}
        // id={selectedProduct?.idProduto}
        // quantidadeEstoque={selectedProduct?.quantidade || 0}
       />
      )}
      

      <AddModal
        titleProduct={`${selectedProduct?.nome}`}
        open={isOpenModalAdd}
        description='Tem certeza que vai adicionar mais quantidade à este produto? Ao fazer, será somado da quantidade total do produto, alterando o estoque total do item!'
        isOpen={setOpenModalAdd}
        sales={handleAddProduct}
       />
       
       {isCartOpen &&(
          <CartsideBar
            isOpen = {isCartOpen}
            onClose={() => setIsCartOpen(false)}
            setNote = {setNote}
            setLoading = {setLoading}
            currentCategory={currentCategory}
            handleAllButtonsValue={handleAllButtonsValue}
        />
        )}
      
      
      {
        loading && <Loading/>
      }
      <Notification 
        note={note}
        setNote={setNote}
      />
  </>
  )
}

export default HomePage;
