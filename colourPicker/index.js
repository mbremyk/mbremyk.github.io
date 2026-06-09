let cnvColorPick;
let ctxColorPick;
let cnvColorBar;
let ctxColorBar;
let inputSaturation;
let inputValue;
let divChosenColor;

let baseColor = { r: 255, g: 0, b: 0 };
let hue = 100;
let saturation = 50;
let value = 50;
let colorBarGradient;
let colorBarDrag = false;
let colorPickDrag = false;
const black = { r: 0, g: 0, b: 0 };
const white = { r: 255, g: 255, b: 255 };

let main = () => {
    setup();
}

let setup = () => {
    inputSaturation = document.getElementById("inputSaturation");
    inputValue = document.getElementById("inputValue");

    inputSaturation.oninput = handleSaturationInput;
    inputValue.oninput = handleValueInput;

    divChosenColor = document.getElementById("chosenColor");

    setupColorPick();
    setupColorBar();
    drawChosenColor();
}

let setupColorPick = () => {
    cnvColorPick = document.getElementById("color-pick-canvas");
    cnvColorPick.width = cnvColorPick.height = 512;
    ctxColorPick = cnvColorPick.getContext("2d");

    cnvColorPick.addEventListener("mousedown", handleColorPickMouseDown);
    document.addEventListener("mousemove", handleColorPickMouseMove);
    document.addEventListener("mouseup", handleColorPickMouseUp);

    drawColorPick();
}

let setupColorBar = () => {
    cnvColorBar = document.getElementById("color-bar-canvas");
    cnvColorBar.height = 360;
    ctxColorBar = cnvColorBar.getContext("2d");

    colorBarGradient = ctxColorBar.createLinearGradient(0, cnvColorBar.height, 0, 0);
    colorBarGradient.addColorStop(0, "#ff0000");
    colorBarGradient.addColorStop(1 / 6, "#ffff00");
    colorBarGradient.addColorStop(2 / 6, "#00ff00");
    colorBarGradient.addColorStop(3 / 6, "#00ffff");
    colorBarGradient.addColorStop(4 / 6, "#0000ff");
    colorBarGradient.addColorStop(5 / 6, "#ff00ff");
    colorBarGradient.addColorStop(1, "#ff0000");

    cnvColorBar.addEventListener("mousedown", handleColorBarMouseDown);
    document.addEventListener("mousemove", handleColorBarMouseMove);
    document.addEventListener("mouseup", handleColorBarMouseUp);

    drawColorBar();
}

let drawColorPick = () => {

    if (false) {
        // Fill color picker with a single flat color representing the currently chosen color
        let color = HSVToRGB(hue, saturation / 100, value / 100);
        ctxColorPick.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
        ctxColorPick.fillRect(0, 0, cnvColorPick.width, cnvColorPick.height);
    } else {
        let color = HSVToRGB(hue, 1, 1);

        const grdWhiteToColor = ctxColorPick.createLinearGradient(0, 0, cnvColorPick.width, 0);
        grdWhiteToColor.addColorStop(0, "white");
        grdWhiteToColor.addColorStop(1, `rgb(${color.r}, ${color.g}, ${color.b})`);
        ctxColorPick.fillStyle = grdWhiteToColor;
        ctxColorPick.fillRect(0, 0, cnvColorPick.width, cnvColorPick.height);

        const grdBlackToTrans = ctxColorPick.createLinearGradient(0, 0, 0, cnvColorPick.height);
        grdBlackToTrans.addColorStop(0, `rgba(0,0,0,0)`);
        grdBlackToTrans.addColorStop(1, `black`);
        ctxColorPick.fillStyle = grdBlackToTrans;
        ctxColorPick.fillRect(0, 0, cnvColorPick.width, cnvColorPick.height);
    }
}

let drawColorBar = () => {
    ctxColorBar.fillStyle = colorBarGradient;
    ctxColorBar.fillRect(0, 0, cnvColorBar.width, cnvColorBar.height);

    ctxColorBar.fillStyle = "black";
    ctxColorBar.fillRect(0, cnvColorBar.height - (hue - 1), cnvColorBar.width, -3);
}

let drawChosenColor = () => {
    let color = HSVToRGB(hue, saturation / 100, value / 100);
    divChosenColor.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
}

