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

    const isRegisters = location.pathname.startsWith("/registers");
    const isFinance = location.pathname.startsWith("/financial")
    const teste = !isRegisters && !isFinance && user?.is_admin

    return (
        <aside id='side-bar'>
            <h1 id='backMenu' onClick={homePage}>Páginas</h1>
            <h4 id='menu'>Menu</h4>
            <ul>
                  <li onClick={() => navigate('/')} id={`${location.pathname === '/' ? 'select-side-bar' : ''}`}>
                              <HomeIcon />
                              Home Page
                        </li>
                  {teste? (
                        <>
                        
                        <li onClick={() => navigate('/product-list')} id={`${location.pathname === '/product-list' ? 'select-side-bar' : ''}`}>
                              <Liquor />
                              Lista de produtos
                        </li>
                        <li onClick={() => navigate('/general-vision')} id={`${location.pathname === '/general-vision' ? 'select-side-bar' : ''}`}>
                              <Assessment />
                              Visão Geral
                        </li>
                        <li onClick={() => navigate('/registers')} id={`${location.pathname.indexOf('/registers') !== -1 ? 'select-side-bar' : ''}`}>
                              <AddCircleOutline />
                              Cadastros
                        </li>
                        <li onClick={() => navigate('/financial')} id={`${location.pathname === '/financial' ? 'select-side-bar' : ''}`}>
                              <Savings />
                              Financeiro
                        </li>
                        <li onClick={logout}>
                              <Logout />
                              Sair
                        </li>
                        </>
                  ) : (
                        null
                  )}
                    <>
                        {isRegisters? (
                              <>
                              <li onClick={() => navigate('/registers/product-form')} id={`${location.pathname.indexOf('/registers/product-form') !== -1 ? 'select-side-bar' : ''}`}>
                                    <AddCircleOutline />
                                    Cadastro de produto
                              </li>
                              <li onClick={() => navigate('/registers/user-form')} id={`${location.pathname.indexOf('/registers/user-form') !== -1 ? 'select-side-bar' : ''}`}>
                                    <PersonAddAlt />
                                    Cadastro de usuário
                              </li>
                              <li onClick={() => navigate('/registers/user-list')} id={`${location.pathname === '/registers/user-list' ? 'select-side-bar' : ''}`}>
                                    <People />
                                    Lista de usuários
                              </li>
                              </>
                        ) : (
                              null
                        )}
                        {isFinance? (
                              <>
                                    <li onClick={() => navigate('/financial/spun')} id={`${location.pathname === '/financial/spun' ? 'select-side-bar' : ''}`}>
                                          <Pix />
                                          Fiado
                                    </li>
                                    <li onClick={() => navigate('/financial/daily-sells')} id={`${location.pathname === '/financial/daily-sells' ? 'select-side-bar' : ''}`}>
                                          <Savings />
                                          Vendas Diárias
                                    </li>
                                    <li onClick={() => navigate('/financial/monthly-sells')} id={`${location.pathname === '/financial/monthly-sells' ? 'select-side-bar' : ''}`}>
                                          <PointOfSaleIcon />
                                          Registro Mensal
                                    </li>
                                    <li onClick={() => navigate('/financial/bills')} id={`${location.pathname === '/financial/bills' ? 'select-side-bar' : ''}`}>
                                          <AccountBalanceWalletIcon />
                                          Boletos
                                    </li>
                                    <li onClick={() => navigate('/financial/monthly-bills')} id={`${location.pathname === '/financial/monthly-bills' ? 'select-side-bar' : ''}`}>
                                          <AccountBalance />
                                          Total Boletos Mensal
                                    </li>
                                    <li onClick={() => navigate('/financial/expenses')} id={`${location.pathname === '/financial/expenses' ? 'select-side-bar' : ''}`}>
                                          <CelebrationIcon />
                                          Gastos Aleatórios
                                    </li>
                                    <li onClick={() => navigate('/financial/monthly-expenses')} id={`${location.pathname === '/financial/monthly-expenses' ? 'select-side-bar' : ''}`}>
                                          <AdfScannerIcon />
                                          Gastos Aleatórios Mensal
                                    </li>
                                    <li onClick={() => navigate('/financial/expenses-card')} id={`${location.pathname === '/financial/expenses-card' ? 'select-side-bar' : ''}`}>
                                          <CreditCardIcon />
                                          Dividas Cartão
                                    </li>
                                    <li onClick={() => navigate('/financial/expenses-card-monthly')} id={`${location.pathname === '/financial/expenses-card-monthly' ? 'select-side-bar' : ''}`}>
                                          <RequestQuoteIcon />
                                          Dividas Cartão Mensal
                                    </li>
                              </>
                        ) : (
                              null
                        )}
                  </>
            </ul>
        </aside>
    );
}

export default SideBar;