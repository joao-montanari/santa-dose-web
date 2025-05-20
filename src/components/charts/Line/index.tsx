import { 
    LineChart, 
    Line, 
    CartesianGrid, 
    ResponsiveContainer, 
    XAxis, 
    YAxis, 
    Tooltip 
} from 'recharts';

import CustomTooltip from '../Tooltip';

import './style.sass';

const ChartLine = ({ data, title } : { data : any[], title : string }) => {
    return (
        <div id='chart-line-main-component'>
            <div id="chart-line-header-component">
                <h1>{title}</h1>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data} margin={{ top: 15, right: 40, left: 0, bottom: 15 }}>
                        <CartesianGrid horizontal vertical={false} stroke="#ccc" />
                        <XAxis dataKey="produto" style={{ fontSize: "14px" }} />
                        <YAxis style={{ fontSize: "14px" }} axisLine={false} />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length > 0) {
                                    const item = payload[0].payload;
                                    return (
                                        <CustomTooltip>
                                            <h4>{item.produto}</h4>
                                            <ul>
                                                <li>Quantidade vendida: {item.quantidade}</li>
                                            </ul>
                                        </CustomTooltip>
                                    )
                                }
                                return null;
                            }}
                        />
                        <Line type="monotone" dataKey="quantidade" stroke="#e0b439" />
                    </LineChart>
                </ResponsiveContainer>
                        </div>
    )
}

export default ChartLine;