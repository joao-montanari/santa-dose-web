import { FileDownload, ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import './style.sass';

const Table = (
    { 
        children, 
        onExportData,
        columns,
        title,
    } : { 
        children : any, 
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
            <div id='table-scroll-container'>
                <div id='table-header' >
                    <ul>
                        <li style={{ width: "100%", justifyContent: "center"}} >{columns[0]}</li>
                        {
                            columns.map((column, index) => (
                                index !== 0 && <li key={index}>{column}</li>
                            ))
                        }

                    </ul>
                </div>
                <div id="table-content">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Table;