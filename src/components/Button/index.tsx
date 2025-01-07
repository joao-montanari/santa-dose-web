import './style.sass';

const Button = ({ 
    title, 
    style = "primary", 
    type = "button",
    width = "100%",
    onClick,
} : { 
    title : string,
    style? : "primary" | "second" | "third",
    type? : "submit" | "reset" | "button" | undefined
    width? : string,
    onClick? : () => void;
}) => {

    return (
        <button 
            type={type} 
            id={`btn-component-${style}-style`}
            style={{ width: width }}
            onClick={onClick}
        >
            {title}
        </button>
    )
}

export default Button;