import { Liquor, AddCircleOutline, Logout, People, Assessment, AccountBalance, Savings, PersonAddAlt } from '@mui/icons-material'
import { useLocation, useNavigate } from 'react-router-dom';

import './style.sass';
import { useUser } from '../../UserContext';

const SideBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useUser();

    const logout = () => {
        localStorage.removeItem("token");
        navigate('/login');
    }

    return (
        <aside id='side-bar'>
            <h1>Páginas</h1>
            <label>Menu</label>
            <ul>
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

                        <li onClick={() => navigate('/daily-sells')} id={`${location.pathname === '/daily-sells' ? 'select-side-bar' : ''}`}>
                              <Savings /> 
                              Vendas Diárias
                        </li>
                        <li onClick={() => navigate('/monthly-sells')} id={`${location.pathname === '/monthly-sells' ? 'select-side-bar' : ''}`}>
                              <AccountBalance /> 
                              Registro Mensal
                        </li>

                        <li onClick={() => navigate('/user-list')} id={`${location.pathname === '/user-list' ? 'select-side-bar' : ''}`}> 
                               <People/>
                               Lista de usuários
                        </li>

                        <li onClick={() => navigate('/user-form')} id={`${location.pathname.indexOf('/user-form') !== -1 ? 'select-side-bar' : ''}`}> 
                               <PersonAddAlt/>
                               Cadastro de usuário
                        </li>
                    </>
                )}
            </ul>
            <button onClick={logout}>
                <Logout/>
                Sair
            </button>
        </aside>
    );
}

export default SideBar;