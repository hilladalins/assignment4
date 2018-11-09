var paint = {}
paint.colors = ["black", "grey", "darkgrey", "white", "darkred", "brown", "red", "orange", "green", "lime", "gold", "yellow", "indigo", "navy", "teal", "turquoise", "purple", "deeppink", "salmon", "coral"];
paint.brushes = document.querySelectorAll("#side-menu button");
paint.canvas = document.getElementById("canvas");
paint.sizeRange = document.getElementById("range");

paint.start = function () {
    paint.bindMenuButtons();
    paint.generateSideColorsButtons();
    paint.bindSideButtons();
    paint.bindGeneral();
    paint.setDefaults();
    paint.setCanvasSize();
}

paint.bindMenuButtons = function () {
    var newBtn = document.getElementById("new");
    newBtn.addEventListener("click", paint.newPaint);
    var saveBtn = document.getElementById("save");
    saveBtn.addEventListener("click", paint.savePaint);
    var loadBtn = document.getElementById("load");
    loadBtn.addEventListener("click", paint.loadPaint);
    var setBtn = document.getElementById("set");
    setBtn.addEventListener("click", paint.changeCanvasSize);
}

paint.generateSideColorsButtons = function () {
    var colorButtonsWrap = document.getElementById("side-menu");
    for (var i = 0; i < paint.colors.length; i++) {
        var button = document.createElement("button");
        button.title = paint.colors[i];
        button.style.border = "none";
        button.style.outline = "none";
        button.style.backgroundColor = "inherit";
        var color = document.createElement("div");
        color.classList.add("color");
        color.id = paint.colors[i];
        color.style.backgroundColor = paint.colors[i];
        color.style.margin = "0 auto";
        colorButtonsWrap.appendChild(button);
        button.appendChild(color);
    }
}

paint.setCanvasSize = function () {
    paint.canvas.style.width = paint.canvasWidth + "px";
    paint.canvas.style.height = paint.canvasHeight + "px";
    var paintedElements = document.querySelectorAll("#canvas div");
    for (var i = 0; i < paintedElements.length; i++) {
        if ((parseInt(paintedElements[i].style.top) >  parseInt(paint.canvasHeight) - parseInt(paint.selectedWidth)) ||
            (parseInt(paintedElements[i].style.left) >  parseInt(paint.canvasWidth) - parseInt(paint.selectedWidth))) {
            paint.canvas.removeChild(paintedElements[i]);
        }
    }
}

paint.bindSideButtons = function () {
    for (var i = 0; i < paint.colors.length; i++) {
        document.getElementsByClassName("color")[i].addEventListener("click", paint.changeColor);
    }
    for (var i = 0; i < paint.brushes.length; i++) {
        paint.brushes[i].addEventListener("click", paint.changeBrush);
    }
    paint.sizeRange.addEventListener("change", paint.changeWidth);
}

paint.bindGeneral = function () {
    paint.canvas.addEventListener("mousemove", paint.painting);
    paint.canvas.addEventListener("click", paint.painting);
}

paint.setDefaults = function () {
    paint.selectedColor = paint.colors[0];
    document.getElementsByClassName("color")[0].classList.add("active");
    paint.selectedBrush = paint.brushes[0].id;
    paint.brushes[0].classList.add("active");
    paint.selectedWidth = "20";
    paint.canvasWidth = "500";
    paint.canvasHeight = "500";
}

paint.newPaint = function () {
    paint.canvas.style.backgroundColor = "white";
    paint.canvas.innerHTML = "";
}

paint.savePaint = function () {
    var paintName = prompt("Give a name to your paint:");
    var savedPaint = {};
    savedPaint.name = paintName;
    savedPaint.backgroundColor = paint.canvas.style.backgroundColor;
    savedPaint.canvasWidth = paint.canvas.style.width;
    savedPaint.canvasHeigt = paint.canvas.style.height;
    savedPaint.paintedElements = [];
    var allElements = document.querySelectorAll("#canvas div");
    for (var i = 0; i < allElements.length; i++) {
        var elementStyle = {};
        elementStyle["top"] = allElements[i].style.top;
        elementStyle["left"] = allElements[i].style.left;
        elementStyle["backgroundColor"] = allElements[i].style.backgroundColor;
        elementStyle["height"] = allElements[i].style.height;
        elementStyle["width"] = allElements[i].style.width;
        elementStyle["borderRadius"] = allElements[i].style.borderRadius;
        savedPaint.paintedElements.push(elementStyle)
    }
    localStorage.setItem('paint', JSON.stringify(savedPaint));
    paint.newPaint();
    alert("Paint Saved");
}

