import React, { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
    async function init() {
        const contrain = {
            audio: false,
            video: {
                width: 1280,
                height: 720,
            }
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia(contrain);
            //handleSucces(stream);
            console.log(stream)
        } catch (e) {
            alert(e);
        }
    }
    //function handleSucces(stream: MediaStream) {
    //    window.stream = stream;
    //    video.srcObject = stream;
    //}
    const CANVAS_HEIGHT = 640;
    const CANVAS_WIDTH = 400;
    const canvas = useRef<HTMLCanvasElement>(null)
    let context : CanvasRenderingContext2D | null; 
    const [elapsed, setTime] = useState(0);
    let counter = 0;
    let animationFrame: number;
    let start: number;
    function loop() {
        animationFrame = requestAnimationFrame(onFrame);
        context!.fillStyle = "white";
        context?.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        context!.fillStyle = "black";
        context?.fillRect(counter, counter,50,50)
    }
    // Function to be executed on each animation frame
    function onFrame() {
        counter++;
        setTime(Date.now() - start);
        loop();
    }
    useEffect(()=> {
        init();
        context = canvas.current!.getContext('2d')
        canvas.current!.height = CANVAS_HEIGHT;
        canvas.current!.width = CANVAS_WIDTH;
        loop()
    }, []);
    
  return (
    <div className="App">
        <canvas ref={canvas}/>
    </div>
  );
}

export default App;
