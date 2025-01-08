import { createHashRouter, Navigate } from "react-router-dom";

import StandartLayout from './layouts/StandartLayout';

import Login from "@Pages/Login";
import HomePage from './pages/Home';
import ProductList from "./pages/ProductList";
import ProductForm from "./pages/ProductForm";
import UserList from "./pages/UserList";
import UserForm from "@Pages/UserForm";
import ChangePassword from "@Pages/ChangePassword";
import ProfileForm from "@Pages/ProfileForm";
import DailySells from "@Pages/DailySells/Index";
import MonthlySells from "@Pages/MonthlySells";
import { useContext } from "react";
import { UserContext } from "./UserContext"

const AdminRoute = ({ element }: { element: JSX.Element }) => {
    const context = useContext(UserContext)
  
    if(!context){
        console.log("UserContext não está disponível!")
        return <Navigate to="/login" />;
    }

    const { user } = context;

    if(!user || !user.is_admin){
        return <Navigate to="/login" />;
    }
  
    // Caso seja admin, renderiza o elemento permitido
    return element;
  };

const routers = createHashRouter([
    {
        path: "",
        element: <StandartLayout/>,
        children: [
            {
                path: "/",
                element: <HomePage/>
            },
            {
                path: "/daily-sells",
                element: <AdminRoute element={<DailySells/>} />
            },
            {
                path:"/monthly-sells",
                element: <AdminRoute element={<MonthlySells/>} />
            },
            {
                path: "/product-list",
                element: <ProductList/>
            },
            {
                path: "/product-form",
                element: <AdminRoute element={<ProductForm/>} />
            },
            {
                path: "/product-form/:id",
                element: <AdminRoute element={<ProductForm/>} />
            },
            {
                path: "/user-list",
                element: <AdminRoute element={<UserList/>} />
            },
            {
                path: "/user-form",
                element: <AdminRoute element={<UserForm/>} />
            },
            {
                path: "/user-form/:id",
                element: <AdminRoute element={<UserForm/>} />
            },
            {
                path: "/change-password",
                element: <ChangePassword/>
            },
            {
                path: "/profile-form",
                element: <ProfileForm/>
            }
        ]
    },
    {
        path: "",
        element: null,
        children: [
            {
                path: "/login",
                element: <Login/>
            }
        ]
    }
])

export default routers;