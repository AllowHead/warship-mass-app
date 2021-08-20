import { useEffect, useState } from "react";
import { UnitList } from "./UnitList";

export const Board = (props) => {
    //盤面の大きさ
    const massLength = props.size;

    const playerBoard = 'players';

    //ボタンのクラス名の設定
    const shipBtnClassName = 'ships';
    const shipBtnActiveColor = 'goldenrod';
    const massBtnClassName = 'boardButtons';

    const displayState = 'alphasphire';
    const defaultDisplayText = 'ユニットを配置中...';

    const [locked, setLocked] = useState([false, false]);


    //現在選択中の船のステート
    const [focus, setFocus] = useState([null, null]);

    //ユニット選択で選択したユニットの、UnitListのインデックスを取得する
    const selectList = props.shipList
        .map((value) => {
            return value.map((innerValue, index) => {
                if (innerValue === true) {
                    return index;
                } else {
                    return false;
                }
            })
                .filter((value) => {
                    return value !== false;
                })
        });

    let tempPlaced = [];
    let tempMass = [];
    for (let i = 0; i < selectList.length; i++) {
        tempPlaced[i] = [];
        tempMass[i] = [];
        for (let x = 0; x < selectList[0].length; x++) {
            tempPlaced[i][x] = [null, null];
        }
        for (let x = 0; x < massLength; x++) {
            tempMass[i][x] = [];
            for (let y = 0; y < massLength; y++) {
                tempMass[i][x][y] = '';
            }
        }
    }
    const [placed, setPlaced] = useState(tempPlaced);
    const [mass, setMass] = useState(tempMass);


    useEffect(() => {

        const defaultDisplayBack = 'grey';
        const displayTarget = document.getElementById(displayState);

        for (let x = 0; x < selectList.length; x++) {
            const targetBoard = document.getElementById(playerBoard + String(x));

            const createdDivFromShip = document.createElement("div");
            for (let y = 0; y < selectList[x].length; y++) {

                const createdBTNfromShip = document.createElement("button");
                const defaultColor = createdBTNfromShip.style.backgroundColor;
                const playerClassName = shipBtnClassName + String(x);

                //スタイル指定
                createdBTNfromShip.innerHTML = Object.values(UnitList)[selectList[x][y]].name;
                createdBTNfromShip.style.borderWidth = '0.5rem';
                createdBTNfromShip.className = playerClassName;
                createdBTNfromShip.style.backgroundColor = Object.values(UnitList)[selectList[x][y]].color;

                createdBTNfromShip.onclick = () => {
                    const targetClass = document.getElementsByClassName(playerClassName);
                    for (let ib = 0; ib < targetClass.length; ib++) {
                        targetClass[ib].style.borderColor = defaultColor;
                    }
                    createdBTNfromShip.style.borderColor = shipBtnActiveColor;
                    let tempFocus = focus;
                    tempFocus[x] = Object.keys(UnitList)[selectList[x][y]];
                    setFocus(tempFocus);
                    console.log(`${createdBTNfromShip.innerHTML}にフォーカス`);
                }

                createdDivFromShip.appendChild(createdBTNfromShip);
            }
            targetBoard.appendChild(createdDivFromShip);

            for (let xb = 0; xb < massLength; xb++) {
                const createdDiv = document.createElement("div");
                for (let yb = 0; yb < massLength; yb++) {

                    const createdBTN = document.createElement("button");
                    const massClassName = massBtnClassName + String(x);

                    //スタイル指定
                    createdBTN.innerHTML = xb * 10 + yb + 1;
                    createdBTN.style.width = '3rem';
                    createdBTN.style.height = '2rem';
                    createdBTN.className = massClassName;

                    createdBTN.onclick = () => {
                        if (!locked[x]) {
                            checkShip(focus[x], xb, yb, x);
                        }
                        console.log(`${createdBTN.innerHTML}番のマスをクリック`);
                    }
                    createdDiv.appendChild(createdBTN);
                }
                targetBoard.appendChild(createdDiv);
            }

            const createdConfirmBtn = document.createElement("button");

            createdConfirmBtn.innerText = '確定';

            const defaultBackground = 'radial-gradient(#a6a4a4 0%, #fff 100%)';
            const massBack = document.getElementById(playerBoard + String(x));

            massBack.style.background = defaultBackground;
            displayTarget.style.background = defaultDisplayBack;

            createdConfirmBtn.onclick = () => {
                const nullChecker = placed[x].map((value) => {
                    return value.indexOf(null);
                }).indexOf(0);
                if (nullChecker === -1) {
                    placedCheck(x, () => {
                        const tempLocked = locked;
                        tempLocked[x] = !tempLocked[x];
                        setLocked(tempLocked);
                        console.log(locked, 'lockstate');
                        if (locked[x]) {
                            massBack.style.background = 'radial-gradient(#70bb70 0%, #fff 100%)';
                        } else {
                            massBack.style.background = defaultBackground;
                        }

                        if (locked[0] === true && locked[1] === true) {
                            displayTarget.style.background = 'green';
                            displayTarget.innerText = 'まもなく開始！';
                            setTimeout(() => {
                                if (locked[0] === true && locked[1] === true) {
                                    props.goingGame(mass);
                                }
                            }, 3000);
                        } else {
                            displayTarget.style.background = defaultDisplayBack;
                            displayTarget.innerText = defaultDisplayText;
                        }
                    });
                } else {
                    displayTarget.innerText = '全ての船を配置して下さい。配置していない船が存在しています'
                    displayTarget.style.background = 'red';
                    setTimeout(() => { displayTarget.innerText = defaultDisplayText }, 5000);
                    setTimeout(() => { displayTarget.style.background = defaultDisplayBack }, 1000);
                    console.warn('全ての船を配置して下さい。配置していない船が存在しています')
                }
                console.log(placed[x], 'place');
                console.log('kettei');
            }
            targetBoard.appendChild(createdConfirmBtn);
        }
    });

    const placedCheck = (player, callbackfunction) => {
        console.log(placed[player], 'check');
        const nameList = selectList[player].map((value) => {
            return Object.values(UnitList)[value].id;
        });
        console.log(UnitList, nameList, mass, 'fas');
        for (let i = 0; i < placed[player].length; i++) {
            for (let x = 0; x < UnitList[nameList[i]].size[0]; x++) {
                for (let y = 0; y < UnitList[nameList[i]].size[1]; y++) {
                    const targetX = placed[player][i][0] + x;
                    const targetY = placed[player][i][1] + y;
                    const tempMass = mass;
                    if (tempMass[player][targetX][targetY] !== UnitList[nameList[i]].id) {
                        const defaultDisplayBack = 'grey';
                        const displayTarget = document.getElementById(displayState);
                        displayTarget.innerText = '配置場所が重複している船があります。修正して下さい'
                        displayTarget.style.background = 'red';
                        setTimeout(() => { displayTarget.innerText = defaultDisplayText }, 5000);
                        setTimeout(() => { displayTarget.style.background = defaultDisplayBack }, 1000);

                        console.warn('重複あり？');
                        return false;
                    }
                }
            }
        }
        callbackfunction();
    }

    const allClear = (ship, player) => {
        const allMass = document.getElementsByClassName(massBtnClassName + String(player));
        for (let i = 0; i < allMass.length; i++) {
            allMass[i].style.backgroundColor = '';
        }
        for (let x = 0; x < mass[player].length; x++) {
            for (let y = 0; y < mass[player].length; y++) {
                mass[player][x][y] = '';
            }
        }
    }

    const checkShip = (ship, x, y, player) => {
        if (typeof ship === 'object') {
            console.warn('船のフォーカスがオフになっています');
            return false;
        }

        const nameList = selectList[player].map((value) => {
            return Object.keys(UnitList)[value];
        })

        const tempPlaced = placed;
        tempPlaced[player][nameList.indexOf(ship)] = [x, y];
        setPlaced(tempPlaced);
        console.log(placed);

        const targetUnit = UnitList[ship];
        const coreX = x + targetUnit.size[0] - 1;
        const coreY = y + targetUnit.size[1] - 1;

        if (coreX > massLength - 1 || coreY > massLength - 1) {
            console.warn('船体が画面外に出てしまいます');
            return false;
        }

        allClear(ship, player);

        const targetBtn = document.getElementsByClassName(massBtnClassName + String(player));

        const loopToUnitSize = (callbackfunction) => {
            for (let xb = 0; xb < targetUnit.size[0]; xb++) {
                for (let yb = 0; yb < targetUnit.size[1]; yb++) {
                    const targetX = x + xb;
                    const targetY = y + yb;
                    callbackfunction(targetX, targetY);
                }
            }
        }

        let isDuplicate = false;
        loopToUnitSize((xl, yl) => {
            if (mass[player][xl][yl] !== '') {
                isDuplicate = true;
            }
        })

        if (!isDuplicate) {
            loopToUnitSize((xl, yl) => {
                const tempMass = mass;
                tempMass[player][xl][yl] = targetUnit.id;
                setMass(tempMass);
                const massNum = xl * 10 + yl;
                targetBtn[massNum].style.backgroundColor = targetUnit.color;
            })
        }

        for (let i = 0; i < placed[player].length; i++) {
            const targetShip = Object.values(UnitList)[selectList[player][i]];
            let tempMass = mass;

            for (let xm = 0; xm < targetShip.size[0]; xm++) {
                for (let ym = 0; ym < targetShip.size[1]; ym++) {
                    if (placed[player][i][0] === null || placed[player][i][1] === null) {
                        continue;
                    }
                    const targetX = placed[player][i][0] + xm;
                    const targetY = placed[player][i][1] + ym;
                    if (tempMass[player][targetX][targetY] === '' || tempMass[player][targetX][targetY] === targetShip.id) {
                        tempMass[player][targetX][targetY] = targetShip.id;
                        targetBtn[targetX * 10 + targetY].style.backgroundColor = targetShip.color;
                    }
                }
            }
            setMass(tempMass);
        }
    }

    return (
        <div id="Board mainWrapper">
            <div id={playerBoard + String(0)}></div>
            <div id={displayState}>{defaultDisplayText}</div>
            <div id={playerBoard + String(1)}></div>
        </div>
    )
}