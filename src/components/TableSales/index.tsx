import { useEffect, useState } from "react";
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
      initialSales,

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
        initialSales?: {dia: string, mes: string, valor: string}[];
    })  =>{
    //Estado para armazenar os valores de cada dia do mês
    const [sales, setSales] = useState<{ day: string; value: string }[]>([]);

    

    useEffect(() => {
        if (initialSales && daysInMonth > 0) {
            const newSales = Array.from({ length: daysInMonth }, (_, i) => {
                const existingValue = initialSales.find(item => Number(item.dia) === i + 1);
                return {
                    day: (i + 1).toString(),
                    value: existingValue ? existingValue.valor : "", 
                };
            });
    
            console.log("Valores carregados em TableSales:", newSales);
            setSales(newSales);
        }
    }, [initialSales, daysInMonth]); 
    //Mudando os valores nos inputs
    const handleInputChange = (index: number, value: string) => {
        const sanitizedValue = value.replace(/[^0-9.]/g, "");

        setSales((prevSales) => {
            const updatedSales = [...prevSales];
            updatedSales[index] = { ...updatedSales[index], value: sanitizedValue };

            const numericValue = sanitizedValue === "" ? 0 : parseInt(sanitizedValue, 10);

            // Aguarde a renderização antes de atualizar o estado do pai
            setTimeout(() => {
                if (onDayValueChange) {
                    onDayValueChange(index + 1, numericValue);
                }
                if (onTotalChange) {
                    const total = calculateTotal(updatedSales);
                    onTotalChange(total);
                }
            }, 0);

            return updatedSales;
        });
          
        // clearTimeout(inputTimeout);
        // inputTimeout = setTimeout(() =>{
            
            // const numericValue = sanitizedValue === "" ? 0 : parseInt(sanitizedValue, 10);
            // onDayValueChange && onDayValueChange(index + 1, numericValue)

            // const total = calculateTotal(sales);
            // onTotalChange && onTotalChange(index + 1, total);

            // setSales(prevSales => {
            //     const total = calculateTotal(prevSales); // Agora usa os valores mais recentes
            //     onTotalChange && onTotalChange(index + 1, total);
            //     return prevSales;
            // });

            // const total = calculateTotal(sales);
            // onTotalChange && onTotalChange(index + 1, total);
        // }, 500)
    };

    // let inputTimeout: NodeJS.Timeout;


    const calculateTotal = (data: { day: string; value: string }[]) => {
        return data.reduce((acc, { value }) => {
            const numericValue = value === "" ? 0 : parseInt(value, 10);
            return acc + (isNaN(numericValue) ? 0 : numericValue);
        }, 0);
    };

    return (
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
                        {sales.map((sale, i) => (
                            <tr key={i}>
                                <td>{i + 1}</td>
                                {titleNamesSpun && <td><input type="text" value={sale.day} onChange={(e) => handleInputChange(i, e.target.value)} /></td>}
                                <td><input type="number" value={sale.value || 0} onChange={(e) => handleInputChange(i, e.target.value)} /></td>
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
    );
};

export default TableSales;