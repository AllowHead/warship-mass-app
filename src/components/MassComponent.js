export const MassComponent = (props) => {
    const massText = ['O', 'X'];
    const springStyle = {
        backgroundColor: props.active ? props.activeBackgroundColor : 'white',
        color: props.active ? props.activeColor : 'black'
    };

    return (
        <button
            style={springStyle}
            type='button'
            onClick={props.onClick}
        >
            {props.active ? massText[1] : massText[0]}
        </button>
    );
}