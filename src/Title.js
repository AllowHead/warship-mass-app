import { useEffect, useRef, useState } from "react"
import { Button } from "./components/Button"
import { Setting } from "./Setting";
import { useSpring, animated } from "react-spring";

export const Title = (props) => {
    const [openSetting, setOpenSetting] = useState(false);
    const [settingHeight, setSettingHeight] = useState(0);
    const targetHeight = useRef(null);

    const springStyle = useSpring({
        clipPath: openSetting ? "inset(100% 0 0 0)" : "inset(0% 0 0 0)",
        marginTop: openSetting ? -settingHeight : 0,
    });

    const settingListRef = useRef({});

    const firstRender = useRef(false);
    useEffect(() => {
        firstRender.current = true;
    }, []);
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            setOpenSetting(true);
        } else {
            setSettingHeight(targetHeight.current.clientHeight);
        }
    }, [openSetting, settingHeight])



    return (
        <div className='Title mainWrapper'>
            <div className='Title_titleCall'><img alt='なんかいい感じの画像' /></div>
            <div className='Title_settingList' ref={targetHeight}>
                <animated.div style={springStyle} >
                    <Setting open={openSetting} onClick={(value) => { settingListRef.current = value }} />
                </animated.div>
            </div>
            <Button className='button' value="スタート" onClick={() => { props.onClick(settingListRef.current) }} />
            <Button className='button' value="設定" onClick={() => {
                setOpenSetting(!openSetting);
            }} />
        </div>
    )
}
