type PositionMouseDownType = {
    x: number;
    y: number;
    stampBuffer?: CanvasImageSource;
}

export enum CAMERAS {
    FRONT = "user",
    BACK = "environment"
}

export type Contrains = {
    audio: boolean,
    video: {
        width: number,
        height: number,
        facingMode: string | { exact: string }
    }
}

export class SelfieMaker {
    stream: MediaStream | undefined;
    positionMouseDown: Array<PositionMouseDownType> = []
    context: CanvasRenderingContext2D;
    bufferContext: CanvasRenderingContext2D;
;
    stampBuffer: CanvasImageSource | undefined;

    constructor(context: CanvasRenderingContext2D, contrains: Contrains) {
        this.initCamera(contrains);
        const canvasBuffer = document.createElement('canvas');
        this.bufferContext = canvasBuffer.getContext('2d')!;
        this.context = context;
        this.loop();
    }

    // async getCameras(): Promise< DeviceCompleteInformation | undefined>{
    //     try{
    //         const devicesInfo = await navigator.mediaDevices.enumerateDevices();
    //         const constraints = navigator.mediaDevices.getSupportedConstraints();
    //
    //         return {devicesInfo, constraints};
    //     } catch (e){
    //
    //     }
    // }
    async initCamera(contrains: Contrains) {

        try {
            this.stream = await navigator.mediaDevices.getUserMedia(contrains);
        } catch (e) {
            alert(e);
        }
    }

    async setBufferImageSource(source: HTMLImageElement): Promise<void> {
        this.bufferContext.clearRect(0, 0, source.width, source.height)
        this.bufferContext.drawImage(source, 0, 0)
        const buffer = this.bufferContext.getImageData(0, 0, source.width, source.height);
        this.stampBuffer = await createImageBitmap(buffer);
    }

    addStamp(stamp: PositionMouseDownType) {
        const stampBuffer = this.stampBuffer;
        if (stampBuffer) {
            this.positionMouseDown.push({...stamp, stampBuffer})
        }
    }

    loop() {
        for (let i = 0; i < this.positionMouseDown.length; i++) {
            this.context!.drawImage(this.positionMouseDown[i].stampBuffer!, this.positionMouseDown[i].x, this.positionMouseDown[i].y)
        }
        requestAnimationFrame(() => this.loop());
    }
}

