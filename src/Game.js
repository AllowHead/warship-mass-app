import { useState } from "react"
import { BoardAdv } from "./BoardAdv";
import { Result } from "./Result";
import { UnitSelect } from "./UnitSelect";
import { War } from "./War";

export const Game = (props) => {

    const [gamePhase, setGamePhase] = useState([0, null]);
    const whiteBoard = (data) => {
        setGamePhase([1, data]);
    }
    const blackBoard = (data) => {
        setGamePhase([2, data]);
    }
    const greyBoard = (data) => {
        setGamePhase([3, data])
    }


    switch (gamePhase[0]) {
        case 0:
            return (
                <UnitSelect setting={props.setting} goingBoard={whiteBoard} />
            );
        case 1:
            return (
                <BoardAdv size={10} shipList={gamePhase[1]} goingGame={blackBoard} />
            );
        case 2:
            return (
                <War setting={props.setting} mass={gamePhase[1]} goingResult={greyBoard} />
            );
        case 3:
            return (
                <Result setting={props.setting} achievement={gamePhase[1]} />
            );
        default:
            return (<div>ゲームシーンの移行にエラー発生？</div>);
    }
}