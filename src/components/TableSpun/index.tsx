import { useEffect, useState } from "react";
import './style.sass';

const TableSpun = (
    { 
      title,
      dayColumnTitle,
      salesColumTitle,
      totalLabel,
      daysInMonth,
      titleNamesSpun,
      onDataChange,
      initialData,
    }
     : {
        title?: string,
        dayColumnTitle ?: string,
        salesColumTitle ?: string,
        totalLabel?: string,
        daysInMonth : number,
        titleNamesSpun?: string, 
        onDataChange?: (data: { dia: string, name: string, valor: string} []) => void,
        initialData?: {dia: string, name: string, valor: string}[];
    })  =>{
    //Estado para armazenar os valores de cada dia do mês
    const [sales, setSales] = useState(Array.from({ length: daysInMonth }, (_, i) => ({
         dia: (i + 1).toString(),
         name: "",
         valor: "" })));
    
    //Mudando os valores nos inputs
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, field: "dia" | "name" | "valor") => {
        const updatedSalesData = [...sales];
        const newValue = e.target.value

        if (updatedSalesData[index][field] === newValue) return;

        updatedSalesData[index] = {
            ...updatedSalesData[index],
            [field]: newValue,
        };

        setSales(updatedSalesData);

        if(onDataChange){
            onDataChange(updatedSalesData);
        }

        console.log("Após a operação: ", updatedSalesData)
    };

    const calculateTotal = (data: { dia: string; valor: string}[]) => {
            return data.reduce((acc, { valor }) => {
                const numericValue = parseFloat(valor);
                return acc + (isNaN(numericValue) ? 0 : numericValue);
            }, 0);
        }; 

    useEffect(() => {
            if (initialData && initialData.length > 0) {
                setSales((prevSales) => {
                    const updatedSales = Array.from({ length: daysInMonth }, (_, i) => {
                        const existingData = initialData.find((item) => item.dia === (i + 1).toString());
                        return existingData || { dia: (i + 1).toString(), name: "", valor: "" };
                    });
        
                    return JSON.stringify(prevSales) !== JSON.stringify(updatedSales) ? updatedSales : prevSales;
                });
            }
        }, [initialData, daysInMonth]);   

    return(
        <div id="table-border-style">
            <h1 id="table-title">{title}</h1>
            <div id="table-component-size">
                <table id="table-component-main">
                    <thead>
                        <tr>
                            <th>{dayColumnTitle}</th>
                            {titleNamesSpun && <th>{titleNamesSpun}</th>}
                            <th>{salesColumTitle}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales && sales.length > 0 ? (
                            sales.map((item, index) => (
                                <tr key={index}>
                                <td>{item.dia}</td>
                                <td><input type="text" value={item.name} onChange={(e) => handleInputChange(e, index,"name")} onKeyDown={(e) => {
                                    if (["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].includes(e.key)) {
                                        e.preventDefault();
                                    }}}></input>
                                </td>
                                <td><input type="number" value={item.valor} onChange={(e) => handleInputChange(e, index, "valor")} onKeyDown={(e) => {
                                    if (["e", "E", "+", "-", "*", "/", ",", ".", "-", ";", "'", "!", "@", "#", "$", "%", "¨", "&", "(", ")", "_", "´", "`", "[", "]", "~"].includes(e.key)) { 
                                        e.preventDefault(); 
                                    }}}></input></td>
                            </tr>
                            ))
                        ) : ( 
                            <tr>
                                <td>Nenhum dado Disponível</td>
                            </tr>
                        )}
                        <tr>
                            <td>{totalLabel}</td>
                            {titleNamesSpun && <td>--</td>}
                            <td>{calculateTotal(sales).toFixed(2)}</td> 
                        </tr>
                    </tbody>
                    
                </table>

            </div>
        </div>
    )
}

export default TableSpun