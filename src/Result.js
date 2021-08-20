import { useState } from "react";
import { animated, useSpring } from "react-spring";
import { ResultInfo } from "./components/ResultInfo";

export const Result = (props) => {
    const winer = 1 - props.achievement.lose;

    const [displayP, setDisplayP] = useState(winer);

    const [firstClick, setFirstClick] = useState(true);

    const resultP = (player) => {
        return (
            <ResultInfo
                fireC={props.achievement.fireCount[player]}
                hitC={props.achievement.hitCount[player]}
                skillNum={props.achievement.skillUsed[player]}
                lost={props.achievement.firstLost[player]}
                destroyed={props.achievement.firstLost[1 - player]}
                skillACT={props.setting.skillSetting}
            />
        );
    }

    const buttonFuntion = (player) => {
        setDisplayP(player);
    }

    const buttonStyle1P = useSpring({
        background: displayP === 0 ? 'blue' : 'white',
        color: displayP === 0 ? 'white' : 'black',
    });

    const buttonStyle2P = useSpring({
        background: displayP === 1 ? 'blue' : 'white',
        color: displayP === 1 ? 'white' : 'black',
    });

    const recallBackToTitle = () => {
        if (firstClick) {
            setFirstClick(false);
            setTimeout(() => { setFirstClick(true) }, 5000);
        } else {
            document.location.reload();
        }

    }

    return (
        <div className='Result mainWrapper'>
            <h2 className='Result_title'>{winer + 1}Pの勝利！</h2>
            <div className='Result_picker'>
                <animated.p style={buttonStyle1P} onClick={() => { buttonFuntion(0) }}>1P</animated.p>
                <animated.p style={buttonStyle2P} onClick={() => { buttonFuntion(1) }}>2P</animated.p>
            </div>
            <div className='Result_data'>
                <p>経過ターン数:{props.achievement.turn}</p>
                {resultP(displayP)}
            </div>
            <button className='Result_reload' onClick={recallBackToTitle}>
                {firstClick ? 'タイトルに戻る' : '本当に？'}
            </button>
        </div>
    )
}