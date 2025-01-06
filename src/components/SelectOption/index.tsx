import Select from 'react-select';

import { selectStyle } from '@Components/SelectOption/style.const';
import './style.sass';
import { OptionSelect } from '@Utils/optionSelect';

const SelectOption = ({ 
    title, 
    value, 
    setValue, 
    selectList,
    width='100%'
} : { 
    title : string,
    type?: string, 
    value : OptionSelect, 
    setValue : (selected : OptionSelect) => void, 
    selectList : OptionSelect[],
    width? : string,
}) => {  
    
    return (
        <div id='select-component-main' style={{ width: width }}>
            <label>{title}</label>
            <Select
                styles={selectStyle}
                value={value}
                onChange={(element) => setValue(element as OptionSelect)}
                options={selectList}
            />
        </div>
    )
}

export default SelectOption;