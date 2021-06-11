import React, {useEffect, useRef } from 'react';

import './App.css';
import { SelfieMakfer } from './SelfieMaker';

function App() {
    const CANVAS_HEIGHT = 640;
    const CANVAS_WIDTH = 400;
    
    const canvas = useRef<HTMLCanvasElement>(null)
    const video = useRef<HTMLVideoElement>(null)
    const img_saving = useRef<HTMLImageElement>(null)
    const logoAegeanImg = useRef<HTMLImageElement>(null)
    const logoDisplayImg = useRef<HTMLImageElement>(null)
    const redSquare = useRef<HTMLImageElement>(null)
    const btn_save = useRef<any>(null)

    useEffect(() => {
        const canvasContext = canvas.current!.getContext('2d');

        const selfieMaker = new SelfieMakfer(canvasContext!);
        logoAegeanImg.current!.addEventListener("click", () => {
            selfieMaker.setBufferImageSource(logoAegeanImg.current!)
        });

        logoDisplayImg.current!.addEventListener("click", () => {
            selfieMaker.setBufferImageSource(logoDisplayImg.current!)
        });
        redSquare.current!.addEventListener("click", () => {
            selfieMaker.setBufferImageSource(redSquare.current!)
        });
        
        canvas.current!.height = CANVAS_HEIGHT;
        canvas.current!.width = CANVAS_WIDTH;
        
        canvas.current!.addEventListener("mouseup", (e) => {
            const { left, top } = canvas.current!.getBoundingClientRect();
            const stamp = { x: e.clientX - left, y: e.clientY - top};
            selfieMaker.addStamp(stamp)
        });
    }, []);

    function saveImage() {
        let dataURL = canvas.current!.toDataURL("image/png").replace("image/png", "image/octet-stream");
        img_saving.current!.src = dataURL
        btn_save.current!.href = dataURL;
    }

    return (
        <div className="App">
            <div className="all-tampons">
                <img alt="logo aegean" ref={logoAegeanImg} className="logo" src="aegean-logo.png" />
                <img alt="logo display" ref={logoDisplayImg} className="logo" src="display-logo.png" />
                <img alt="logo display" ref={redSquare} className="logo" src="red-square.png" />
            </div>
            <video id="video" style={{display: "none"}} ref={video} playsInline autoPlay/>
            <div className="test">
                <button  onClick={saveImage} ref={btn_save} className="button-save"/>
                <canvas ref={canvas}/>
                <img alt="" ref={img_saving} src="" className={"image-saving"}
                     style={{width: CANVAS_WIDTH, height: CANVAS_HEIGHT}}/>
            </div>
        </div>
    );
}

export default App;
