import TableSales from "@Components/TableSales"
import Title from "@Components/Title"
import "./style.sass"
import Button from "@Components/Button"
import SelectOption from "@Components/SelectOption"
import { useState } from "react"
import { month_select, TypeMonthSelect } from "@Utils/selectsMonths.const"
import { Preview } from "@mui/icons-material"
import { OptionSelect } from "@Utils/optionSelect"


const DailySells = () =>{
    const [product, setProduct] = useState({tipo: ''});
    const [monthsTotal, setMonthsTotal] = useState<Record<string, number>>({});

    const changeProduct = (key : string, value : string | number) => {
        setProduct(prevState => ({
            ...prevState, 
            [key] : value
        }));
    }

    const handleTotalChange = (total : number) =>{
        if(product.tipo) {
            setMonthsTotal((prev) => ({
                ...prev,
                [product.tipo] : total
            }));
        }
    }

    return(
        <div id="product-list-main">
            
            <div id="product-list-header">
                <Title
                title='Vendas Diárias'
                subTitle='Veja as vendas diárias/mensal da Adega Santa Dose'
                />

                <SelectOption
                    title="Meses"
                    value={month_select.find((month) => month.value === product.tipo) || { value: '', label: '' }}
                    setValue={(selected: OptionSelect) => changeProduct('tipo', selected.value)}
                    selectList={month_select}
                    width="45%"
                />
            </div>


            <TableSales
                title="Vendas Diárias"
                dayColumnTitle="Dias"
                salesColumTitle="Valores Venda"
                totalLabel="Total Do Mês"
                daysInMonth={31}
                onTotalChange={handleTotalChange}
            />

            <div>
                <h2>Totais dos Meses:</h2>
                {Object.entries(monthsTotal).map(([month, total]) => (
                    <p key={month}>
                        {month}: {total.toFixed(2)}
                    </p>
                ))}
            </div>
        </div>
    )
}

export default DailySells