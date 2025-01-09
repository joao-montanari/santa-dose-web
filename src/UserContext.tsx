import { User } from "@Models/user";
import { useState, createContext, useContext, useEffect } from "react";

interface UserContextType{
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    isLoading: boolean
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children } : {children : React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    //Carregando o estado do usuário ao iniciar
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if(storedUser){
            setUser(JSON.parse(storedUser))
        }
        setIsLoading(false) //finalizando o carregamento apenas após validar o estado
    }, [])
    
    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData)) //Salvando no localstage
    }

    const logout = () =>{
        setUser(null)
        localStorage.removeItem("user")
    }


    return(
        <UserContext.Provider value={{user, login, logout, isLoading}}>
            {children}
        </UserContext.Provider>
    )
} 

export const useUser = () =>{
    const context = useContext(UserContext);
    if(!context){
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}