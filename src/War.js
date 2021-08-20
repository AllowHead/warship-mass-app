import { useEffect, useRef, useState } from 'react';
import { animated, useSpring } from 'react-spring';
import { UnitInfo } from './components/UnitInfo';
import { UnitList } from './UnitList';

export const War = (props) => {
    const UNIT = UnitList;
    const innerMASS = props.mass;
    const innerSETTING = props.setting;

    const hitMessage = ['O', 'X', 'W', 'L'];
    const hitMessageText = ['未開封です', '命中！', '至近弾！', '砲弾、敵船に命中せず'];
    const hitBackgroundColor = ['white', 'red', 'yellow', 'grey'];
    const sonarBackgroundColor = ['pink', 'gold', 'silver'];

    const achievementList = {
        fireCount: [0, 0],
        hitCount: [0, 0],
        skillUsed: [0, 0],
        firstLost: [0, 0],
        turn: 0,
        lose: 0,
    }
    const achievementRef = useRef(achievementList);

    const [skillCheckFir, setSkillCheckFir] = useState(false);
    const [skillCheckSec, setSkillCheckSec] = useState(false);

    const playerNum = innerMASS.length;

    const defaultChangeWaitTime = 2000;

    const turnDisplayText = '現在のターン数を表示する';
    const firstButtonText = innerSETTING.skillSetting ? 'スキルを使用する' : turnDisplayText;

    const displayID = 'display';
    const innerMassID = 'onUnitMass';

    const endRef = useRef(false);

    const turnUsedSkillRef = useRef(0);

    const autoFireLockRef = useRef(false);

    const isFirstFireRef = useRef(true);

    const boardBackgroundColor = ['black', 'white'];
    const boardColor = ['white', 'black'];

    const skillLockRef = useRef(false);

    const turnElapsed = useRef(0);

    const effectNumRef = useRef(0);
    const addSkillInfoTextRef = useRef('');

    const defaultDisplayColor = 'silver';
    const [displayColor, setDisplayColor] = useState(defaultDisplayColor);

    let tempMassFire = [];
    for (let p = 0; p < innerMASS.length; p++) {
        tempMassFire[p] = [];
        for (let x = 0; x < innerMASS[p].length; x++) {
            tempMassFire[p][x] = [];
            for (let y = 0; y < innerMASS[p][x].length; y++) {
                tempMassFire[p][x][y] = false;
            }
        }
    }
    const massFired = useRef(tempMassFire);

    const displayStyle = useSpring({
        backgroundColor: displayColor,
        height: '2rem',
    });

    const boardLockRef = useRef(false);

    const selectUnitList = [];
    const tempSkillCD = [];
    const makingFocus = [];
    for (let i = 0; i < innerMASS.length; i++) {
        selectUnitList.push([]);
        tempSkillCD.push([]);
        makingFocus.push([]);
        innerMASS[i].forEach((value) => {
            value.forEach((innerValue) => {
                if (innerValue !== '' && !selectUnitList[i].includes(innerValue)) {
                    selectUnitList[i].push(innerValue);
                    tempSkillCD[i].push(false);
                    makingFocus[i].push(false);
                }
            });
        });
    }

    const [cooldown, setCooldown] = useState(tempSkillCD);

    const [forceRerender, setForceRerender] = useState(0);

    const [unitFocus, setUnitFocus] = useState(makingFocus);

    let tempAlive = [];
    for (let p = 0; p < selectUnitList.length; p++) {
        tempAlive[p] = [];
        for (let i = 0; i < selectUnitList[p].length; i++) {
            tempAlive[p][i] = true;
        }
    }
    const [aliveUnit, setAliveUnit] = useState(tempAlive);


    let tempFirstTurn = props.firstTurn;
    if (typeof tempFirstTurn === 'undefined') {
        tempFirstTurn = 0;
    }
    const turnRef = useRef(tempFirstTurn);

    const tempInnerTextSetting = innerMASS.map((value) => {
        return value.map((valueB) => {
            return valueB.map((valueC) => {
                return 0;
            })
        })
    })
    const [massing, setMassing] = useState(tempInnerTextSetting);

    useEffect(() => {
        const firstPlayer = 0;
        const seconedPlayer = 1;
        makeChildMass(firstPlayer, innerMASS, document.getElementById('firstPlayer'));
        makeChildMass(seconedPlayer, innerMASS, document.getElementById('seconedPlayer'));
        flipFlapping(firstPlayer);
        clearDisplaing();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const makeUnitState = (player) => {
        const tempDOM = [];
        for (let i = 0; i < selectUnitList[player].length; i++) {
            tempDOM.push(
                <UnitInfo
                    key={'abcd' + String(i) + String(player)}
                    alive={aliveUnit[player][i]}
                    unitList={UNIT}
                    unit={UNIT[selectUnitList[player][i]]}
                    onClick={() => {
                        if (endRef.current || player !== turnRef.current || !innerSETTING.skillSetting) {
                            return;
                        }
                        if (skillLockRef.current) {
                        } else {
                            unitFocusFunction(player, selectUnitList[player][i]);
                        }
                    }}
                    canUseSkill={innerSETTING.skillSetting}
                    focus={unitFocus[player][i]}
                    setting={innerSETTING}
                    cooldown={cooldown[player][i]} />
            );
        }
        return (
            <div className='War_unitState'>
                {tempDOM}
            </div>
        );
    }

    const unitFocusFunction = (player, unit) => {
        let tempFocus = unitFocus;
        const clickTarget = selectUnitList[player].indexOf(unit)
        tempFocus[player] = tempFocus[player].map((value, index) => {
            if (index === clickTarget) {
                return !value;
            } else {
                return false;
            }
        });
        setUnitFocus(tempFocus);
        reRender();
    }

    const reRender = () => {
        setForceRerender(forceRerender + 1);
        return true;
    }

    const turnChange = () => {
        if (turnRef.current < playerNum - 1) {
            turnRef.current++;
        } else {
            turnRef.current = 0;
        }
        turnUsedSkillRef.current = 0;
        achievementRef.current.turn++;
        flipFlapping(turnRef.current);
        clearDisplaing();
        clearFocus();
        turnElapsed.current++;
    }

    const clearFocus = () => {
        let tempFocus = unitFocus;
        for (let p = 0; p < tempFocus.length; p++) {
            for (let i = 0; i < tempFocus[p].length; i++) {
                tempFocus[p][i] = false;
            }
        }
        setUnitFocus(tempFocus);
        setForceRerender(forceRerender + 1);
    }

    const flipFlapping = (player) => {
        switch (player) {
            case 0:
                document.getElementById('seconedPlayer').style.display = 'none';
                document.getElementById('firstPlayer').style.display = 'block';
                break;
            case 1:
                document.getElementById('firstPlayer').style.display = 'none';
                document.getElementById('seconedPlayer').style.display = 'block';
                break;
            default:
                break;
        }
    }


    const getNearMass = (player, x, y) => {
        let tempArray = [];
        for (let xb = -1; xb < 2; xb++) {
            for (let yb = -1; yb < 2; yb++) {
                const nx = x + xb;
                const ny = y + yb;
                if (nx < 0 || nx >= innerMASS[player].length) {
                    continue;
                }
                if (ny < 0 || ny >= innerMASS[player][x].length) {
                    continue;
                }
                if (nx === x && ny === y) {
                    continue;
                }
                tempArray.push(innerMASS[player][nx][ny]);
            }
        }
        const returningArray = tempArray.some((value) => { return value !== '' });
        return returningArray;
    }

    const buttonFuntion = (player, x, y, target) => {
        const reverseP = 1 - player;
        if (isErrorCheck(player, target)) {
            return false;
        }

        isFirstFireRef.current = false;
        fireToMass(player, x, y);

        if (innerSETTING.plusAttack && hitCheck(reverseP, x, y) === 1) {
            return false;
        } else {
            turnChangeFunction(defaultChangeWaitTime);
        }
    }

    const turnChangeFunction = (time) => {
        isFirstFireRef.current = true;
        boardLockRef.current = true;
        setTimeout(() => {
            turnChange();
            boardLockRef.current = false;
        }, time);
    }

    const fireToMass = (player, x, y) => {

        const reverseP = 1 - player;
        const isHit = hitCheck(reverseP, x, y);
        console.log(`${x},${y}への砲撃は${hitMessageText[isHit]}`);
        let tempMassing = massing;
        tempMassing[player][x][y] = hitMessage[isHit];
        setMassing(tempMassing);

        const target = document.getElementById(`${innerMassID}${player}${x * 10 + y}`)
        target.innerText = hitMessage[isHit];
        target.style.backgroundColor = hitBackgroundColor[isHit];

        let displaingText = hitMessageText[isHit];
        if (innerSETTING.plusAttack && isHit === 1 && !autoFireLockRef.current) {
            displaingText += String('追加砲撃！');
        }

        achievementRef.current.fireCount[player]++;
        if (isHit === 1) {
            achievementRef.current.hitCount[player]++;
        }
        messageDisplaing(displaingText);
        flashDisplaing(hitBackgroundColor[isHit]);
        massFired.current[reverseP][x][y] = true;
    }

    const flashDisplaing = (color) => {
        setDisplayColor(color);
        setTimeout(() => {
            setDisplayColor(defaultDisplayColor);
        }, 750)
    }

    const gameEndCheck = () => {
        lostShipCheck();
    }

    const lostShipCheck = () => {
        const aliveUnitList = aliveCheck();
        for (let p = 0; p < aliveUnitList.length; p++) {
            for (let i = 0; i < aliveUnitList[p].length; i++) {
                if (!aliveUnitList[p][i] && aliveUnit[p][i]) {
                    const tempAlive = aliveUnit;
                    tempAlive[p][i] = false;
                    setAliveUnit(tempAlive);
                    console.warn(`${selectUnitList[p][i]}が轟沈しました！`);
                }
                if (!aliveUnitList[p].includes(true) && endRef.current === false) {
                    console.warn(`${p + 1}Pのユニットが全て沈みました。${p + 1}Pの敗北です`);
                    gameEnd(p);
                    break;
                }
            }
            if (achievementRef.current.firstLost[p] === 0 && aliveUnitList[p].includes(false)) {
                achievementRef.current.firstLost[p] = aliveUnitList[p]
                    .map((value, index) => {
                        if (!value) {
                            return selectUnitList[p][index];
                        } else {
                            return false;
                        }
                    }).filter((value) => { return value });
            }
        }
    }

    const gameEnd = (loser) => {
        const countDown = 10;
        endRef.current = true;
        achievementRef.current.lose = loser;
        for (let i = 0; i <= countDown; i++) {
            setTimeout(() => {
                const loserMessage = `${loser + 1}Pのユニットが全て沈みました。${loser + 1}Pの敗北です。${countDown - i}秒後にリザルトを表示します。`
                messageDisplaing(loserMessage);
            }, i * 1000);
        }
        setTimeout(() => {
            props.goingResult(achievementRef.current);
        }, (countDown + 2) * 1000);
    }

    const messageDisplaing = (text) => {
        const targetDisplay = document.getElementById(displayID);
        targetDisplay.innerText = String(text);
    }

    const clearDisplaing = () => {
        const targetDisplay = document.getElementById(displayID);
        targetDisplay.innerText = `${turnRef.current + 1}Pのターンです`;
    }

    const hitCheck = (player, x, y) => {
        if (innerMASS[player][x][y] !== '') {
            return 1;
        } else if (getNearMass(player, x, y)) {
            return 2;
        } else {
            return 3;
        }
    }

    const isErrorCheck = (player, target) => {
        if (boardLockRef.current) {
            console.warn('演出中のため操作できません');
            return true;
        }
        if (target.innerText !== hitMessage[0]) {
            console.warn('既に開いたマスをクリックしています');
            return true;
        }
        return false;
    }

    const aliveCheck = () => {
        const shipList = selectUnitList;
        const aliving = [];
        const refCurretn = massFired.current;

        for (let p = 0; p < refCurretn.length; p++) {
            aliving.push([]);
            for (let i = 0; i < shipList[p].length; i++) {
                aliving[p].push(false);
            }

            for (let x = 0; x < refCurretn[p].length; x++) {
                for (let y = 0; y < refCurretn[p][x].length; y++) {
                    for (let s = 0; s < aliving[p].length; s++) {
                        if (refCurretn[p][x][y]) {
                            continue;
                        } else if (innerMASS[p][x][y] === '') {
                            continue;
                        }
                        if (innerMASS[p][x][y] === shipList[p][s]) {
                            aliving[p][s] = true;
                        }

                    }
                }
            }
        }
        return aliving;
    }

    const skillFunction = (player, x, y) => {
        if (!unitFocus[player].includes(true)) {
            console.warn('スキルを発動するユニットを選択していません');
            return;
        };
        turnUsedSkillRef.current++;

        const focusTargetIndex = unitFocus[player].indexOf(true);
        const focusTargetName = selectUnitList[player][focusTargetIndex];
        const focusTargetSkill = UNIT[focusTargetName].skill;
        const skillName = UnitList[focusTargetName].skillName;

        if (typeof x === 'undefined' || typeof y === 'undefined') {
            skillLockRef.current = !skillLockRef.current;
            clearDisplaing();
        }

        skillSwitch(player, x, y, focusTargetSkill);
        messageDisplaing(`${player + 1}Pが${skillName}を発動！${addSkillInfoTextRef.current}`);

        const tempCool = cooldown;
        tempCool[player][focusTargetIndex] = true;
        setCooldown(tempCool);
    }

    const skillSwitch = (player, x, y, skill) => {
        switch (skill[0]) {
            case 'missile':
                missileFunction(player, x, y, skill);
                break;
            case 'fire':
                fireFunction(player, x, y, skill);
                break;
            case 'suppression':
                suppressionFunction(player, x, y, skill);
                break;
            case 'sonar':
                sonarFunction(player, x, y, skill);
                break;
            case 'torpied':
                torpiedFunction(player, x, y, skill);
                break;
            default:
                break;
        }
    }

    const onNumCheck = (x, y) => {
        return typeof x === 'undefined' || typeof y === 'undefined';
    }

    const lockDisable = () => {
        skillLockRef.current = false;
        if (!innerSETTING.skillAfterAttack) {
            turnChangeFunction(defaultChangeWaitTime);
        }
    }

    const missileFunction = (player, x, y, skill) => {
        if (onNumCheck(x, y)) {
            effectNumRef.current = skill[1];
            addSkillInfoTextRef.current = `ミサイルの残弾数:${effectNumRef.current}発`;
        } else {
            effectNumRef.current--;
            if (effectNumRef.current > 0) {
                addSkillInfoTextRef.current = `ミサイルの残弾数:${effectNumRef.current}発`;
            } else {
                lockDisable();
                addSkillInfoTextRef.current = `ミサイルの残弾が尽きました。${innerSETTING.skillAfterAttack ? '追加砲撃可能！' : null}`;
            }
            fireToMass(player, x, y);
            if (!innerSETTING.skillAfterAttack && !effectNumRef.current > 0) {
                turnChangeFunction(defaultChangeWaitTime);
            }
        }
    }

    const fireFunction = (player, x, y, skill) => {
        if (onNumCheck(x, y)) {
            addSkillInfoTextRef.current = '砲撃準備！';
        } else {
            lockDisable();
            addSkillInfoTextRef.current = `砲撃完了！${innerSETTING.skillAfterAttack ? '追加砲撃可能！' : null}`;

            fireNearMass(player, x, y, skill[1]);
        }
    }

    const suppressionFunction = (player, x, y, skill) => {
        if (onNumCheck(x, y)) {
            addSkillInfoTextRef.current = '砲撃準備！';
            fireRandomMass(player, skill[1]);
            lockDisable();
        }
    }

    const sonarFunction = (player, x, y, skill) => {
        if (onNumCheck(x, y)) {
            addSkillInfoTextRef.current = `ソナー射出準備完了。探知範囲:周囲${skill[1][0]}マス`;
        } else {
            lockDisable();
            pulseFire(player, x, y, skill[1][0], skill[1][1]);
            addSkillInfoTextRef.current = `ソナー射出完了！`;
            turnChangeFunction(defaultChangeWaitTime);
        }
    }

    const torpiedFunction = (player, x, y, skill) => {
        if (onNumCheck(x, y)) {
            addSkillInfoTextRef.current = `魚雷発射準備完了`;
        } else {
            lockDisable();
            const clickTarget = innerMASS[1 - player][x][y];
            if (clickTarget !== '') {
                addSkillInfoTextRef.current = `魚雷発射完了！目標に命中！`;
                fireNearMass(player, x, y, 1);
            } else {
                addSkillInfoTextRef.current = `魚雷発射完了！目標に命中せず`;
                fireToMass(player, x, y);
            }
            turnChangeFunction(defaultChangeWaitTime);
        }
    }

    const pulseFire = (player, x, y, range = 1, num = 0) => {
        nearLoopFunc(player, x, y, range, (nx, ny) => {
            const targetMass = document.getElementById(`${innerMassID}${player}${nx * 10 + ny}`);
            const isClicked = targetMass.innerText !== hitMessage[0];
            const reverseP = 1 - player;

            if (!isClicked) {
                if (innerMASS[reverseP][nx][ny] !== '') {
                    targetMass.style.backgroundColor = sonarBackgroundColor[0];
                } else {
                    targetMass.style.backgroundColor = sonarBackgroundColor[2];
                }
            }
        });
    }

    const fireRandomMass = (player, num) => {
        autoFireLockRef.current = true;
        const reverseP = 1 - player;
        const canFireMassList = [];


        let targetMass = massing[reverseP];
        for (let x = 0; x < targetMass.length; x++) {
            for (let y = 0; y < targetMass[x].length; y++) {
                const targetElement = document.getElementById(`${innerMassID}${player}${x * 10 + y}`)
                if (targetElement.innerText === hitMessage[0]) {
                    canFireMassList.push([x, y]);
                }
            }
        }
        for (let i = 0; i < num; i++) {
            if (canFireMassList.length === 0) {
                return;
            }
            const targetIndex = Math.floor(Math.random() * (canFireMassList.length - 1));
            const targetMass = canFireMassList[targetIndex];
            setTimeout(() => {
                fireToMass(player, targetMass[0], targetMass[1]);
                if (i >= num - 1) {
                    autoFireLockRef.current = false;
                    addSkillInfoTextRef.current = `砲撃完了！${innerSETTING.skillAfterAttack ? '追加砲撃可能！' : null}`;
                    messageDisplaing(addSkillInfoTextRef.current);
                    lockDisable();
                    gameEndCheck();
                }
            }, i * 300);
            canFireMassList.splice(targetIndex, 1);
        }

    }

    const fireNearMass = (player, x, y, area) => {
        switch (area) {
            case 0:
                nearLoopFunc(player, x, y, 1, (nx, ny) => {
                    if (nx === x || ny === y) {
                        fireToMass(player, nx, ny);
                    }
                });
                break;
            case 1:
                nearLoopFunc(player, x, y, 1, (nx, ny) => {
                    fireToMass(player, nx, ny);
                });
                break;
            case 2:
                nearLoopFunc(player, x, y, 1, (nx, ny) => {
                    if (ny === y) {
                        fireToMass(player, nx, ny);
                    }
                });
                break;
            default:
                console.warn(`fireスキルにおいてareaの設定に不備が発生しています。該当area:${area}`);
                break;
        }
        gameEndCheck();
    }

    const nearLoopFunc = (player, x, y, range, callback) => {
        const min = range * -1;
        const max = range + 1;
        for (let xb = min; xb < max; xb++) {
            for (let yb = min; yb < max; yb++) {
                const nx = x + xb;
                const ny = y + yb;
                if (nx < 0 || nx >= innerMASS[player].length) {
                    continue;
                }
                if (ny < 0 || ny >= innerMASS[player][x].length) {
                    continue;
                }
                callback(nx, ny);
            }
        }
    }


    const makeChildMass = (player, requiredMass, targetElement) => {
        const wrapperDIV = document.createElement('div');
        const childMass = requiredMass[player];

        for (let x = 0; x < childMass.length; x++) {
            const innerDIV = document.createElement('div');
            for (let y = 0; y < childMass[x].length; y++) {
                const innerMassBUTTON = document.createElement('button');
                innerMassBUTTON.innerText = hitMessage[massing[player][x][y]];
                innerMassBUTTON.id = `${innerMassID}${player}${x * 10 + y}`;

                const innerMassStyle = [
                    { styleName: 'width', styleValue: '2rem' },
                    { styleName: 'height', styleValue: '2rem' },
                    { styleName: 'backgroundColor', styleValue: boardBackgroundColor[player] },
                    { styleName: 'color', styleValue: boardColor[player] },
                ];
                innerMassStyle.forEach(({ styleName, styleValue }) => {
                    innerMassBUTTON.style[styleName] = styleValue;
                });

                innerMassBUTTON.onclick = (event) => {
                    if (autoFireLockRef.current) {
                        console.warn('演出中のため操作が無効化されています');
                        return;
                    }
                    if (endRef.current) {
                        console.warn('ゲーム終了済です');
                        return;
                    }
                    if (skillLockRef.current) {
                        skillFunction(player, x, y);
                    } else {
                        buttonFuntion(player, x, y, event.target);
                    }
                    gameEndCheck();
                }
                innerDIV.appendChild(innerMassBUTTON);
            }
            wrapperDIV.appendChild(innerDIV);
        }
        targetElement.appendChild(wrapperDIV);
    }

    const changeCountRef = useRef(0);

    const skillButtonFunction = (player, event) => {
        if (!innerSETTING.skillSetting) {
            event.target.innerText = `現在、第${turnRef.current}ターン。${turnRef.current + 1}Pの攻撃`;
            setTimeout(() => { event.target.innerText = turnDisplayText }, 3000);
            console.warn('スキル無効化の設定です');
            return;
        }
        if (skillLockRef.current) {
            console.warn('スキル発動中をキャンセルします');
            clearFocus();
            return;
        }
        if (innerSETTING.skillTurnLimit <= turnUsedSkillRef.current) {
            console.warn('1ターンに使用できるスキル数の上限に到達しました');
            messageDisplaing('1ターンに使用できるスキル数の上限に到達しました');
            return;
        }
        if (!innerSETTING.fireAfterSkill && !isFirstFireRef.current) {
            console.warn('スキル発動の権利を失っています');
            flashDisplaing('red');
            messageDisplaing('一度でも砲撃を行った後はスキルを使用できません');
            return;
        }
        if (endRef.current) {
            console.warn('ゲーム終了済です');
            return;
        };
        if (boardLockRef.current) {
            console.warn('演出中のため操作が無効化されています');
            return;
        }
        if (turnRef.current !== player) {
            console.warn(`現在は${turnRef.current + 1}Pのターンです`);
            return;
        }
        if (player === 0) {
            if (skillCheckFir) {
                achievementRef.current.skillUsed[player]++;
                skillFunction(player);
            } else {
                setSkillCheckFir(true);
                changeCountRef.current++;
                setTimeout(() => {
                    changeCountRef.current--;
                    if (changeCountRef.current <= 0) {
                        setSkillCheckFir(false);
                    }
                }, 5000);
            }
        } else {
            if (skillCheckSec) {
                turnUsedSkillRef.current++;
                achievementRef.current.skillUsed[player]++;
                skillFunction(player);
            } else {
                setSkillCheckSec(true);
                setTimeout(() => {
                    changeCountRef.current--;
                    if (changeCountRef.current <= 0) {
                        setSkillCheckSec(false);
                    }
                }, 5000);
            }
        }
    }

    return (
        <div className='War mainWrapper'>
            {makeUnitState(0)}
            <div className='War_buttons'>
                <p>1P</p>
                <button type="button" onClick={(event) => { skillButtonFunction(0, event) }}>{skillCheckFir ? '本当に？' : firstButtonText}</button>
            </div>
            <animated.div style={displayStyle} id={displayID}></animated.div>
            <div className='War_board' id='firstPlayer'></div>
            <div className='War_board' id='seconedPlayer'></div>
            <div className='War_buttons'>
                <p>2P</p>
                <button type="button" onClick={(event) => { skillButtonFunction(1, event) }}>{skillCheckSec ? '本当に？' : firstButtonText}</button>
            </div>
            {makeUnitState(1)}
        </div >
    );
}