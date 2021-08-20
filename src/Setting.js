import { useState } from "react"
import { TextAndCheckbox } from "./components/TextAndCheckbox";

export const Setting = (props) => {
    const defaultSetting = [true, true, true, 4, false, false, 1];

    const [plusAttack, setPlusAttack] = useState(defaultSetting[0]);
    const [skillAfterAttack, setSkillAfterAttack] = useState(defaultSetting[1]);
    const [skillSetting, setSkillSetting] = useState(defaultSetting[2]);
    const [pickupShip, setPickupShip] = useState(defaultSetting[3]);
    const [deathSkill, setDeathSkill] = useState(defaultSetting[4]);
    const [fireAfterSkill, setFireAfterSkill] = useState(defaultSetting[5]);
    const [skillTurnLimit, setSkillTurnLimit] = useState(defaultSetting[6]);

    const maxSelectShip = 5;
    const maxSkillTurnLimit = maxSelectShip + 1;

    const settingList = {
        plusAttack: plusAttack,
        skillAfterAttack: skillAfterAttack,
        skillSetting: skillSetting,
        pickupShip: pickupShip,
        deathSkill: deathSkill,
        fireAfterSkill: fireAfterSkill,
        skillTurnLimit: skillTurnLimit,
    }

    return (
        <div className='Setting' onClick={props.onClick(settingList)}>
            <TextAndCheckbox default={plusAttack} info="命中時追加砲撃の有無" type="checkbox" onClick={() => {
                setPlusAttack(!plusAttack);
            }} />
            <TextAndCheckbox default={skillSetting} info="スキル有効化" type="checkbox" onClick={() => {
                setSkillSetting(!skillSetting);
            }} />
            <TextAndCheckbox default={fireAfterSkill} info="砲撃後のスキル使用の可否" type="checkbox" onClick={() => {
                setFireAfterSkill(!fireAfterSkill);
            }} />
            <TextAndCheckbox default={deathSkill} info="沈没ユニットのスキル使用可否" type="checkbox" onClick={() => {
                setDeathSkill(!deathSkill);
            }} />
            <TextAndCheckbox default={skillAfterAttack} info="スキル使用直後の砲撃の有無" type="checkbox" onClick={() => {
                setSkillAfterAttack(!skillAfterAttack);
            }} />
            <TextAndCheckbox default={skillTurnLimit} info="ターンに使用できるスキルの数" text={`${skillTurnLimit}回`} type="button" onClick={() => {
                setSkillTurnLimit(countRoll(skillTurnLimit, maxSkillTurnLimit));
            }} />
            <TextAndCheckbox default={pickupShip} info="使用する艦数" text={`${pickupShip + 1}隻`} type="button" onClick={() => {
                setPickupShip(countRoll(pickupShip, maxSelectShip));
            }} />
            <TextAndCheckbox info="デフォルトの設定に戻す" type="button" text="リセット" onClick={() => {
                setPlusAttack(defaultSetting[0]);
                setSkillAfterAttack(defaultSetting[1]);
                setSkillSetting(defaultSetting[2]);
                setPickupShip(defaultSetting[3]);
                setDeathSkill(defaultSetting[4]);
            }} />
        </div>
    )
}

const countRoll = (currentValue, maxValue) => {
    if (currentValue < maxValue - 1) {
        return currentValue + 1;
    } else {
        return 0;
    }
};

