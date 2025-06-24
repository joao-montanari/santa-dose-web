import {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Clear, LockReset, Logout, AccountBox } from "@mui/icons-material";

import { User } from "@Models/user";
import { listUsers, deleteUser } from "@Api/services/users";
import { exportExcelUser } from "@Utils/exportExcel";

import Title from "@Components/Title";
import Search from "@Components/Search";
import Table from "@Components/Table";
import DeleteModal from "@Components/DeleteModal";
import Menu, { OptionMenuType } from "@Components/Menu";
import Loading from "@Components/Loading";
import Notification, { NotificationType } from "@Components/Notification";

import './style.sass';
import getPhotoUser from "@Api/services/getPhotoUser";

const UserList = () => {
    const navigate = useNavigate();

    const [search, setSearch] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [isOpenModal, setOpenModal] = useState<boolean>(false);
    const [selectUser, setSelectUser] = useState<User>();
    const [_startPage, setStartPage] = useState<number>(0);
    const [note, setNote] = useState<NotificationType>({
        message: "",
        show: false,
        type: "info"
    });

    const [results, setResults] = useState<User[]>([]);
    const [dataUsers, setDataUsers] = useState<User[]>([]);
    const [usersList, setUsersList] = useState<User[]>([]);

    const logout = () => {
        localStorage.removeItem("token");
        navigate('/login');
    }
    

    const setRangeList = (start : number, amount : number) => {
        let rangeList : User[] = [];
        let dataBase = search && results ? results : dataUsers;

        if (start < dataBase.length && start >= 0) {
            for (var index = 0; index < amount; index++) {
                if (start + index < dataBase.length) {
                    var user = dataBase[start + index];
                    rangeList.push(user);
                }
            }
            setStartPage(start);
            setUsersList(rangeList);
        }
    }

    async function delUser(id : number) {
        setLoading(true);
        const deleteResponse = await deleteUser(id);
        setOpenModal(false);

        if (deleteResponse.error) {
            setNote({
                message: `${deleteResponse.response.response.data.detail}`,
                show: true,
                type: "error"
            });
        } else {
            getAllUsers();
        }
        setLoading(false);
    }

    async function getAllUsers() {
        setLoading(true);
        const data = await listUsers();
        
        if (data.error) {
            if(data.response.response.status === 401) navigate("/login");

            setNote({
                show: true,
                message: `${data.response.response.data.detail}`,
                type: "error"
            });
        } else {
            setDataUsers(data[1]);
        }

        setLoading(false);
    }

    useEffect(() => {
        setUsersList(dataUsers);
        setRangeList(0, 10);
        console.log("Dados: ", dataUsers)
    }, [dataUsers]);

    useEffect(() => {
        if(!search) {
            setResults(dataUsers);
        } else {
            let searchResult : User[] = dataUsers.filter((element) =>
                element.email.toLowerCase().indexOf(search.toLowerCase()) != -1 ||
                element.username.toLowerCase().indexOf(search.toLowerCase()) != -1
            );
            setResults(searchResult);
        }
    }, [search]);

    useEffect(() => {
        setRangeList(0, 10);
    }, [results]);

    useEffect(() => {
        getAllUsers();

        if(localStorage.getItem("user-operation")) {
            setNote({
                show: true,
                message: `${localStorage.getItem("user-operation")}`,
                type: "success"
            });
            localStorage.removeItem("user-operation");
        }
    }, []);

    return (
        <div id='user-list-main'>
            <div id='user-list-header'>
                <Title
                    title="Lista de usuários"
                    subTitle="Veja a lista de todos os usuários cadastrados no sistema"
                />
                <div id='user-list-header-content'>
                    <Search
                        placeholder="Pesquisa por um usuário" 
                        value={search}
                        setValue={setSearch}
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
            </div>

            <Table
                onExportData={() => exportExcelUser(dataUsers, "Lista de Usuários")}
                columns={["E-mail", "", "", "", "","Username de login do usuário", "Administrador", "Editar/Excluir Usuário"]}
                title="Lista de usuários"
            >
                {
                    usersList.map((user, index) => (
                        <ul key={index}>
                            <li style={{ width: "100%", justifyContent: "left", paddingLeft: "20px" }}>
                                {user.email}
                            </li>
                            <li style={{ paddingLeft: "20px", justifyContent: "left", minWidth: '180px' }}>
                                {user.username}
                            </li>
                            <li style={{ paddingLeft: "20px", justifyContent: "left", minWidth: '180px' }}>
                                {user.is_admin ? "Sim" : "Não"}
                            </li>
                            <li id="user-list-options" style={{ minWidth: "180px" }} >
                                <Edit
                                    onClick={() => {
                                        navigate(`/user-form/${user.idUsuario}`);
                                    }}
                                />
                                <Clear 
                                    onClick={() => {
                                        setOpenModal(true);
                                        setSelectUser(user);
                                    }}
                                />
                            </li>
                        </ul>
                    ))
                }
            </Table>

            <DeleteModal
                description="Tem certeza que deseja deletar este usuário? Ao fazer isto, ele não terá mais acesso ao sistema!"
                title={`${selectUser?.username}`}
                open={isOpenModal}
                setOpen={setOpenModal}
                onDelete={() => selectUser && selectUser.idUsuario && delUser(selectUser?.idUsuario)}
            />

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

export default UserList;