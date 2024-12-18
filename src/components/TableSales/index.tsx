import { useState } from "react";
import './style.sass';

const TableSales = (
    { 
      title,
      dayColumnTitle,
      salesColumTitle,
      totalLabel,
      daysInMonth,
    }
     : {
        title?: string,
        dayColumnTitle ?: string,
        salesColumTitle ?: string,
        totalLabel?: string,
        daysInMonth : number,
    })  =>{
    //Estado para armazenar os valores de cada dia do mês
    const [sales, setSales] = useState(Array(daysInMonth).fill(""))
    
    //Mudando os valores nos inputs
    const handleInputChange = (index: number, value: string) =>{
        const updateSales = [...sales];
        updateSales[index] = value;
        setSales(updateSales)
        }

    //Calculando os valores totais de cada dia no final da página
    const calculoTotal = () =>{
        return sales.reduce((acc, val) =>{
            const numericValue = parseFloat(val);
            return acc + (isNaN(numericValue) ? 0 : numericValue);
        }, 0);
    };

    return(
        <div id="table-border-style">
            <h1>{title}</h1>
            <div id="table-component-size">
                <table id="table-component-main">
                    <thead>
                        <tr>
                            <th>{dayColumnTitle}</th>
                            <th>{salesColumTitle}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: daysInMonth }, (_, i) => (
                            <tr key={i}>
                                <td>{i + 1}</td>
                                <td><input type="number" value={sales[i]} onChange={(e) => handleInputChange(i, e.target.value)}></input></td>
                            </tr>
                        ))}

                        <tr>
                            <td>{totalLabel}</td>
                            <td>{calculoTotal().toFixed(2)}</td>
                        </tr>

                        
                    </tbody>
                    
                </table>

            </div>
        </div>
    )
}

export default TableSales