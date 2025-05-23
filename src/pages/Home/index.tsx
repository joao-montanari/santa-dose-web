import ImageCarousel from "@Components/ImageCarousel.tsx";
import images22 from "../../assets/milk.jfif"
import raphael from "../../assets/Raphael.jpg"
import eric from "../../assets/Eric.jpg"
import "./style.sass"
import Title from "@Components/Title";
import Menu, { OptionMenuType } from "@Components/Menu";
import { AccountBox, LockReset, Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ImageCarouselMini from "@Components/ImageCarouselMini";
import TitlePage from "@Components/TitlePage";
import Eric from "../../assets/Eric.jpg"

const Home = () => {
    const navigate = useNavigate()
    
    const logout = () =>{
        localStorage.removeItem("token")
        navigate("/login")
    }

    const imagesPersonalRaphael = [
        raphael,
    ]

    const imagesPersonalEric = [
        eric,
    ]

    const imagesAdega = [
        images22,
        images22,
        images22,
    ];

    return(
        <>
            <div id="user-list-header-content">
                <Title
                title="Home Page"
                subTitle="Home Page do site da Adega Santa Dose"
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
        
            <div id="carousel-main">
                <ImageCarousel images={imagesAdega}/>

                <div id="space-carousel-main">
                    <TitlePage title="Contatos da Adega Santa Dose"/>
                </div>

                <div id="align-user-photos">
                    <ImageCarouselMini images={imagesPersonalRaphael} nameOwner="Raphael Gomes" numeroFoto="19 98169-1654"/>
                    <ImageCarouselMini images={imagesPersonalEric} nameOwner="Eric Barreto" numeroFoto="19 99353-2974"/>
                    <ImageCarouselMini images={imagesPersonalRaphael} nameOwner="Regilene Gomes" numeroFoto="19 98191-6017"/>
                </div>
            </div>
        </>
        
    )
}

export default Home