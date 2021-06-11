import React, {useEffect, useRef, useState } from 'react';

import './App.css';
import { SelfieMaker } from './SelfieMaker';

function App() {
    const CANVAS_HEIGHT = 640;
    const CANVAS_WIDTH = 400;
    const canvas = useRef<HTMLCanvasElement>(null)
    const video = useRef<HTMLVideoElement>(null)
    const img_saving = useRef<HTMLImageElement>(null)
    const logoAegeanImg = useRef<HTMLImageElement>(null)
    const logoDisplayImg = useRef<HTMLImageElement>(null)
    const redSquare = useRef<HTMLImageElement>(null)
    const debugPanel = useRef<HTMLDivElement>(null);
    const btn_save = useRef<any>(null)
    
    const [chooseCamera, setChooseCamera] = useState("user");
    const [cameras , setCameras ] = useState<Array<MediaDeviceInfo>>()
    const contrain = {
        audio: false,
        video: {
            width: 1280,
            height: 720,
            facingMode: chooseCamera
        }
    }

    function getChooseCamera(e: any) {
        setChooseCamera(e.target.value);
    }
    async function getCameras(selfieMaker: SelfieMaker){
        const devices = async () => await selfieMaker.getCameras();
        const deviceList = await devices();
        if (deviceList) {
            const cameraList = deviceList.devicesInfo.filter( device => device.kind === 'videoinput')
            if (cameraList){
                setCameras(cameraList)
            }
            if (debugPanel.current) {
                debugPanel.current.innerHTML = deviceList.devicesInfo.map(d => d.kind).join();
                debugPanel.current.innerHTML += deviceList.constraints.facingMode;
            }
        }
    }
    useEffect(() => {
        const canvasContext = canvas.current!.getContext('2d');

        const selfieMaker = new SelfieMaker(canvasContext!);
        getCameras(selfieMaker);
        
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
        
        canvas.current!.addEventListener("mouseup", async (e) => {
            const { left, top } = canvas.current!.getBoundingClientRect();
            const stamp = { x: e.clientX - left, y: e.clientY - top};
            selfieMaker.addStamp(stamp);


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
            <select placeholder="--Choose your camera--" onChange={(e) => {getChooseCamera(e);  }} style={{ width: 150, margin: "auto" }} name="camera" id="camera-select">
                {cameras?.map(camera => <option value={camera.deviceId}>
                    {camera.deviceId}-{camera.groupId}-{camera.kind}-{camera.label}
                </option>)}
            </select>
            <video id="video" style={{display: "none"}} ref={video} playsInline autoPlay/>
            <div className="test">
                <button  onClick={saveImage} ref={btn_save} className="button-save"/>
                <canvas ref={canvas}/>
                <img alt="" ref={img_saving} src="" className={"image-saving"}
                     style={{width: CANVAS_WIDTH, height: CANVAS_HEIGHT}}/>
            </div>
            <div ref={debugPanel} />
        </div>
    );
}

export default App;

