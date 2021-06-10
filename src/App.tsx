import React, {useEffect, useRef, useState} from 'react';
import LogoDisplaySrc from "./asset/display-logo.png";
import LogoAegeanSrc from "./asset/aegean-logo.png";

import './App.css';

function App() {
    let stream: MediaStream;

    async function init() {
        const contrain = {
            audio: false,
            video: {
                width: 1280,
                height: 720,
            }
        }
        try {
            stream = await navigator.mediaDevices.getUserMedia(contrain);
            video.current!.srcObject = stream;
            console.log(stream)
        } catch (e) {
            alert(e);
        }
    }

    const CANVAS_HEIGHT = 640;
    const CANVAS_WIDTH = 600;
    const canvas = useRef<HTMLCanvasElement>(null)
    const video = useRef<HTMLVideoElement>(null)
    const img_saving = useRef<HTMLImageElement>(null)
    const logoAegeanImg = useRef<HTMLImageElement>(null)
    const logoDisplayImg = useRef<HTMLImageElement>(null)
    const btn_save = useRef<any>(null)

    let context: CanvasRenderingContext2D | null;
    const [elapsed, setTime] = useState(0);
    let counter = 0;
    let animationFrame: number;
    let start: number;
    type PositionMouseDownType = {
        x: number;
        y: number;
        image: CanvasImageSource;
    }
    const positionMouseDown: Array<PositionMouseDownType> = []

    function loop() {
        animationFrame = requestAnimationFrame(onFrame);
        context?.drawImage(video.current!, 0, 0, 500, 500);
        for (let i = 0; i < positionMouseDown.length; i++) {
            context?.drawImage(positionMouseDown[i].image, positionMouseDown[i].x, positionMouseDown[i].y)
        }
    }

    // Function to be executed on each animation frame
    function onFrame() {
        counter++;
        setTime(Date.now() - start);
        loop();
    }

    let Logo: HTMLImageElement;
    // logoAegeanImg.current!.addEventListener("click", () => {
    //     Logo.src = logoAegeanImg.current!.src;
    // })
    useEffect(() => {
        init();

        Logo = document.createElement("img");
        logoAegeanImg.current!.addEventListener("click", () => {
            Logo.src = logoAegeanImg.current!.src;
        })
        logoDisplayImg.current!.addEventListener("click", () => {
            Logo.src = logoDisplayImg.current!.src;
        })
        // Logo.src = "display-logo.png";
        context = canvas.current!.getContext('2d')
        canvas.current!.height = CANVAS_HEIGHT;
        canvas.current!.width = CANVAS_WIDTH;
        canvas.current!.addEventListener("mousedown", (e) => {
            positionMouseDown.push({x: e.offsetX, y: e.offsetY, image: Logo})
        })

        loop()
    }, []);

    function saveImage() {
        let dataURL = canvas.current!.toDataURL("image/png").replace("image/png", "image/octet-stream");
        img_saving.current!.src = dataURL
        btn_save.current!.href = dataURL;
    }

    return (
        <div className="App">
            <div className="all-tampons">
                <img ref={logoAegeanImg} className="logo" src={LogoAegeanSrc}/>
                <img ref={logoDisplayImg} className="logo" src={LogoDisplaySrc}/>
            </div>
            <video id="video" style={{display: "none"}} ref={video} playsInline autoPlay/>
            {/*<button onClick={saveImage}>SAVE IMAGE</button>*/}
            <div className="test">
                <a href="#" onClick={saveImage} ref={btn_save} className="button-save"/>
                <canvas ref={canvas}/>
                <img ref={img_saving} src="" className={"image-saving"}
                     style={{width: CANVAS_WIDTH, height: CANVAS_HEIGHT}}/>
            </div>
        </div>
    );
}

export default App;
