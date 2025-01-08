import { User } from "@Models/user";
import { useState, createContext, useContext, ReactNode } from "react";

interface UserContextType{
    user: User | null;
    setUser: (user: User | null) => void;
    isAdmin: () => boolean;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children } : {children : ReactNode}) => {
    const [user, setUser] = useState<User | null>(null)
    
    const isAdmin = () => {
        return user?.is_admin === true;
    } 

    return(
        <UserContext.Provider value={{user, setUser, isAdmin}}>
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