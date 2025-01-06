import "./style.sass"

const MonthBox = ({ monthName, totalValue} : {monthName: string, totalValue: number}) =>{
    return(
        <div id="entire-box-month">
            <div id="title-background">
                <h2>{monthName}</h2>
            </div>

            <div id="value-adjust">
                <p>{totalValue}</p>
            </div>
        </div>
    )
}

export default MonthBox