import { useState } from "react";
import { animated, useSpring } from "react-spring";
import { UnitList } from "./UnitList";
import { UnitSelectPlayer } from "./UnitSelectPlayer";

export const UnitSelect = (props) => {
    const countToStart = 2;
    const [lockState, setLockState] = useState([false, false]);
    const [message, setMessage] = useState('使用するユニットを選択してください');
    const [isStart, setIsStart] = useState(false);
    const [isCanStart, setIsCanStart] = useState(false);
    const [selectedShip, setSelectedShip] = useState([[], []]);


    const colorSetter = (lock, bool) => {
        if (!lock) {
            if (bool) {
                return '#c3fa02';
            } else {
                return '#b7253c';
            }
        } else if (bool) {
            return '#71d612';
        } else {
            return '#b7253c';
        }
    }

    const confirmStyle = useSpring({
        backgroundColor: colorSetter(isStart, isCanStart),
        color: isCanStart ? 'black' : 'white',
    });

    const lockedFunction = (state, num) => {
        const tempState = lockState;
        tempState[num] = state;
        setLockState(tempState);
        if (lockState[0] && lockState[1]) {
            setMessage('ここをクリックで確定！');
            setIsCanStart(true);
        } else {
            setMessage('選択中...');
            setIsCanStart(false);
        }
    }
    const getSelectedList = (list, player) => {
        const tempShip = selectedShip;
        tempShip[player] = list;
        setSelectedShip(tempShip);
    }
    const selectShipListMaking = () => {
        return selectedShip.map((outerValue) => {
            return outerValue.map((value, index) => {
                if (value) {
                    return UnitList[Object.keys(UnitList)[index]].id;
                } else {
                    return false;
                }
            })
                .filter((value) => {
                    return value
                });
        });
    }

    return (
        <div className="UnitSelect">
            <UnitSelectPlayer
                startWait={isStart}
                value="1P"
                setting={props.setting}
                onClick={(bool, list) => {
                    lockedFunction(bool, 0);
                    setIsStart(false);
                    getSelectedList(list, 0);
                }} />
            <animated.div className='UnitSelect_state' style={confirmStyle} onClick={() => {
                if (lockState[0] && lockState[1] && isStart === false) {
                    setIsStart(true);
                    for (let i = countToStart; i >= 0; i--) {
                        setTimeout(() => { setMessage('ユニット配置に移ります！') }, i * 1000);
                        if (i === countToStart) {
                            setTimeout(() => { props.goingBoard(selectShipListMaking()); }, 1000 * (countToStart + 1));
                        }
                    }
                }
            }}>
                <p>{message}</p>
            </animated.div>
            <UnitSelectPlayer
                startWait={isStart}
                value="2P"
                setting={props.setting}
                onClick={(bool, list) => {
                    lockedFunction(bool, 1);
                    setIsStart(false);
                    getSelectedList(list, 1);
                }} />
        </div>
    )
}