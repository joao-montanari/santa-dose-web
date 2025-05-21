import { useState } from "react";
import { PersonOutline, LockOpen, Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';

import { LoginRequest } from "@Api/services/auth";
import { Auth } from "@Models/user";
import { useUser } from "../../UserContext";

import Loading from "@Components/Loading";
import Notification, { NotificationType } from "@Components/Notification";

import Logo from "@Public/logo.png";

import "./style.sass";

const Login = () => {
    const { login } = useUser();
    const navigate = useNavigate();
    const [isVisibility, setVisibility] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<NotificationType>({
        show: false,
        message: "",
        type: "success"
    });
    const [user, setUserA] = useState<Auth>({
        username: "",
        password: ""
    });

    const changeUserArgs = (value : string, key : string) => {
        setUserA(prevState => ({
            ...prevState,
            [key] : value
        }));
    }

    async function userRequest() {
        const data = await LoginRequest(user);

        if(data.error) {
            setError({
                show: true,
                message: `${data.response.response ? 
                    data.response.response.data.detail 
                    : "Falha de conexão com a API"
                }`,
                type: "error"
            });
            setLoading(false);
        } else {
            localStorage.setItem("token", data.response.token);
            login(data.response)
            console.log("Dados: ", data.response)
            navigate("/");
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        await userRequest();
    }

    return (
        <div id="login-page-main">
            <Notification 
                note={error}
                setNote={setError}
            />
            {
                loading && <Loading/>
            }
            <form onSubmit={handleSubmit}>
                <img src={Logo} alt="beer" />
                <div id="input-content-login">
                    <PersonOutline/>
                    <input 
                        type="text"
                        placeholder="Nome do usuário"
                        value={user.username}
                        onChange={(element) => changeUserArgs(element.target.value, "username")}
                    />
                </div>
                <div id="input-content-login">
                    <LockOpen/>
                    <div id="input-content-password">
                        <input
                            type={isVisibility ? "text" : "password"}
                            placeholder="Senha"
                            value={user.password}
                            onChange={(element) => changeUserArgs(element.target.value, "password")}
                        />
                        <button type="button" onClick={() => setVisibility(!isVisibility)}>
                            {
                                isVisibility ? <VisibilityOff/> : <Visibility/>
                            }
                        </button>
                    </div>
                </div>
                <button type="submit">
                    Entrar
                </button>
            </form>
        </div>
    )
}

export default Login;