import { Liquor, AddCircleOutline, Logout, People, Assessment, AccountBalance, Savings, PersonAddAlt, Pix,  } from '@mui/icons-material'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import { useLocation, useNavigate } from 'react-router-dom';
import CelebrationIcon from '@mui/icons-material/Celebration';
import AdfScannerIcon from '@mui/icons-material/AdfScanner';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import HomeIcon from '@mui/icons-material/Home';

import './style.sass';
import { useUser } from '../../UserContext';

const SideBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useUser();

    const homePage = () => {
      navigate("/")
    }

    const logout = () => {
        localStorage.removeItem("token");
        navigate('/login');
    }

    return (
        <aside id='side-bar'>
            <h1 id='backMenu' onClick={homePage}>Páginas</h1>
            <h4 id='menu'>Menu</h4>
            <ul>
                  <li onClick={() => navigate('/')} id={`${location.pathname === '/' ? 'select-side-bar' : ''}`}>
                    <HomeIcon /> 
                    Home Page
                </li>  
                <li onClick={() => navigate('/product-list')} id={`${location.pathname === '/product-list' ? 'select-side-bar' : ''}`}>
                    <Liquor /> 
                    Lista de produtos
                </li>

                {user?.is_admin &&(
                    <>
                       
                        <li onClick={() => navigate('/general-vision')} id={`${location.pathname === '/general-vision' ? 'select-side-bar' : ''}`}>
                              <Assessment /> 
                              Visão Geral
                        </li>
                        <li onClick={() => navigate('/product-form')} id={`${location.pathname.indexOf('/product-form') !== -1 ? 'select-side-bar' : ''}`}> 
                              <AddCircleOutline/>
                              Cadastro de produto
                        </li>
                        <li onClick={() => navigate('/spun')} id={`${location.pathname === '/spun' ? 'select-side-bar' : ''}`}>
                              <Pix /> 
                              Fiado 
                        </li>
                        <li onClick={() => navigate('/daily-sells')} id={`${location.pathname === '/daily-sells' ? 'select-side-bar' : ''}`}>
                              <Savings /> 
                              Vendas Diárias
                        </li>
                        <li onClick={() => navigate('/monthly-sells')} id={`${location.pathname === '/monthly-sells' ? 'select-side-bar' : ''}`}>
                              <PointOfSaleIcon/> 
                              Registro Mensal
                        </li>
                        <li onClick={() => navigate('/bills')} id={`${location.pathname === '/bills' ? 'select-side-bar' : ''}`}>
                              <AccountBalanceWalletIcon /> 
                              Boletos  
                        </li>
                        <li onClick={() => navigate('/monthly-bills')} id={`${location.pathname === '/monthly-bills' ? 'select-side-bar' : ''}`}>
                              <AccountBalance/> 
                              Total Boletos Mensal
                        </li>
                        <li onClick={() => navigate('/expenses')} id={`${location.pathname === '/expenses' ? 'select-side-bar' : ''}`}>
                              <CelebrationIcon/> 
                              Gastos Aleatórios
                        </li>
                        <li onClick={() => navigate('/monthly-expenses')} id={`${location.pathname === '/monthly-expenses' ? 'select-side-bar' : ''}`}>
                              <AdfScannerIcon/> 
                              Gastos Aleatórios Mensal
                        </li>
                        <li onClick={() => navigate('/expenses-card')} id={`${location.pathname === '/expenses-card' ? 'select-side-bar' : ''}`}>
                              <CreditCardIcon/> 
                              Dividas Cartão
                        </li>
                        <li onClick={() => navigate('/expenses-card-monthly')} id={`${location.pathname === '/expenses-card-monthly' ? 'select-side-bar' : ''}`}>
                              <RequestQuoteIcon/> 
                              Dividas Cartão Mensal
                        </li>
                        <li onClick={() => navigate('/user-form')} id={`${location.pathname.indexOf('/user-form') !== -1 ? 'select-side-bar' : ''}`}> 
                              <PersonAddAlt/>
                               Cadastro de usuário
                        </li>
                        <li onClick={() => navigate('/user-list')} id={`${location.pathname === '/user-list' ? 'select-side-bar' : ''}`}> 
                               <People/>
                               Lista de usuários
                        </li>
                        <li onClick={logout}>
                              <Logout/>
                              Sair
                        </li>
                    </>
                )}
            </ul>
           
        </aside>
    );
}

export default SideBar;