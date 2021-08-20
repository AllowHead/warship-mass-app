import { useRef, useState } from "react";
import { Button } from "./components/Button";
import { UnitWrapper } from "./components/UnitWrapper";
import { UnitList } from "./UnitList";

export const UnitSelectPlayer = (props) => {
    const pickupShip = props.setting.pickupShip + 1;
    const [onLock, setOnLock] = useState(true);
    const shipNum = Object.values(UnitList).length;
    const isActive = [];
    for (let i = 0; i < shipNum; i++) {
        isActive[i] = false;
    }
    const isActiveRef = useRef(isActive);
    const [shipActive, setShipActive] = useState(0);



    const errorMessage = `アクティブな船が${pickupShip}隻になるように選択して下さい。`;

    const makingDOM = Object.values(UnitList).map((value, index) => {
        let tempSkillName = value.skillName;
        let tempSkillInfo = value.skillInfo;
        if (!props.setting.skillSetting) {
            tempSkillName = '';
            tempSkillInfo = '';
        }
        return <UnitWrapper
            unitInfo={value.unitInfo}
            list={UnitList}
            targetShip={value.id}
            startWait={props.startWait}
            onLock={onLock}
            skillName={tempSkillName}
            skillInfo={tempSkillInfo}
            name={value.name}
            info={value.info}
            key={Object.keys(UnitList)[index]}
            onClick={(value) => {
                isActiveRef.current[index] = value;
                setShipActive(isActiveRef.current.filter((value) => { return value }).length)
            }} />
    });


    return (
        <div className='UnitSelectPlayer'>
            <p className='UnitSelectPlayer_select'>{props.value}:{shipActive}/{pickupShip}</p>
            {makingDOM}
            <Button value='選択を確定'
                onClick={() => {
                    if (!props.startWait) {
                        if (shipActive === pickupShip) {
                            setOnLock(!onLock);
                            props.onClick(onLock, isActiveRef.current);
                        } else {
                            window.alert(errorMessage);
                        }
                    }
                }} />
        </div>
    )
}