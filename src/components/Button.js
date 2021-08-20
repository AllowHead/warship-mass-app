export const Button = (props) => {
    return (
        <button onClick={props.onClick} className="button" type="button">{props.value}</button>
    )
}