import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LockReset, Logout, AccountBox} from '@mui/icons-material';

import Title from "@Components/Title";
import Input from "@Components/Input";
import Switch from "@Components/Switch";
import Menu, { OptionMenuType } from '@Components/Menu';
import Notification, { NotificationType } from "@Components/Notification";
import Loading from "@Components/Loading";

import { User } from "@Models/user";
import { getUser, patchUser, createUser } from "@Api/services/users";

import './style.sass';
import getPhotoUser from "@Api/services/getPhotoUser";

const UserForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profileImage, setProfileImage] = useState<File | null>(null);

    const [loading, setLoading] = useState<boolean>(false);
    const [note, setNote] = useState<NotificationType>({
        message: "",
        show: false,
        type: "success"
    });
    const [user, setUser] = useState<User>({
        idUsuario: null,
        username: "",
        email: "",
        senha: "",
        is_admin: false,
        profileImage: null
    })

    const logout = () => {
        localStorage.removeItem("token");
        navigate('/login');
    }

    const changeUserParams = (key : string, value : string | boolean) => {
        setUser(prevState => ({
            ...prevState,
            [key] : value
        }));
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0){
            setProfileImage(e.target.files[0]);
        }
    }

    async function getSelectUser() {
        if(id) {
            setLoading(true);
            const data = await getUser(parseInt(id));

            if(data.error) {
                setNote({
                    message: `${data.response.response.data.detail}`,
                    show: true,
                    type: "error"
                });
            } else {
                setUser(data[1])
            }
            setLoading(false);
        }
    }

    async function handleSubmit() {
        if(
            user.email !== ""
            && user.senha !== ""
            && user.username !== ""
            && profileImage
        ) {
            setLoading(true);
            if(user.idUsuario) {
                const respUpdate = await patchUser({
                    idUsuario : user.idUsuario,
                    username : user.username,
                    email : user.email,
                    is_admin : user.is_admin,
                    profileImage : profileImage
                });
                if(respUpdate.error) {
                    setNote({
                        message: `${respUpdate.response.response.data.detail}`,
                        show: true,
                        type: "error"
                    });
                } else {
                    localStorage.setItem("user-operation", "Usuário atualizado!");
                    navigate("/registers/user-list");
                }
            } else {
                 try{
                    const formData = new FormData();
                    formData.append("username", user.username)
                    formData.append("email", user.email)
                    formData.append("senha", user.senha)
                    formData.append("is_admin_raw", String(Number(user.is_admin)))
                    
                    if(profileImage){
                        formData.append("profile_image", profileImage || new Blob());
                    }

                    const respCreate = await createUser(formData);

                    if(respCreate.error) {
                            setNote({
                                message: `${respCreate.response.response.data.detail}`,
                                show: true,
                                type: "error"
                            });
                        } else {
                            localStorage.setItem("user-operation", "Usuário criado!");
                            navigate("/registers/user-list");
                        }
                }catch(error){
                    setNote({
                                message: `${error}`,
                                show: true,
                                type: "error"
                            });
                }
            }
            setLoading(false);
        } else {
            setNote({
                message: "Preencha os campos corretamente",
                show: true,
                type: "warning"
            });
        }
    }

    useEffect(() => {
        getSelectUser();
    }, []);

    return (
        <div id='user-form-page-main'>
            <div id="user-form-header">
                <Title
                    title="Cadastro de usuário"
                    subTitle="Cadastre ou edite um usuário no sistema preenchendo o formulário"
                />
                <Menu
                    icon={<img src={getPhotoUser()} style={{ width:"35px", borderRadius: "40px", color: "#9A9494", cursor: "pointer"}}/>}
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
            <form id="user-form-content" onSubmit={handleSubmit}>
                <div id="user-form-container">
                    <Input
                        title="Nome do usuário"
                        value={user.username}
                        setValue={(value : string) => changeUserParams('username', value)}
                        width="45%"
                    />
                    <Input
                        title="E-mail"
                        value={user.email}
                        setValue={(value : string) => changeUserParams('email', value)}
                        width="45%"
                        type="email"
                    />
                </div>
                <div id="user-form-container">
                    {
                        !user.idUsuario && (
                            <Input
                                title="Senha"
                                value={user.senha}
                                setValue={(value : string) => changeUserParams('senha', value)}
                                width="33%"
                                type="password"
                            />
                        )
                    }
                    <div id="user-form-switch-container">
                        <label>Permissão de administrador:</label>
                        <Switch
                            value={user.is_admin}
                            setValue={(value : boolean) => changeUserParams('is_admin', value)}
                        />
                    </div>
                    
                    <div id="user-form-profileImage">
                        <label>Foto de Perfil:</label>
                        <div id="user-form-button">
                            <input type="file" accept="image/*" className="background-color: black" onChange={(e) => handleFileChange(e)} />
                        </div>
                    </div>
                </div>
                <button type="submit">
                    Salvar
                </button>
            </form>
            {
                loading && <Loading/>
            }
            <Notification 
                note={note}
                setNote={setNote}
            />
        </div>
    )
}

export default UserForm;