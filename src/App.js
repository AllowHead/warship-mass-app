import { useRef, useState } from "react"
import { Game } from "./Game";
import { Title } from "./Title"


export const App = () => {
    const [game, setGame] = useState(false);
    const settingRef = useRef({});

    if (game) {
        return (
            <Game setting={settingRef.current} />
        )
    } else {
        return (
            <Title onClick={(value) => { settingRef.current = value; setGame(true) }} />
        )
    }
}
