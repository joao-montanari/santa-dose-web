import { useState } from "react";
import { LockReset, Logout, AccountBox} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import Title from '@Components/Title';
import Menu, { OptionMenuType } from '@Components/Menu';
import Input from "@Components/Input";
import Button from "@Components/Button";
import Notification, { NotificationType } from "@Components/Notification";
import Eric from "../../assets/Eric.jpg"

import './style.sass';

const ChangePassword = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState<string>("");
    const [confPassword, setConfPassword] = useState<string>("");
    const [note, setNote] = useState<NotificationType>({
        message: "",
        show: false,
        type: "info"
    });

    const logout = () => {
        localStorage.removeItem("token");
        navigate('/login');
    }

    async function handleSubmit() {
        if(password !== "" && confPassword !== "") {
            if (password === confPassword) {
                setNote({
                    message: "Impossível trocar a senha! Funcionalidade em desenvolvimento",
                    show: true,
                    type: "info"
                });
            } else {
                setNote({
                    message: "As senhas não são idênticas",
                    show: true,
                    type: "warning"
                });
            }
        } else {
            setNote({
                message: "Preencha os campos vazios",
                show: true,
                type: "warning"
            });
        }
    }

    return (
        <div id='change-password-page-main'>
            <div id='change-password-page-header'>
                <Title
                    title='Mudar senha'
                    subTitle='Preencha o formulário para definir uma nova senha'
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
            <form id='password-form-content' onSubmit={handleSubmit}>
                <Input
                    title="Nova senha"
                    value={password}
                    setValue={setPassword}
                    type="password"
                    width="80%"
                />
                <Input
                    title="Repita a nova senha"
                    value={confPassword}
                    setValue={setConfPassword}
                    type="password"
                    width="80%"
                />
                <Button
                    title="Salva"
                    width="300px"
                    type="submit"
                />
            </form>
            
            <Notification 
                note={note}
                setNote={setNote}
            />
        </div>
    )
}

export default ChangePassword;