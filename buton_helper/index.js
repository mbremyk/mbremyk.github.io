const zoomScale = 0.01;

let cnv;
let ctx;
let img;
let canvasOffset;
let offsetX;
let offsetY;
let numOuterEdge;
let numOuterVisibleEdge;
let numEdgeBack;
let numEdgeFront;

let imgX = 0, imgY = 0;
let dragStartX, dragStartY, imgXStart, imgYStart;
let zoom = 1;

let radius_outer_edge = 330;
let radius_outer_visible_edge = 305;
let radius_edge_back = 280;
let radius_edge_front = 270;
let isDragging = false;

let setup = () => {
    let file_selector = document.getElementById('file-selector');
    file_selector.onchange = handleFileSelect;
    cnv = document.getElementById('canvas');
    ctx = cnv.getContext('2d');
    offsetX = cnv.offsetLeft;
    offsetY = cnv.offsetTop;

    cnv.onmousedown = handleCanvasMouseDown;
    cnv.onmouseup = handleCanvasMouseUp;
    cnv.onmousemove = handleCanvasMouseMove;
    cnv.onwheel = handleCanvasScroll;

    numOuterEdge = document.getElementById('outer-edge');
    numOuterVisibleEdge = document.getElementById('outer-visible-edge');
    numEdgeBack = document.getElementById('edge-back');
    numEdgeFront = document.getElementById('edge-front');

    numOuterEdge.oninput = handleNumbersChange;
    numOuterVisibleEdge.oninput = handleNumbersChange;
    numEdgeBack.oninput = handleNumbersChange;
    numEdgeFront.oninput = handleNumbersChange;
};

let draw = () => {
    clear();
    if (img) {
        ctx.drawImage(img, imgX, imgY, img.width * zoom, img.height * zoom);
    }
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.arc(400, 400, radius_outer_edge, 0, 2 * Math.PI, false);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(400, 400, radius_outer_visible_edge, 0, 2 * Math.PI, false);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(400, 400, radius_edge_back, 0, 2 * Math.PI, false);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(400, 400, radius_edge_front, 0, 2 * Math.PI, false);
    ctx.stroke();
};

let clear = () => {
    ctx.clearRect(0, 0, cnv.width, cnv.height);
};

let handleFileSelect = e => {
    let file = e.target.files[0];
    if (!file) {
        console.error('Something went wrong');
        clear();
        return;
    }
    let reader = new FileReader();
    if (!reader) {
        console.error('Something went wrong');
        clear();
        return;
    }
    reader.readAsDataURL(file);

    reader.onload = e => {
        let content = e.target.result;
        img = new Image();
        img.onload = handleImageLoad;
        img.src = content;
    };
};

let handleImageLoad = e => {
    draw();
};

let handleCanvasMouseDown = e => {
    console.log(e.clientX, e.clientY);
    dragStartX = e.clientX - offsetX;
    dragStartY = e.clientY - offsetY;
    imgXStart = imgX;
    imgYStart = imgY;
    isDragging = true;
};

let handleCanvasMouseUp = e => {
    isDragging = false;
};

let handleCanvasMouseMove = e => {
    if (isDragging) {
        let diffX = dragStartX - (e.clientX - offsetX);
        let diffY = dragStartY - (e.clientY - offsetY);
        imgX = imgXStart - diffX;
        imgY = imgYStart - diffY;
        draw();
    }
};

let handleCanvasScroll = e => {
    e.preventDefault();
    let dir = e.deltaY > 0 ? -1 : (e.deltaY < 0 ? 1 : 0);
    zoom += dir * zoomScale;
    draw();
};

let handleNumbersChange = e => {
    radius_outer_edge = parseInt(numOuterEdge.value) * 5;
    radius_outer_visible_edge = parseInt(numOuterVisibleEdge.value) * 5;
    radius_edge_back = parseInt(numEdgeBack.value) * 5;
    radius_edge_front = parseInt(numEdgeFront.value) * 5;
    console.log(radius_outer_edge, radius_outer_visible_edge, radius_edge_back, radius_edge_front)
    draw();
};

window.onload = e => {
    setup();
    draw();
};