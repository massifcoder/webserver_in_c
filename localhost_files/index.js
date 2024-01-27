// Defined my all global variables.
const canvas = document.querySelector("canvas"),
    toolBtns = document.querySelectorAll(".dabba"),
    fillColor = document.querySelector("#fill-color"),
    sizeSlider = document.querySelector("#size-slider"),
    colorBtns = document.querySelectorAll(".colours"),
    colorPicker = document.querySelector("#color-picker"),
    clearCanvas = document.querySelector(".clear-canvas"),
    saveImg = document.querySelector(".save-img"),
    ctx = canvas.getContext("2d");


// global variables with default value for painting.
let prevMouseX, prevMouseY, snapshot,
    isDrawing = false,
    selectedTool = "brush",
    brushWidth = 5,
    selectedColor = "#000",
    x_a,
    y_a;

const setCanvasBackground = () => {
    // setting whole canvas background to white, so the downloaded img background will be white
    ctx.fillStyle = "#ffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; // setting fillstyle back to the selectedColor, it'll be the brush color
}

window.addEventListener("load", () => {
    // setting canvas width/height.. offsetwidth/height returns viewable width/height of an element
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

const drawLine = (e) => {
    ctx.beginPath(); // creating new path to draw line
    ctx.moveTo(prevMouseX, prevMouseY); // moving line to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY); // creating line according to the mouse pointer
    ctx.stroke();
}

const drawText = (e) => {
    x_a = e.offsetX, y_a = e.offsetY;
    // $('#textTool').addClass(`top-[${y_a}px] left-[${x_a}px]`);
    $('#textTool').removeClass('hidden');
    ctx.beginPath();
    ctx.font = "40px Arial";
    ctx.textAlign = "center";

};

document.querySelector('#textTool').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        // code for enter
        selectedTool = 'brush';
        ctx.fillText(textTool.value, x_a, y_a);
        textTool.value = "";
        $('#textTool').addClass('hidden');
        chaange();
    }

})

const drawRect = (e) => {
    // if fillColor isn't checked draw a rect with border else draw rect with background
    if (!fillColor.checked) {
        // creating circle according to the mouse pointer
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

const drawCircle = (e) => {
    ctx.beginPath(); // creating new path to draw circle
    // getting radius for circle according to the mouse pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); // creating circle according to the mouse pointer
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill circle else draw border circle
}

const drawTriangle = (e) => {
    ctx.beginPath(); // creating new path to draw circle
    ctx.moveTo(prevMouseX, prevMouseY); // moving triangle to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY); // creating first line according to the mouse pointer
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); // creating bottom line of triangle
    ctx.closePath(); // closing path of a triangle so the third line draw automatically
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill triangle else draw border
}

const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; // passing current mouseX position as prevMouseX value
    prevMouseY = e.offsetY; // passing current mouseY position as prevMouseY value
    ctx.beginPath(); // creating new path to draw
    ctx.lineWidth = brushWidth; // passing brushSize as line width
    ctx.strokeStyle = selectedColor; // passing selectedColor as stroke style
    ctx.fillStyle = selectedColor; // passing selectedColor as fill style
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

// Flood fill 
function floodFill(x, y, targetColor, fillColor) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const width = canvas.width;
    const height = canvas.height;
    const data = imageData.data;

    const stack = [];
    const targetRGB = getPixelColor(x, y);

    if (!isInsideCanvas(x, y, width, height)) {
        return;
    }

    stack.push([x, y]);

    while (stack.length > 0) {
        const [currentX, currentY] = stack.pop();

        if (isInsideCanvas(currentX, currentY, width, height)) {
            const pixelColor = getPixelColor(currentX, currentY);

            if (isSameColor(pixelColor, targetRGB)) {
                console.log('Color fiillling is ', fillColor);
                setPixelColor(currentX, currentY, fillColor);
                stack.push([currentX + 1, currentY]);
                stack.push([currentX - 1, currentY]);
                stack.push([currentX, currentY + 1]);
                stack.push([currentX, currentY - 1]);
            }
        }
    }

    ctx.putImageData(imageData, 0, 0);

    function isInsideCanvas(x, y, width, height) {
        return x >= 0 && y >= 0 && x < width && y < height;
    }

    function getPixelColor(x, y) {
        const index = (y * width + x) * 4;
        return [data[index], data[index + 1], data[index + 2]];
    }

    function isSameColor(color1, color2) {
        return color1[0] === color2[0] && color1[1] === color2[1] && color1[2] === color2[2];
    }

    function setPixelColor(x, y, color) {
        const index = (y * width + x) * 4;
        data[index] = color[0];
        data[index + 1] = color[1];
        data[index + 2] = color[2];
    }
}

