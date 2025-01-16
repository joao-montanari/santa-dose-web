import { useState } from "react";
import './style.sass';

const TableSales = (
    { 
      title,
      dayColumnTitle,
      salesColumTitle,
      totalLabel,
      daysInMonth,
      onDayValueChange,
      titleNamesSpun,
      onTotalChange,

    }
     : {
        title?: string,
        dayColumnTitle ?: string,
        salesColumTitle ?: string,
        totalLabel?: string,
        daysInMonth : number,
        titleNamesSpun?: string, 
        onDayValueChange ?: (day: number, value: number) => void
        onTotalChange?: (total: number) => void,
    })  =>{
    //Estado para armazenar os valores de cada dia do mês
    const [sales, setSales] = useState(Array.from({ length: daysInMonth }, (_, i) => ({ day: (i + 1).toString(), value: "" })));
    
    //Mudando os valores nos inputs
    const handleInputChange = (index: number, field: "name" | "value", value: string) =>{
        const updateSales = [...sales];
        updateSales[index] = { ...updateSales[index], [field]: value};
        setSales(updateSales)

        if (field === "value") {
            const numericValue = parseFloat(value);

            if(!isNaN(numericValue)) { 
                onDayValueChange && onDayValueChange(index + 1, numericValue)
            }

            const total = calculateTotal(updateSales);
            onTotalChange && onTotalChange(total);
        }
    }

    const calculateTotal = (data: { day: string; value: string}[]) => {
            return data.reduce((acc, { value }) => {
                const numericValue = parseFloat(value);
                return acc + (isNaN(numericValue) ? 0 : numericValue);
            }, 0);
        };

    //Calculando os valores totais de cada dia no final da página
    // const calculoTotal = () =>{
    //     return sales.reduce((acc, val) =>{
    //         const numericValue = parseFloat(val);
    //         return acc + (isNaN(numericValue) ? 0 : numericValue);
    //     }, 0);
    // };

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
                        {Array.from({ length: daysInMonth }, (_, i) => (
                            <tr key={i}>
                                <td>{i + 1}</td>
                                {titleNamesSpun && <td><input type="text" value={sales[i].day} onChange={(e) => handleInputChange(i, "name",e.target.value)}></input></td>}
                                <td><input type="number" value={sales[i].value} onChange={(e) => handleInputChange(i, "value",e.target.value)}></input></td>
                            </tr>
                        ))}

                        <tr>
                            <td>{totalLabel}</td>
                            {titleNamesSpun && <td>Fim</td>}
                            <td>{calculateTotal(sales).toFixed(2)}</td>
                        </tr>

                        
                    </tbody>
                    
                </table>

            </div>
        </div>
    )
}

export default TableSales