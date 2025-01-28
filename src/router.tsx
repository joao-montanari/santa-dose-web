import { createHashRouter, Navigate } from "react-router-dom";

import StandartLayout from './layouts/StandartLayout';

import Login from "@Pages/Login";
import GeneralVision from './pages/GeneralVision';
import ProductList from "./pages/ProductList";
import ProductForm from "./pages/ProductForm";
import UserList from "./pages/UserList";
import UserForm from "@Pages/UserForm";
import ChangePassword from "@Pages/ChangePassword";
import ProfileForm from "@Pages/ProfileForm";
import DailySells from "@Pages/DailySells/Index";
import MonthlySells from "@Pages/MonthlySells";
import React, { useContext } from "react";
import { UserContext, useUser } from "./UserContext"
import Loading from "@Components/Loading";
import Home from "@Pages/Home";
import Spun from "@Pages/SpunDebts";
import Bills from "@Pages/Bills";
import MonthlyBills from "@Pages/MonthlyBills";
import Expenses from "@Pages/Expenses";
import MonthlyExpenses from "@Pages/MonthlyExpenses";

const AdminRoute = ({ children }: { children : React.ReactNode }) => {
    const { user, isLoading } = useUser();
    const context = useContext(UserContext)

    if(!context){
        console.log("UserContext não está disponível!")
        return <Navigate to="/login" />;
    }

    if(isLoading){
        return <Loading/>
    }

    if(!user || !user.is_admin){
        return <Navigate to="/login" replace />;
    }
  
    // Caso seja admin, renderiza o elemento permitido
    return <>{children}</>;
  };

const routers = createHashRouter([
    {
        path: "",
        element: <StandartLayout/>,
        children: [
            {
                path: "/",
                element: <Home/>
            },
            {
                path: "/general-vision",
                element: (
                <AdminRoute>
                    <GeneralVision/>
                </AdminRoute>
                )
            },
            {
                path: "/daily-sells",
                element: (
                <AdminRoute>
                    <DailySells/>
                </AdminRoute>
                )
            },
            {
                path:"/monthly-sells",
                element: (
                <AdminRoute>
                    <MonthlySells/>
                </AdminRoute>
                )
            },
            {
                path: "/product-list",
                element: <ProductList/>
            },
            {
                path: "/product-form",
                element: (
                <AdminRoute>
                    <ProductForm/>
                </AdminRoute>
                )
            },
            {
                path: "/product-form/:id",
                element: (
                <AdminRoute>
                    <ProductForm/>
                </AdminRoute>
                ) 
            },
            {
                path: "/spun",
                element: (
                <AdminRoute>
                    <Spun/>
                </AdminRoute>
                )
            },
            {
                path: "/bills",
                element: (
                <AdminRoute>
                    <Bills/>
                </AdminRoute>
                )
            },
            {
                path: "/monthly-bills",
                element: (
                <AdminRoute>
                    <MonthlyBills/>
                </AdminRoute>
                )
            },
            {
                path: "/expenses",
                element: (
                <AdminRoute>
                    <Expenses/>
                </AdminRoute>
                )
            },
            {
                path: "/monthly-expenses",
                element: (
                <AdminRoute>
                    <MonthlyExpenses/>
                </AdminRoute>
                )
            },
            {
                path: "/user-list",
                element: (
                <AdminRoute>
                    <UserList/>
                </AdminRoute>
                )
            },
            {
                path: "/user-form",
                element: (
                <AdminRoute>
                    <UserForm/>
                </AdminRoute>
                )
            },
            {
                path: "/user-form/:id",
                element: (
                <AdminRoute>
                    <UserForm/>
                </AdminRoute>
                )
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