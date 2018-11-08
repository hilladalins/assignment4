var paint = {}
paint.colors = ["black", "red", "green", "blue", "yellow", "pink", "purple", "orange"];
paint.brushes = ["circle", "square"];
paint.canvas = document.getElementById("canvas");
// paint.can = document.getElementById("can");
paint.sizeRange = document.getElementById("range");
paint.eraser = document.getElementById("eraser");

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
        var color = document.createElement("div");
        color.classList.add("color");
        color.id = paint.colors[i]
        color.style.backgroundColor = paint.colors[i];
        colorButtonsWrap.appendChild(color);
    }
}

paint.bindSideButtons = function () {
    for (var i = 0; i < paint.colors.length; i++) {
        document.getElementsByClassName("color")[i].addEventListener("click", paint.changeColor);
    }
    for (var i = 0; i < paint.brushes.length; i++) {
        document.getElementsByClassName("brush")[i].addEventListener("click", paint.changeBrush);
    }
    paint.eraser.addEventListener("click", () => { paint.selectedColor = "white" });
    // paint.can.addEventListener("click", paint.changeBackgroundColor);
    paint.sizeRange.addEventListener("change", paint.changeWidth);
}

paint.bindGeneral = function () {
    window.addEventListener("mousedown", paint.changeMouseFlag);
    window.addEventListener("mouseup", paint.changeMouseFlag);
    paint.canvas.addEventListener("mousemove", paint.painting);
}

paint.setDefaults = function () {
    paint.selectedColor = paint.colors[0];
    document.getElementsByClassName("color")[0].classList.add("active");
    paint.selectedBrush = paint.brushes[0];
    paint.selectedWidth = "20";
    paint.zCounter = 0;
}

paint.changeColor = function (e) {
    document.getElementById(paint.selectedColor).classList.remove("active");
    paint.selectedColor = e.target.id;
    document.getElementById(paint.selectedColor).classList.add("active");
}


paint.changeBrush = function (e) {
    paint.selectedBrush = e.target.id;
}


paint.changeWidth = function (e) {
    document.getElementById("thickness-value").innerHTML = e.target.value + "px";
    paint.selectedWidth = e.target.value;
}


paint.painting = function (e) {
    var topLimit = paint.canvas.getBoundingClientRect().y + 500 - paint.selectedWidth;
    var leftLimit = paint.canvas.getBoundingClientRect().x + 500 - paint.selectedWidth;
    if (e.buttons != 1 || e.clientY > topLimit || e.clientX > leftLimit) {
        return;
    }
    var newPatch = document.createElement("div");
    newPatch.style.position = "absolute";
    newPatch.style.top = (e.clientY - paint.canvas.getBoundingClientRect().y) + "px";
    newPatch.style.left = (e.clientX - paint.canvas.getBoundingClientRect().x) + "px";
    newPatch.style.backgroundColor = paint.selectedColor;
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