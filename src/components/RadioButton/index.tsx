import "./style.sass"

const RadioButton = ({ title, selectedValue, onChange} : {style?: string, title: string, selectedValue: string, onChange: (value: string) => void}) =>{

    return(
        <div id="radio-button">
            <input type="radio" value={title} checked={selectedValue === title} onChange={(e) => onChange(e.target.value)}></input>
        </div>
    )
}

export default RadioButton