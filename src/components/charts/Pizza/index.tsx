import { Cell, Legend, Pie, PieChart } from 'recharts';
import './style.sass';

const colors = ["#000000", "#FF00FF", "#FF0000", "#0000FF", "#00C49F", "#FFFF00"]

const ChartPizza = ({data} : {data : { tipo: string; quantidade: number;}[]}) => {
    return (
        <div id='background-page'>
            <h2 id='title-fix'>Vendas por Tipo de Pagamento</h2>
                <div id='grafico-pizza'>
                    <PieChart width={400} height={300}>
                    <Pie 
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="quantidade"
                        nameKey="tipo"
                    >
                        {data.map((_entry, index) =>(
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Pie>
                    <Legend />
                </PieChart>
            </div>
        </div>
    )
}

export default ChartPizza;