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
import ExpensesCard from "@Pages/ExpensesCard";
import ExpensesCardMonthly from "@Pages/ExpensesCardMonthly";

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
                path: "/registers",
                element: (
                <AdminRoute children={undefined}>
                    
                </AdminRoute>
                )
            },
            {
                path: "/financial",
                element: (
                <AdminRoute children={undefined}>
                    
                </AdminRoute>
                )
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
                path: "/financial/daily-sells",
                element: (
                <AdminRoute>
                    <DailySells/>
                </AdminRoute>
                )
            },
            {
                path:"/financial/monthly-sells",
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
                path: "/registers/product-form",
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
                path: "/financial/spun",
                element: (
                <AdminRoute>
                    <Spun/>
                </AdminRoute>
                )
            },
            {
                path: "/financial/bills",
                element: (
                <AdminRoute>
                    <Bills/>
                </AdminRoute>
                )
            },
            {
                path: "/financial/monthly-bills",
                element: (
                <AdminRoute>
                    <MonthlyBills/>
                </AdminRoute>
                )
            },
            {
                path: "/financial/expenses",
                element: (
                <AdminRoute>
                    <Expenses/>
                </AdminRoute>
                )
            },
            {
                path: "/financial/monthly-expenses",
                element: (
                <AdminRoute>
                    <MonthlyExpenses/>
                </AdminRoute>
                )
            },
            {
                path: "/financial/expenses-card",
                element: (
                <AdminRoute>
                    <ExpensesCard/>
                </AdminRoute>
                )
            },
            {
                path: "/financial/expenses-card-monthly",
                element: (
                <AdminRoute>
                    <ExpensesCardMonthly/>
                </AdminRoute>
                )
            },
            {
                path: "/registers/user-list",
                element: (
                <AdminRoute>
                    <UserList/>
                </AdminRoute>
                )
            },
            {
                path: "/registers/user-form",
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