let handleColorPickMouseDown = (e) => {
    colorPickDrag = true;
    handleColorPickMouseMove(e);
}

let handleColorPickMouseMove = (e) => {
    if (colorPickDrag) {
        let bound = cnvColorPick.getBoundingClientRect();

        let visX = e.clientX - bound.left;
        let visY = e.clientY - bound.top;
        console.log(visX, visY);
        console.log(visX / cnvColorPick.width, visY / cnvColorPick.height);



        saturation = Math.max(0, Math.min(100, ((e.clientX - bound.left) / cnvColorPick.width) * 100));
        value = 100 - Math.max(0, Math.min(100, ((e.clientY - bound.top) / cnvColorPick.height) * 100));
        drawColorPick();
        drawChosenColor();
    }
}

let handleColorPickMouseUp = (e) => {
    colorPickDrag = false;
}

let handleColorBarMouseDown = (e) => {
    colorBarDrag = true;
    handleColorBarMouseMove(e);
}

let handleColorBarMouseMove = (e) => {
    if (colorBarDrag) {
        let bound = cnvColorBar.getBoundingClientRect();
        hue = Math.floor(Math.max(0, Math.min(360, cnvColorBar.height - (e.clientY - bound.top - 7))));

        drawColorBar();
        drawColorPick();
        drawChosenColor();
    }
}

let handleColorBarMouseUp = (e) => {
    colorBarDrag = false;
}

let handleSaturationInput = (e) => {
    saturation = e.target.value;
    drawColorPick();
    drawChosenColor();
}

let handleValueInput = (e) => {
    value = e.target.value;
    drawColorPick();
    drawChosenColor();
}

let HSLToRGB = (h, s, l) => {
    if (s == 0) {
        return { r: l * 255, g: l * 255, b: l * 255 };
    }
    h = h % 360;
    let color = baseColor;
    let c = (1 - Math.abs(2 * l - 1)) * s;
    let h_m = h / 60;
    let x = c * (1 - Math.abs((h_m % 2) - 1));
    let m = l - c / 2;

    if (h_m < 1) color = { r: c, g: x, b: 0 };
    else if (h_m < 2) color = { r: x, g: c, b: 0 };
    else if (h_m < 3) color = { r: 0, g: c, b: x };
    else if (h_m < 4) color = { r: 0, g: x, b: c };
    else if (h_m < 5) color = { r: x, g: 0, b: c };
    else if (h_m < 6) color = { r: c, g: 0, b: x };

    color.r += m;
    color.g += m;
    color.b += m;

    color.r *= 255;
    color.g *= 255;
    color.b *= 255;

    return color;
}

let HSVToRGB = (h, s, v) => {
    if (s == 0) {
        return { r: v * 255, g: v * 255, b: v * 255 };
    }
    h = h % 360;
    let color = baseColor;
    let c = v * s;
    let h_m = h / 60;
    let x = c * (1 - Math.abs((h_m % 2) - 1));
    let m = v - c;

    if (h_m < 1) color = { r: c, g: x, b: 0 };
    else if (h_m < 2) color = { r: x, g: c, b: 0 };
    else if (h_m < 3) color = { r: 0, g: c, b: x };
    else if (h_m < 4) color = { r: 0, g: x, b: c };
    else if (h_m < 5) color = { r: x, g: 0, b: c };
    else if (h_m < 6) color = { r: c, g: 0, b: x };

    color.r += m;
    color.g += m;
    color.b += m;

    color.r *= 255;
    color.g *= 255;
    color.b *= 255;

    return color;
}

let lerp2dColor = (color, dx, dy) => {
    color.r = lerp(0, color.r, dy);
    color.g = lerp(0, color.g, dy);
    color.b = lerp(0, color.b, dy);

    color.r = lerp(color.r, Math.floor(dy * 255), dx);
    color.g = lerp(color.g, Math.floor(dy * 255), dx);
    color.b = lerp(color.b, Math.floor(dy * 255), dx);

    return color;
}

let lerp = (a, b, t) => {
    if (b < a) {
        let tmp = a;
        a = b;
        b = tmp;
    }
    return a + (b - a) * t;
}

window.onload = main;