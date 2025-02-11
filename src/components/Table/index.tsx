import { FileDownload, ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import './style.sass';

const Table = (
    { 
        children, 
        onNextPage, 
        onReturnPage,
        onExportData,
        columns,
        title,
    } : { 
        children : any, 
        onNextPage : any, 
        onReturnPage : any,
        onExportData : any,
        columns : string[],
        title : string
    }) => {
    return (
        <div id='table-component-main'>
            <div id='table-title' >
                <h2>{title}</h2>
                <button onClick={onExportData}>
                    Exportar Lista
                    <FileDownload/>
                </button>
            </div>
            <div id='table-header' >
                <ul>
                    <li style={{ width: "100%" }} >{columns[0]}</li>
                    {
                        columns.map((column, index) => (
                            index !== 0 && <li key={index}>{column}</li>
                        ))
                    }
                    {/* <li style={{ justifyContent: "center", paddingLeft: "0px" }} > Vender Produto </li>
                    <li style={{ justifyContent: "center", paddingLeft: "0px" }} > Adicionar Produto </li>
                    <li style={{ justifyContent: "center", paddingLeft: "0px" }} > Excluir Produto</li> */}
                </ul>
            </div>
            <div id="table-content">
                {children}
            </div>
            <div id="table-section-select">
                <ArrowBackIosNew 
                    onClick={onReturnPage}
                />
                <ArrowForwardIos
                    onClick={onNextPage}
                />
            </div>
        </div>
    )
}

export default Table;