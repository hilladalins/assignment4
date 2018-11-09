var paint = {}
paint.colors = ["black", "grey", "darkgrey", "white", "darkred", "brown", "red", "orange", "green",  "lime", "gold", "yellow", "indigo", "navy", "teal", "turquoise",  "purple", "deeppink", "salmon", "coral"];
paint.brushes = document.querySelectorAll("#side-menu button");
paint.canvas = document.getElementById("canvas");
paint.sizeRange = document.getElementById("range");

paint.start = function () {
    paint.bindMenuButtons();
    paint.generateSideColorsButtons();
    paint.bindSideButtons();
    paint.bindGeneral();
    paint.setDefaults();
}

paint.bindMenuButtons = function () {
    var newBtn = document.getElementById("new");
    newBtn.addEventListener("click", paint.newPaint);
    var saveBtn = document.getElementById("save");
    saveBtn.addEventListener("click", paint.savePaint);
    var loadBtn = document.getElementById("load");
    loadBtn.addEventListener("click", paint.loadPaint);
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
        color.style.margin= "0 auto";
        colorButtonsWrap.appendChild(button);
        button.appendChild(color);
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
    paint.zCounter = 0;
}

paint.newPaint = function(){
    paint.canvas.style.backgroundColor = "white";
    paint.canvas.innerHTML = "";
}

paint.savePaint = function(){
    var paintName = prompt("Give a name to your paint:");
    var savedPaint ={};
    savedPaint.name = paintName;
    savedPaint.backgroundColor = paint.canvas.style.backgroundColor;
    savedPaint.paintedElements = [];
    var allElements = document.querySelectorAll("#canvas div");
    for (var i=0; i<allElements.length; i++){
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
    alert ("Paint Saved");
}

paint.changeColor = function (e) {
    document.getElementById(paint.selectedColor).classList.remove("active");
    paint.selectedColor = e.target.id;
    document.getElementById(paint.selectedColor).classList.add("active");
}


paint.changeBrush = function (e) {
    if (document.getElementById("eraser").classList.contains("active")){
        paint.canvas.classList.remove("eraser-cursor");
    }
    if (document.getElementById("can").classList.contains("active")){
        paint.canvas.classList.remove("fill-cursor");
    }
    document.getElementById(paint.selectedBrush).classList.remove("active");
    paint.selectedBrush = e.currentTarget.id;
    document.getElementById(paint.selectedBrush).classList.add("active");
    if (paint.selectedBrush === "eraser"){
        paint.canvas.classList.add("eraser-cursor");
    }
    if (paint.selectedBrush === "can"){
        paint.canvas.classList.add("fill-cursor");
    }
}


paint.changeWidth = function (e) {
    document.getElementById("thickness-value").innerHTML = e.target.value + "px";
    paint.selectedWidth = e.target.value;
}


paint.painting = function (e) {
    if (paint.selectedBrush === "can"){
        if (e.type === "click"){
            paint.canvas.style.backgroundColor = paint.selectedColor;
            return;
        }
        return;
    }
    var topLimit = paint.canvas.getBoundingClientRect().y + 500  - paint.selectedWidth;
    var leftLimit = paint.canvas.getBoundingClientRect().x + 500  - paint.selectedWidth;
    if (e.type === "mousemove" && e.buttons != 1 || e.clientY > topLimit || e.clientX > leftLimit) {
        return;
    }
    var newPatch = document.createElement("div");
    newPatch.style.position = "absolute";
    newPatch.style.top = (e.clientY - paint.canvas.getBoundingClientRect().y) + "px";
    newPatch.style.left = (e.clientX - paint.canvas.getBoundingClientRect().x) + "px";
    if (paint.selectedBrush === "eraser"){
        newPatch.style.backgroundColor = "white"
    }
    else {
        newPatch.style.backgroundColor = paint.selectedColor;
    }
    newPatch.style.height = paint.selectedWidth + "px";
    newPatch.style.width = paint.selectedWidth + "px";
    newPatch.style.zIndex = paint.zCounter;
    paint.zCounter++;
    if (paint.selectedBrush === "circle") {
        newPatch.style.borderRadius = "100%";
    }
    paint.canvas.appendChild(newPatch);
}

paint.start();