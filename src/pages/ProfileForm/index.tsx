import { useState } from "react";
import { LockReset, Logout, AccountBox, AccountCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import Title from '@Components/Title';
import Menu, { OptionMenuType } from '@Components/Menu';
import Input from "@Components/Input";
import Button from "@Components/Button";
import Eric from "../../assets/Eric.jpg"

import { User } from "@Models/user";

import './style.sass';

const ProfileForm = () => {
    const navigate = useNavigate();

    const [profile, setProfile] = useState<User>({
        idUsuario: null,
        email: "",
        is_admin: false,
        senha: "",
        username: ""
    });

    const logout = () => {
        localStorage.removeItem("token");
        navigate('/login');
    }

    const changeProfileParams = (key : string, value : any) => {
        setProfile(prevState => ({
            ...prevState,
            [key] : value
        }))
    }

    return (
        <div id='profile-form-page-main'>
            <div id='profile-form-page-header'>
                <Title
                    title='Editar perfil'
                    subTitle='Edite as informações do seu perfil'
                />
                <Menu
                    icon={<img src={Eric} style={{ width:"35px", borderRadius: "40px", color: "#9A9494", cursor: "pointer"}}/>}
                    options={[
                        { label: "Editar perfil", onPress: () => navigate("/profile-form"), icon: <AccountBox/> },
                        { label: "Trocar senha", onPress: () => navigate("/change-password"), icon: <LockReset/> },
                        { label: "Sair", onPress: () => logout(), icon: <Logout/> },
                    ] as OptionMenuType[]}
                    style={{
                        margin: "0px 10px 0px 20px"
                    }}
                />
            </div>
            <form id="profile-form-container">
                <Input
                    setValue={(value : string) => changeProfileParams("username", value)}
                    title="Nome de usuário"
                    value={profile.username}
                    width="80%"
                />
                <Input
                    setValue={(value : string) => changeProfileParams("email", value)}
                    title="E-mail"
                    value={profile.email}
                    width="80%"
                />
                <Button
                    title="Salvar"
                    width="300px"
                    type="submit"
                    style="primary"
                />
            </form>
        </div>
    )
}

export default ProfileForm;