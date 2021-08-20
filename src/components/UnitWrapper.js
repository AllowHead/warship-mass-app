import { useState } from "react";
import { animated, useSpring } from "react-spring"
import { Overray } from "./Overray";
import { ShipMassSize } from "./ShipMassSize";

export const UnitWrapper = (props) => {

    const colorSetter = (lock, bool) => {
        if (!lock) {
            if (bool) {
                return '#71d612';
            } else {
                return 'rgba(0, 200, 0, 0.5)';
            }
        } else if (bool) {
            return 'rgba(255, 241, 0, 0.5)';
        } else {
            return 'rgba(0, 0, 0, 0.3)';
        }
    }

    const [focusCheck, setFocusCheck] = useState(false);
    const springStyle = useSpring({
        backgroundColor: colorSetter(props.onLock, focusCheck),
    });
    return (
        <animated.div className="UnitWrapper"
            style={springStyle}
            onClick={() => {
                if (!props.startWait) {
                    if (props.onLock) {
                        setFocusCheck(!focusCheck); props.onClick(!focusCheck)
                    } else {
                        props.onClick(focusCheck)
                    }
                }
            }}>
            <div>
                <h3 className='UnitWrapper_name flexType'>
                    {props.name}
                    <Overray
                        inner={
                            <div className='UnitWrapper_unitInfo'>
                                <div>
                                    <h3 className='UnitWrapper_name'>{props.name}</h3>
                                    <p className='UnitWrapper_skillName'> <b>{props.skillName}</b></p>
                                </div>
                                <p className='UnitWrapper_info'>{props.skillInfo}</p>
                                <p className='UnitWrapper_info'>{props.unitInfo}</p>
                                <div className='UnitWrapper_size'>
                                    サイズ:
                                    <ShipMassSize
                                        shipList={props.list}
                                        targetShip={props.targetShip}
                                    />
                                </div>
                            </div>
                        }
                    />
                </h3>
                <p className='UnitWrapper_skillName'> <b>{props.skillName}</b></p>
                <p className='UnitWrapper_skillInfo'>{props.skillInfo}</p>
            </div>
        </animated.div>
    )
}