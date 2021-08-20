import { useState } from "react";
export const Overray = (props) => {

    const [display, setDisplay] = useState(false);

    const clickedFunction = () => {
        setDisplay(!display);
    }

    const overrayDOM = () => {
        return (
            <div className='Overray_overray'>
                {props.inner}
            </div>
        )
    }
    return (
        <div
            className='Overray'
            onClick={clickedFunction}
        >
            i
            {display ? overrayDOM() : null}
        </div>
    )
}