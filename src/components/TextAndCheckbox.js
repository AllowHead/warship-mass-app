export const TextAndCheckbox = (props) => {
    switch (props.type) {
        case 'checkbox':
            return (
                <div className='TextAndCheckbox'>
                    <label>
                        {props.info}
                        <input type="checkbox" onClick={props.onClick} checked={props.default} readOnly />
                    </label>
                </div>
            );
        case 'button':
            return (
                <div className='TextAndCheckbox' onClick={props.onClick} >
                    {props.info}
                    < button type="button" > {props.text}</button >
                </div>
            );
        default:
            return;
    }
}