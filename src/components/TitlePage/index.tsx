import "./style.sass"

const TitlePage = ({title} : {title: string}) => { 
    return(
        <h1 id="pageTitle">{title}</h1>
    )
}

export default TitlePage