function hexToUint8ClampedArray(hex) {
    hex = hex.replace(/^#/, '');
    const red = parseInt(hex.substring(0, 2), 16);
    const green = parseInt(hex.substring(2, 4), 16);
    const blue = parseInt(hex.substring(4, 6), 16);
    const rgba = new Uint8ClampedArray([red, green, blue, 255]);
    return rgba;
  }
  

const drawing = (e) => {
    if (!isDrawing) return; // if isDrawing is false return from here
    ctx.putImageData(snapshot, 0, 0); // adding copied canvas data on to this canvas
    if (selectedTool === "brush" || selectedTool === "eraser") {
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY); // creating line according to the mouse pointer
        ctx.stroke(); // drawing/filling line with color
    } else if (selectedTool === "rectangle") {
        drawRect(e);
    } else if (selectedTool === "circle") {
        drawCircle(e);
    } else if (selectedTool === "triangle") {
        drawTriangle(e);
    } else if (selectedTool === "line") {
        drawLine(e);
    }
    else if (selectedTool === "addText") {
        $('textTool').addClass('show');
        drawText(e);
    }
    else {
        const pixelData = ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data;
        const pd = hexToUint8ClampedArray(selectedColor);
        floodFill(e.offsetX, e.offsetY, pixelData, pd);
    }
}

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => { // adding click event to all tool option
        // removing active class from the previous option and adding on current clicked option
        selectedTool = btn.id;
        chaange();
    });
});

function chaange() {
    $('.dabba').removeClass("border-2 border-blue-600");
    if (selectedTool == 'textTool') {
        $('.dabba').removeClass('hidden');
    }
    $(`#${selectedTool}`).addClass("border-2 border-blue-600 rounded-md");
    if (canvas.classList.contains("cursor-fancy")) {
        $('#canvas').removeClass('cursor-fancy');
        $('#canvas').addClass('crosspointer');
    }
    if (selectedTool == 'eraser') {
        $('#canvas').removeClass('crosspointer');
        $('#canvas').addClass('cursor-fancy')
    }
}

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value); // passing slider value as brushSize

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => { // adding click event to all color button
        // removing selected class from the previous option and adding on current clicked option
        $('.colours').attr('stroke', 'gray');
        $(btn).attr('stroke', 'skyblue');
        $(btn).attr('stroke-width', '1');
        $('.colour').attr('fill', $(btn).attr('fill'));
        selectedColor = $(btn).attr('fill');
    });
});

colorPicker.addEventListener("change", () => {
    // passing picked color value from color picker to last color btn background
    selectedColor = colorPicker.value;
    colorPicker.parentElement.click();
    $('.colour').attr('fill', selectedColor);
});

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clearing whole canvas
    setCanvasBackground();
});

saveImg.addEventListener("click", () => {
    const link = document.createElement("a"); // creating <a> element
    link.download = `${Date.now()}.jpg`; // passing current date as link download value
    link.href = canvas.toDataURL(); // passing canvasData as link href value
    link.click(); // clicking link to download image
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);


function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
    document.querySelector(".dropbtn").classList.toggle("file");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show')
                document.querySelector(".dropbtn").classList.remove("file");
            }
        }
    }
}

function uploadImages() {
    var inp = document.createElement('input');
    inp.type = "file";
    inp.accept = "image/*";
    inp.onchange = function (event) {
        var file = event.target.files[0];
        var reader = new FileReader();

        reader.onload = function (event) {
            var image = new Image();
            image.onload = function () {
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0);
            };
            image.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };
    inp.click();
}