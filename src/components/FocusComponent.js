import { animated, useSpring } from "react-spring";

export const FocusComponent = (props) => {
    const massColorStyle = useSpring({
        backgroundColor: props.active ? props.activeBackgroundColor : 'white',
        color: props.active ? props.activeColor : 'black'
    });
    return (
        <animated.button
            className='FocusComponent'
            style={massColorStyle}
            onClick={props.onClick}
        >
            {props.text}
        </animated.button>
    );
}