paint.loadPaint = function () {
    var paintLoaded = localStorage.getItem("paint");
    var paintObj = JSON.parse(paintLoaded);
    paint.newPaint();
    paint.canvas.style.width = paintObj.canvasWidth;
    paint.canvas.style.height = paintObj.canvasHeight;
    paint.canvas.style.backgroundColor = paintObj.backgroundColor;
    for (var i = 0; i < paintObj.paintedElements.length; i++) {
        var styleLoaded = paintObj.paintedElements[i];
        var newPatch = document.createElement("div");
        newPatch.style.position = "absolute";
        newPatch.style.top = styleLoaded.top;
        newPatch.style.left = styleLoaded.left;
        newPatch.style.backgroundColor = styleLoaded.backgroundColor;
        newPatch.style.height = styleLoaded.height;
        newPatch.style.width = styleLoaded.width;
        newPatch.style.borderRadius = styleLoaded.borderRadius;
        paint.canvas.appendChild(newPatch);
    }
}

paint.changeCanvasSize = function (e) {
    e.preventDefault();
    var canvasSizeSelected = document.getElementById("canvas-sizes").value;
    var multiSign = " X ";
    var n = canvasSizeSelected.indexOf(multiSign);
    paint.canvasWidth = canvasSizeSelected.slice(0, n);
    paint.canvasHeight = canvasSizeSelected.slice(multiSign.length + n);
    paint.setCanvasSize();
}


paint.changeColor = function (e) {
    document.getElementById(paint.selectedColor).classList.remove("active");
    paint.selectedColor = e.target.id;
    document.getElementById(paint.selectedColor).classList.add("active");
}


paint.changeBrush = function (e) {
    if (document.getElementById("eraser").classList.contains("active")) {
        paint.canvas.classList.remove("eraser-cursor");
    }
    if (document.getElementById("can").classList.contains("active")) {
        paint.canvas.classList.remove("fill-cursor");
    }
    document.getElementById(paint.selectedBrush).classList.remove("active");
    paint.selectedBrush = e.currentTarget.id;
    document.getElementById(paint.selectedBrush).classList.add("active");
    if (paint.selectedBrush === "eraser") {
        paint.canvas.classList.add("eraser-cursor");
    }
    if (paint.selectedBrush === "can") {
        paint.canvas.classList.add("fill-cursor");
    }
}


paint.changeWidth = function (e) {
    document.getElementById("thickness-value").innerHTML = e.target.value + "px";
    paint.selectedWidth = e.target.value;
}


paint.painting = function (e) {
    if (paint.selectedBrush === "can") {
        if (e.type === "click") {
            paint.canvas.style.backgroundColor = paint.selectedColor;
            return;
        }
        return;
    }
    var topLimit = paint.canvas.getBoundingClientRect().y + parseInt(paint.canvasHeight) - parseInt(paint.selectedWidth);
    var leftLimit = paint.canvas.getBoundingClientRect().x + parseInt(paint.canvasWidth) - parseInt(paint.selectedWidth);
    if (e.type === "mousemove" && e.buttons != 1 || e.clientY > topLimit || e.clientX > leftLimit) {
        return;
    }
    var newPatch = document.createElement("div");
    newPatch.style.position = "absolute";
    newPatch.style.top = (e.clientY - paint.canvas.getBoundingClientRect().y) + "px";
    newPatch.style.left = (e.clientX - paint.canvas.getBoundingClientRect().x) + "px";
    if (paint.selectedBrush === "eraser") {
        newPatch.style.backgroundColor = paint.canvas.style.backgroundColor;
    }
    else {
        newPatch.style.backgroundColor = paint.selectedColor;
    }
    newPatch.style.height = paint.selectedWidth + "px";
    newPatch.style.width = paint.selectedWidth + "px";
    if (paint.selectedBrush === "circle") {
        newPatch.style.borderRadius = "100%";
    }
    paint.canvas.appendChild(newPatch);
}

paint.start();