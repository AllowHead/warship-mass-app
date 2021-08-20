import React, { useRef, useState } from "react";
import { animated, useSpring } from "react-spring";
import { FocusComponent } from "./components/FocusComponent";
import { MassComponent } from "./components/MassComponent";
import { UnitList } from "./UnitList";

export const BoardAdv = (props) => {

    const unitData = UnitList;

    const startCount = 5;
    const buttonInnerText = ['確定', '本当に？'];
    const [buttonText, setButtonText] = useState(buttonInnerText[0]);
    const [currentP, setCurrentP] = useState(0);

    const [turnChangeCheck, setTurnChangeCheck] = useState(true);

    const [rerender, setRerender] = useState(0);

    const defaultAnnounceText = '置きたいユニットの名前のボタンを押した後、置きたいマスをクリックしてください。'
    const errorInnerText = ['配置していないユニットがあります。', '設置不可能なマスです。', 'まず設置するユニットを選択してください。'];
    const [errorText, setErrorText] = useState(defaultAnnounceText);

    const [announceMNGstate, setAnnounceMNGstate] = useState(false);

    const focusKey = 'justNoToDay';
    const massKey = 'units';

    const announceDisplayTime = 5000;

    const [readyToGame, setReadyToGame] = useState(false);

    const isReplacePhaseRef = useRef(false);

    const [startInput, setStartInput] = useState(false);

    const [displayPlayerButton, setDisplayPlayerButton] = useState(false);


    const massSize = props.size;
    const playerNum = 2;

    const getShipList = props.shipList;

    let tempMassSize = [];
    for (let p = 0; p < playerNum; p++) {
        tempMassSize[p] = [];
        for (let x = 0; x < massSize; x++) {
            tempMassSize[p][x] = [];
            for (let y = 0; y < massSize; y++) {
                tempMassSize[p][x][y] = '';
            }
        }
    }
    const [massState, setMassState] = useState(tempMassSize);

    let tempFocusSize = [];
    for (let p = 0; p < getShipList.length; p++) {
        tempFocusSize[p] = [];
        for (let i = 0; i < getShipList[p].length; i++) {
            tempFocusSize[p][i] = {
                name: getShipList[p][i],
                isSelect: false,
                isPlaced: false,
            };
        }
    }
    const [focusShip, setFocusShip] = useState(tempFocusSize);

    const forceRerender = () => {
        setRerender(rerender + 1);
    }


    const focusList = (player, ship, shipIndex) => {
        const targetShip = unitData[ship.name];
        return (
            <FocusComponent
                key={`${focusKey}${player}${ship.name}`}
                text={targetShip.name}
                active={focusShip[player][shipIndex].isSelect}
                activeBackgroundColor={targetShip.color}
                activeColor={targetShip.fontColor}
                onClick={() => {
                    focusClickFunction(player, ship)
                }}
            />
        );

    }
    const focusClickFunction = (player, ship) => {
        updateFocus(player, ship);
        forceRerender();
    }

    const updateFocus = (player, ship) => {
        const tempFocusShip = focusShip;
        tempFocusShip[player] = tempFocusShip[player]
            .map((value) => {
                const tempValue = value;
                if (tempValue.name === ship.name && !value.isSelect) {
                    tempValue.isSelect = true;
                } else {
                    tempValue.isSelect = false;
                }
                return tempValue;
            });
        setFocusShip(tempFocusShip);
    }


    const makeBoard = (player) => {
        const tempDOM = [];
        for (let x = 0; x < massSize; x++) {
            tempDOM[x] = xLineDiv(player, x);
        }
        return (
            <div>
                {tempDOM}
            </div>
        );
    }

    const xLineDiv = (player, x) => {
        const tempDOM = [];
        for (let y = 0; y < massSize; y++) {
            tempDOM[y] = yLineMass(player, x, y);
        }
        return (
            <div key={`${massKey}${player}${x * 1000}`}>{tempDOM}</div>
        )
    }

    const yLineMass = (player, x, y) => {
        const targetMass = massState[player][x][y];
        const getUnitTargetMass = innerNameCheck(targetMass) ? unitData[targetMass] : { color: 'white', fontColor: 'black' }
        return (
            <MassComponent
                key={`${massKey}${player}${x * 10 + y}`}
                active={massState[player][x][y] !== ''}
                activeBackgroundColor={getUnitTargetMass.color}
                activeColor={getUnitTargetMass.fontColor}
                onClick={() => { massButtonFunction(player, x, y) }}
            />
        );
    }
    const innerNameCheck = (name) => {
        return name !== '';
    }


    const massButtonFunction = (player, x, y) => {
        if (getFocusIsUndefined(player)) {
            console.warn('フォーカスしている船がありません');
            flashErrorMessage(2);
            return;
        }
        const focusedShip = getFocusShipName(player);
        const dupliCheck = duplicateClick(player, x, y, focusedShip);
        if (!shipMassCheck(player, x, y, focusedShip) & !dupliCheck) {
            console.warn('何かの船と干渉しているか、盤外にはみ出しています');
            flashErrorMessage(1);
            return;
        };

        settingShipToMass(player, x, y, focusedShip);
        forceRerender();

    }

    const getFocusIsUndefined = (player) => {
        return !focusShip[player].map((value) => { return value.isSelect }).includes(true)
    }

    const getFocusShipName = (player) => {
        return focusShip[player]
            .map((value) => {
                if (value.isSelect) {
                    return value.name;
                } else {
                    return '';
                }
            })
            .filter((value) => {
                return value !== '';
            })[0];
    }

    const shipMassCheck = (player, x, y, ship) => {
        for (let xb = 0; xb < unitData[ship].size[0]; xb++) {
            for (let yb = 0; yb < unitData[ship].size[1]; yb++) {
                const nx = x + xb;
                const ny = y + yb;
                if (isOutOfRange(player, nx, ny)) {
                    return false;
                }
                if (massState[player][nx][ny] !== '' && massState[player][nx][ny] !== ship) {
                    return false;
                }
            }
        }
        return true;
    }

    const isOutOfRange = (player, x, y) => {
        const playerRange = massState.length;
        if (player < 0 || player >= playerRange) {
            return true;
        }
        const xRange = massState[player].length;
        if (x < 0 || x >= xRange) {
            return true;
        }
        const yRange = massState[player][x].length;
        if (y < 0 || y >= yRange) {
            return true;
        }
        return false;
    }

    const duplicateClick = (player, x, y, ship) => {
        return massState[player][x][y] === ship;
    }

    const settingShipToMass = (player, x, y, ship) => {
        let tempShipList = focusShip;
        let tempMass = massState;
        const dupliCheck = duplicateClick(player, x, y, ship)
        targetShipClear(player, ship);
        for (let xb = 0; xb < unitData[ship].size[0]; xb++) {
            for (let yb = 0; yb < unitData[ship].size[1]; yb++) {
                const nx = x + xb;
                const ny = y + yb;
                if (isOutOfRange(player, nx, ny)) {
                    continue;
                }
                if (tempMass[player][nx][ny] === '' || tempMass[player][nx][ny] === ship) {
                    tempMass[player][nx][ny] = dupliCheck ? '' : ship;
                }
            }
        }
        const targetFocusShipIndex = tempShipList[player].map((value) => { return value.name }).indexOf(ship);

        tempShipList[player][targetFocusShipIndex].isPlaced = !dupliCheck;

        setFocusShip(tempShipList);
        setMassState(tempMass);
    }

    const targetShipClear = (player, ship) => {
        let tempMass = massState;
        tempMass[player] = tempMass[player].map((value) => {
            return value.map((innerValue) => {
                if (innerValue === ship) {
                    return '';
                } else {
                    return innerValue;
                }
            })
        });
        setMassState(tempMass);
    }

    const messageDupliBGCRef = useRef(0);
    const messageDupliTXTRef = useRef(0);
    const flashErrorMessage = (textIndex) => {
        setErrorText(errorInnerText[textIndex]);
        setAnnounceMNGstate(true);
        messageDupliTXTRef.current++;
        messageDupliBGCRef.current++;
        setTimeout(() => {
            messageDupliBGCRef.current--;
            if (messageDupliBGCRef.current === 0) {

                setAnnounceMNGstate(false);
            }
        }, announceDisplayTime / 10)
        setTimeout(() => {
            messageDupliTXTRef.current--;
            if (messageDupliTXTRef.current === 0) {
                setErrorText(defaultAnnounceText);
            }
        }, announceDisplayTime);
    }

    const fillCheck = (player) => {
        const placedChecking = focusShip[player].map(value => value.isPlaced).includes(false);
        return placedChecking;
    }


    const confirmButtonFunction = () => {
        if (isReplacePhaseRef.current) {
            isReplacePhaseRef.current = false;
            setTurnChangeCheck(true);
            setDisplayPlayerButton(true);
            return;
        }
        if (turnChangeCheck) {
            if (buttonText === buttonInnerText[0]) {
                setButtonText(buttonInnerText[1]);
            } else {
                setButtonText(buttonInnerText[0]);
                setTurnChangeCheck(false);
            };
        } else {
            if (fillCheck(currentP)) {
                console.warn('設置していない船があります');
                flashErrorMessage(0);
                setButtonText(buttonInnerText[0]);
                return;
            };
            if (buttonText === buttonInnerText[0] && readyToGame) {
                setButtonText(buttonInnerText[1]);
            } else {
                setButtonText(buttonInnerText[0]);
                if (currentP >= massState.length - 1) {
                    setTurnChangeCheck(true);
                    setErrorText(defaultAnnounceText);
                    setReadyToGame(true);
                    setDisplayPlayerButton(true);
                    return;
                }
                setCurrentP(turnRoll(currentP));
                setTurnChangeCheck(true);
            }
        }
    }



    const turnRoll = (current) => {
        if (current === 0) {
            return 1;
        } else {
            return 0;
        }
    }

    const mainDisplayChange = () => {

        const tempDOM = [];
        for (let i = 0; i < focusShip[currentP].length; i++) {
            tempDOM[i] = focusList(currentP, focusShip[currentP][i], i);
        }

        if (turnChangeCheck) {
            if (readyToGame) {
                return (
                    <div className='BoardAdv_info'>
                        <p>ゲームを始める準備が整いました。ゲームを開始する場合は確定ボタンを、ユニットの配置を変更したい場合は対応するプレイヤーのボタンをクリックしてください。</p>
                    </div>
                );
            } else {
                return (
                    <div className='BoardAdv_info'>
                        <p>{currentP + 1}Pのユニット配置を行います。対象のプレイヤー以外は配置が完了するまで画面から目を離してください。誰もカンニングしていないことを確認したら、確定ボタンを押してユニットの配置を開始してください。</p>
                    </div>
                );
            }
        } else {
            return (
                <div className='BoardAdv_place'>
                    <animated.div className='BoardAdv_announce' style={announceStyleSpring}>
                        {errorText}
                    </animated.div>
                    <div className='BoardAdv_focus'>
                        {tempDOM}
                    </div>
                    <div className='BoardAdv_board'>
                        {makeBoard(currentP)}
                    </div>
                </div>
            );
        }

    }
    const announceStyleSpring = useSpring({
        backgroundColor: announceMNGstate ? 'red' : '#1D1E22'
    })

    const startGameFunction = () => {
        if (buttonText === buttonInnerText[0]) {
            setButtonText(buttonInnerText[1]);
        } else {
            setStartInput(true);
            for (let i = 0; i < startCount + 1; i++) {
                setTimeout(() => {
                    setButtonText(`開始まで${startCount - i}秒`);
                    if (i >= startCount) {
                        setTimeout(() => {
                            setButtonText('まもなく開始！');
                            setTimeout(() => {
                                props.goingGame(massState);
                            }, 2500);

                        }, 1000);
                    }
                }, i * 1000);
            }

        }
    }
    const replaceFunction = (player) => {
        isReplacePhaseRef.current = true;
        setCurrentP(player);
        setTurnChangeCheck(false);
        setDisplayPlayerButton(false);
    }

    const playerReplaceButton = () => {
        const tempDOM = [];
        for (let i = 0; i < massState.length; i++) {
            tempDOM[i] = (
                <animated.button
                    className='button'
                    key={`${focusKey}${i * 3000}`}
                    onClick={() => {
                        if (startInput) {
                            console.warn('ゲーム開始のカウントダウン中です');
                            return;
                        }
                        replaceFunction(i);
                    }}
                >
                    {i + 1}P
                </animated.button>);
        }

        return (
            <div className='BoardAdv_button' >
                <animated.button
                    className='button'
                    onClick={() => {
                        if (startInput) {
                            console.warn('ゲーム開始のカウントダウン中です');
                            return;
                        }
                        if (readyToGame && !isReplacePhaseRef.current) {
                            startGameFunction();
                        } else {
                            confirmButtonFunction();
                        }
                    }}
                >
                    {buttonText}
                </animated.button>
                {displayPlayerButton ? tempDOM : (<span></span>)}
            </div>
        );
    }

    return (
        <div className='BoardAdv mainWrapper'>
            {mainDisplayChange()}
            {playerReplaceButton()}
        </div>
    );
}
