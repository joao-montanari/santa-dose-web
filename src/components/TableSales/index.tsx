import { useEffect } from "react";
import './style.sass';

const TableSales = (
    { 
      title,
      dayColumnTitle,
      salesColumTitle,
      totalLabel,
      daysInMonth,
      nameAccount,
      onDayValueChange,
      titleNamesSpun,
      onTotalChange,
      initialSales,
      sales,
      setSales

    }
     : {
        title?: string,
        dayColumnTitle ?: string,
        salesColumTitle ?: string,
        totalLabel?: string,
        daysInMonth : number,
        nameAccount?: string,
        titleNamesSpun?: string, 
        onDayValueChange ?: (day: number, value: number) => void
        onTotalChange?: (total: number) => void,
        initialSales?: {dia: string, mes: string, valor: string, motivo: string}[];
        sales?: {day : string; value: string; reason: string}[],
        setSales?: React.Dispatch<React.SetStateAction<{ day: string; value: string; reason: string}[]>>
    })  =>{
    //Estado para armazenar os valores de cada dia do mês

    useEffect(() => {
        if (initialSales && daysInMonth > 0) {
            const newSales = Array.from({ length: daysInMonth }, (_, i) => {
                const existingValue = initialSales.find(item => Number(item.dia) === i + 1);
                return {
                    day: (i + 1).toString(),
                    reason: existingValue ? existingValue.motivo : "",
                    value: existingValue ? existingValue.valor : "", 
                };
            });
    
            console.log("Valores carregados em TableSales:", newSales);
            if(setSales){
                setSales(newSales);
            }
        }
    }, [ daysInMonth]); 
    //Mudando os valores nos inputs
    const handleInputChange = (index: number, field: "value" | "reason" | "day", inputValue: string) => {

        if(setSales){
            setSales((prevSales) => {
                const updatedSales = [...prevSales];

                let sanitizedValue = inputValue;
                if(field === "value"){
                    const sanitizedValue = inputValue.replace(/[^0-9.]/g, "");
                    console.log(sanitizedValue)
                }

                updatedSales[index] = { ...updatedSales[index], [field]: sanitizedValue,};

                
                if(field === "value"){
                        const numericValue = sanitizedValue === "" ? 0 : parseInt(sanitizedValue, 10);
                        setTimeout(() => {
                        if (onDayValueChange) {
                            onDayValueChange(index + 1, numericValue);
                        }
                        if (onTotalChange) {
                            const total = calculateTotal(updatedSales);
                            onTotalChange(total);
                        }
                    }, 0);
                }
                // Aguarde a renderização antes de atualizar o estado do pai
                return updatedSales;
            });
        }
        
          
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
                            {nameAccount && <th>{nameAccount}</th>}                            
                            {titleNamesSpun && <th>{titleNamesSpun}</th>}
                            <th>{salesColumTitle}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales && sales.map((sale, i) => (
                            <tr key={i}>
                                <td>{i + 1}</td>
                                {titleNamesSpun && <td><input className="input-style-table" type="text" value={sale.day} onChange={(e) => handleInputChange(i, "day", e.target.value)} /></td>}
                                {nameAccount && <td><input className="input-style-table" type="text" value={sale.reason} onChange={(e) => handleInputChange(i, "reason", e.target.value)} /></td>}
                                <td><input className="input-style-table" value={sale.value || 0} onChange={(e) => handleInputChange(i, "value", e.target.value)} /></td>
                            </tr>
                        ))}
                        <tr>
                            <td>{totalLabel}</td>
                            {titleNamesSpun && <td>Fim</td>}
                            <td>{calculateTotal(sales ?? []).toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TableSales;