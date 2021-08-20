import { animated, useSpring } from "react-spring";
import { Overray } from "./Overray";
import { ShipMassSize } from "./ShipMassSize";

export const UnitInfo = (props) => {

    const unitName = props.unit.name;
    const unitSkillName = props.unit.skillName;
    const cooldown = props.cooldown;

    const isAlive = props.alive;
    const aliveText = (status) => {
        if (status) {
            return '健在';
        } else {
            return '轟沈！';
        }
    }
    const canUse = (bool) => {
        if (bool) {
            return String(unitSkillName) + String('は使用済');
        } else {
            return unitSkillName;
        }
    }


    const styleSetting = (focu, aliv) => {
        if (!aliv) {
            if (props.setting.deathSkill && focu) {
                return 'purple';
            }
            return 'grey';
        }
        if (cooldown) {
            return 'blue';
        }
        if (focu) {
            return 'red';
        }
        return 'green';
    }


    const wrapperStyle = useSpring({
        border: '0.1rem solid black',
        backgroundColor: styleSetting(props.focus, isAlive),
    });

    const skillInfoDisplay = (bool) => {
        if (bool) {
            return (
                <p>{canUse(cooldown)}</p>
            );
        } else {
            return;
        }
    }

    return (
        <animated.div className='UnitInfo' style={wrapperStyle} onClick={() => {
            if (!isAlive && !props.setting.deathSkill) {
                console.warn('このユニットは沈没しています');
                return;
            }
            if (cooldown) {
                console.warn('スキルは現在CDに入っています');
                return;
            }
            props.onClick();

        }}>
            <div className='flexType'>
                {unitName}
                <Overray
                    inner={
                        <div className='UnitWrapper_unitInfo'>
                            <div>
                                <h3 className='UnitWrapper_name'>{props.unit.name}</h3>
                                <p className='UnitWrapper_skillName'> <b>{props.unit.skillName}</b></p>
                            </div>
                            <p className='UnitWrapper_info'>{props.unit.skillInfo}</p>
                            <p className='UnitWrapper_info'>{props.unit.unitInfo}</p>
                            <div className='UnitWrapper_size'>
                                サイズ:
                                <ShipMassSize
                                    shipList={props.unitList}
                                    targetShip={props.unit.id}
                                />
                            </div>
                        </div>
                    }
                />
            </div>
            {skillInfoDisplay(props.canUseSkill)}
            <p>{aliveText(isAlive)}</p>
        </animated.div>
    )
}