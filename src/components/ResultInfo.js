import { UnitList } from "../UnitList";

export const ResultInfo = (props) => {

    const fireC = props.fireC;
    const hitC = props.hitC;
    const skillNum = props.skillNum;
    const lost = props.lost;
    const destroyed = props.destroyed;
    const skillACT = props.skillACT;

    const calcPercentage = (numerator, denominator) => {
        if (denominator === 0) {
            return 0;
        }
        return Math.round((numerator / denominator) * 1000) / 10;
    }

    const skillActiveSwitch = (active = false) => {
        if (active) {
            return (
                <p>スキルを使用した回数: <b>{skillNum}回</b></p>
            );
        } else {
            return;
        }
    }
    const destroyShip = () => {
        const lostName = nameMake(lost);
        const destroyName = nameMake(destroyed);

        return (
            <div>
                <p>最初に失ったユニット: {lostName}</p>
                <p>最初に倒したユニット: {destroyName}</p>
            </div>
        );
    }
    const nameMake = (data) => {
        if (data === 0) {
            return 'なし';
        }
        if (Array.isArray(data)) {
            return data.map((value) => { return UnitList[value].name }).join('、')
        }
        return UnitList[data].name;
    }

    return (
        <div>
            <p>
                命中率: <ruby><rb><b>{calcPercentage(hitC, fireC)}%</b></rb><rp> </rp><rt>({hitC} / {fireC})</rt></ruby>
            </p>
            {skillActiveSwitch(skillACT)}
            {destroyShip()}
        </div>
    )
}