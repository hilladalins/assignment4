
var brush = {
    color: "black",
    shape: "circle"
}

var brushColor = "black";
var canvas = document.getElementById("canvas");
var mouseFlag = false;
var circleButton = document.getElementById("circle");
var squareButton = document.getElementById("square");
var eraserButton = document.getElementById("eraser");
var range = document.getElementById("range");
var zCounter = 0;




var colorButtons = document.getElementsByClassName("color");
for (var i = 0; i < colorButtons.length; i++) {
    colorButtons[i].addEventListener("click", changeColor);
}

window.addEventListener("mousedown", changeMouseFlag);
window.addEventListener("mouseup", changeMouseFlag);
canvas.addEventListener("mousemove", painting);
circleButton.addEventListener("click", changeShape);
squareButton.addEventListener("click", changeShape);
eraserButton.addEventListener("click", () => { brush.color = "white" });


function changeShape(e) {
    if (e.target.id === "circle") {
        brush.shape = "circle"
    }
    else {
        brush.shape = "square"
    }
}

function changeMouseFlag(e) {
    if (e.type === "mousedown") {
        mouseFlag = true;
    }
    else if (e.type === "mouseup") {
        mouseFlag = false;
    }
}


function changeColor(e) {
    for (var i = 0; i < colorButtons.length; i++) {
        if (colorButtons[i].classList.contains("active")) {
            colorButtons[i].classList.remove("active");
            break;
        }
    }
    e.target.classList.add("active");
    brush.color = window.getComputedStyle(e.target).getPropertyValue("background-color");
}

function painting(e) {
    if (e.target.id != "canvas") {
        return;
    }
    else if (mouseFlag === true) {
        var newPatch = document.createElement("div");
        newPatch.style.position = "absolute"
        newPatch.style.top = (e.clientY - canvas.getBoundingClientRect().y) + "px";
        newPatch.style.left = (e.clientX - canvas.getBoundingClientRect().x) + "px";
        newPatch.style.backgroundColor = brush.color;
        newPatch.style.height = range.value + "px";
        newPatch.style.width = range.value + "px";
        newPatch.style.zIndex = zCounter;
        zCounter++;
        if (brush.shape === "circle") {
            newPatch.style.borderRadius = "100%";
        }
        canvas.appendChild(newPatch);
        newPatch.addEventListener("mousemove", painting);
    }
    else {
        return;
    }
}