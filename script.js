window.addEventListener('load', function () {

const canvasR = document.getElementById("myCanvas");
let ctxR = canvasR.getContext("2d");
const canvasWrapper = document.getElementById("canvasWrapper");
const previewWrapper = document.getElementById("previewWrapper");
const canvasBackground = document.getElementById("canvasBackground");

const myTheme = this.document.getElementById("myTheme");
const theme_default = 'solarized-dark';
let theme;

//canvas size
const myWidth = document.getElementById("myWidth");
const myHeight = document.getElementById("myHeight");
let width = myWidth.value;
let height = myHeight.value;

//tool
const myTool = document.getElementById("myTool");
const tool_default = 'pencil';
let tool;

//blank or img
const myBlankBtn = document.getElementById("blank");
const imgFile = document.getElementById("imgFile");

//color
const myColor = document.getElementById("myColor");
let color = myColor.value;
//line width
const myLineWidth = document.getElementById("myLineWidth");
let lineWidth = myLineWidth.value;
//opacity
const myOpacity = document.getElementById("myOpacity");
let opacity = myOpacity.value;

//new Layer / save
const newLayerBtn = document.getElementById("newLayer");
let nC = 0;
const myClearBtn = document.getElementById("clear");

//init
function init() {

    canvasR.style.width = width + "vh";
    canvasR.style.height = height + "vh";
    canvasBackground.style.width = width + "vh";
    canvasBackground.style.height = height + "vh";

    //add temporary canvas
    canvas = document.createElement("canvas");
    canvas.id = "canvasTemporary";
    canvas.style.width = width + "vh";
    canvas.style.height = height + "vh";
    canvasWrapper.appendChild(canvas);
    ctx = canvas.getContext('2d');

    //add layer canvas 
    canvasLayer = document.createElement('canvas');
    canvasLayer.style.width = width + "vh";
    canvasLayer.style.height = height + "vh";
    canvasLayer.style.display = "none";
    canvasLayer.style.zIndex = "0";
    canvasWrapper.appendChild(canvasLayer);
    ctxL = canvasLayer.getContext('2d');

    ctxR.fillStyle = "#fff";
    ctxL.fillStyle = "#fff";

    ctxR.fillRect(0, 0, canvasR.width, canvasR.height);
    ctxL.fillRect(0, 0, canvasLayer.width, canvasLayer.height);

    myTool.addEventListener('change', ev_tool_change, false);

    myTheme.addEventListener('change', ev_theme_change, false);

    // Activate the default tool.
    if (tools[tool_default]) {
        tool = new tools[tool_default]();
    }

    // Attach the mousedown, mousemove, mouseup and mouseout event listeners.
    canvas.addEventListener('mousedown', ev_canvas, false);
    canvas.addEventListener('mousemove', ev_canvas, false);
    canvas.addEventListener('mouseup', ev_canvas, false);
    canvas.addEventListener('mouseout', ev_canvas, false);

    window.addEventListener('mousemove', function (e) {
        document.getElementById('x-value').textContent = e.x;
        document.getElementById('y-value').textContent = e.y;
    });
}

function ev_canvas(ev) {

    rect = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
        scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

    ev._x = (ev.clientX - rect.left) * scaleX;
    ev._y = (ev.clientY - rect.top) * scaleY;

    // Call the event handler of the tool.
    let func = tool[ev.type];
    if (func) {
        func(ev);
    }

    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.globalAlpha = opacity;
}

// The event handler for any changes made to the tool selector.
function ev_tool_change(ev) {
    if (tools[this.value]) {
        tool = new tools[this.value]();
    }
}

function ev_theme_change(ev) {

    if (this.value == "dark") {
        document.getElementById("heading").style.backgroundColor = "rgb(48, 36, 36)";
        document.getElementById("heading").style.color = "white";
        document.getElementById("second_heading").style.backgroundColor = "rgb(48, 36, 36)";
        document.getElementById("second_heading").style.color = "white";
        document.getElementById("contentWrapper").style.backgroundColor = "rgb(63, 57, 57)";
        document.getElementById("preview").style.backgroundColor = "rgb(48, 36, 36)";
        document.getElementById("preview").style.color = "white";
        document.getElementById("previewWrapper").style.backgroundColor = "rgb(63, 57, 57)";
        document.getElementById("footer").style.backgroundColor = "rgb(48, 36, 36)";
        document.getElementById("footer").style.color = "white";
    }
    if (this.value == "solarized-dark") {
        document.getElementById("heading").style.backgroundColor = "053946";
        document.getElementById("heading").style.color = "white";
        document.getElementById("second_heading").style.backgroundColor = "053946";
        document.getElementById("second_heading").style.color = "white";
        document.getElementById("contentWrapper").style.backgroundColor = "296d7e";
        document.getElementById("preview").style.backgroundColor = "053946";
        document.getElementById("preview").style.color = "white";
        document.getElementById("previewWrapper").style.backgroundColor = "296d7e";
        document.getElementById("footer").style.backgroundColor = "053946";
        document.getElementById("footer").style.color = "white";
    }
    if (this.value == "light") {
        document.getElementById("heading").style.backgroundColor = "d27979";
        document.getElementById("heading").style.color = "black";
        document.getElementById("second_heading").style.backgroundColor = "e6b3b3";
        document.getElementById("second_heading").style.color = "black";
        document.getElementById("contentWrapper").style.backgroundColor = "d6d6d6";
        document.getElementById("preview").style.backgroundColor = "d27979";
        document.getElementById("preview").style.color = "black";
        document.getElementById("previewWrapper").style.backgroundColor = "d6d6d6";
        document.getElementById("footer").style.backgroundColor = "e6b3b3";
        document.getElementById("footer").style.color = "white";
    }
    if (this.value == "red") {
        document.getElementById("heading").style.backgroundColor = "c5170a";
        document.getElementById("heading").style.color = "white";
        document.getElementById("second_heading").style.backgroundColor = "f6665c ";
        document.getElementById("second_heading").style.color = "white";
        document.getElementById("contentWrapper").style.backgroundColor = "fbb3ae";
        document.getElementById("preview").style.backgroundColor = "c5170a";
        document.getElementById("preview").style.color = "white";
        document.getElementById("previewWrapper").style.backgroundColor = "fbb3ae";
        document.getElementById("footer").style.backgroundColor = "f6665c ";
        document.getElementById("footer").style.color = "white";
    }
}



function img_update() {
    ctxR.drawImage(canvas, 0, 0);
    ctxL.drawImage(canvas, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


// This object holds the implementation of each drawing tool.
let tools = {};

tools.eraser = function () {
    var tool = this;
    this.started = false;

    this.mousedown = function (ev) {
        tool.started = true;
        tool.x0 = ev._x;
        tool.y0 = ev._y;

        ctxR.clearRect(tool.x0, tool.y0, 0, 0);
        ctxL.clearRect(tool.x0, tool.y0, 0, 0);
    };

    this.mousemove = function (ev) {
        if (tool.started) {

            ctxR.clearRect(ev._x, ev._y, lineWidth, lineWidth);
            ctxL.clearRect(ev._x, ev._y, lineWidth, lineWidth);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    this.mouseup = function (ev) {
        if (tool.started) {
            tool.mousemove(ev);
            tool.started = false;
            img_update();
        }
    };
}


// The drawing pencil.
tools.pencil = function () {
    var tool = this;
    this.started = false;

    // This is called when you start holding down the mouse button.
    // This starts the pencil drawing.
    this.mousedown = function (ev) {
        tool.started = true;
        ctx.beginPath();
        ctx.moveTo(ev._x, ev._y);
    };


    this.mousemove = function (ev) {
        if (tool.started) {
            ctx.lineTo(ev._x, ev._y);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.stroke();
        }
    };

    this.mouseup = function (ev) {
        if (tool.started) {
            tool.mousemove(ev);
            tool.started = false;
            img_update();
        }
    };

    this.mouseout = function (ev) {
        if (tool.started) {
            tool.mousemove(ev);
            tool.started = false;
            img_update();
        }
    }
};

// The rectangle tool.
tools.rectangle = function () {
    var tool = this;
    this.started = false;

    this.mousedown = function (ev) {
        tool.started = true;
        tool.x0 = ev._x;
        tool.y0 = ev._y;
    };

    this.mousemove = function (ev) {
        if (!tool.started) {
            return;
        }

        var x = Math.min(ev._x, tool.x0),
            y = Math.min(ev._y, tool.y0),
            w = Math.abs(ev._x - tool.x0),
            h = Math.abs(ev._y - tool.y0);

        ctx.clearRect(0, 0, canvas.width, canvas.height); //important!!

        if (!w || !h) {
            return;
        }

        ctx.strokeRect(x, y, w, h);
    };

    this.mouseup = function (ev) {
        if (tool.started) {
            tool.mousemove(ev);
            tool.started = false;
            img_update();
        }
    };
};

// The square tool.
tools.square = function () {
    var tool = this;
    this.started = false;

    this.mousedown = function (ev) {
        tool.started = true;
        tool.x0 = ev._x;
        tool.y0 = ev._y;
    };

    this.mousemove = function (ev) {
        if (!tool.started) {
            return;
        }

        var x = Math.min(ev._x, tool.x0),
            y = Math.min(ev._y, tool.y0),
            w = Math.min(Math.abs(ev._x - tool.x0), Math.abs(ev._y - tool.y0)),
            h = w;

        ctx.clearRect(0, 0, canvas.width, canvas.height); //important!!

        if (!w || !h) {
            return;
        }

        ctx.strokeRect(x, y, w, h);
    };

    this.mouseup = function (ev) {
        if (tool.started) {
            tool.mousemove(ev);
            tool.started = false;
            img_update();
        }
    };
};



// The circle tool.
tools.circle = function () {
    var tool = this;
    this.started = false;

    this.mousedown = function (ev) {
        tool.started = true;
        tool.x0 = ev._x;
        tool.y0 = ev._y;
    };

    this.mousemove = function (ev) {
        if (!tool.started) {
            return;
        }

        var x = Math.min(ev._x, tool.x0),
            y = Math.min(ev._y, tool.y0),
            xm = Math.max(ev._x, tool.x0),
            ym = Math.max(ev._y, tool.y0),
            w = Math.abs(ev._x - tool.x0),
            h = Math.abs(ev._y - tool.y0),
            r = Math.max(w, h);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!r) {
            return;
        }

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.stroke();

    };

    this.mouseup = function (ev) {
        if (tool.started) {
            tool.mousemove(ev);
            tool.started = false;
            img_update();
        }
    };
};

// The line tool.
tools.line = function () {
    var tool = this;
    this.started = false;

    this.mousedown = function (ev) {
        tool.started = true;
        tool.x0 = ev._x;
        tool.y0 = ev._y;
    };

    this.mousemove = function (ev) {
        if (!tool.started) {
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.moveTo(tool.x0, tool.y0);
        ctx.lineTo(ev._x, ev._y);
        ctx.stroke();
        ctx.closePath();
    };

    this.mouseup = function (ev) {
        if (tool.started) {
            tool.mousemove(ev);
            tool.started = false;
            img_update();
        }
    };
};

tools.triangle = function () {
    var tool = this;
    this.started = false;

    this.mousedown = function (ev) {
        tool.started = true;
        tool.x0 = ev._x;
        tool.y0 = ev._y;
    };

    this.mousemove = function (ev) {
        if (!tool.started) {
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();

        var diff = Math.abs(ev._x - tool.x0);
        ctx.moveTo(tool.x0, tool.y0);
        ctx.lineTo(tool.x0 - diff, ev._y);
        ctx.lineTo(tool.x0 + diff, ev._y);
        ctx.lineTo(tool.x0, tool.y0);
        ctx.stroke();
        ctx.closePath();
    };

    this.mouseup = function (ev) {
        if (tool.started) {
            tool.mousemove(ev);
            tool.started = false;
            img_update();
        }
    };
};

//change canvas size (7:5 ratio)
myWidth.onchange = function () {

    if (myWidth.value <= 112 && myWidth.value >= 7) {

        width = myWidth.value;
        myHeight.value = myWidth.value / (7 / 5);
        height = myHeight.value;

        canvasR.style.width = width + "vh";
        canvasR.style.height = height + "vh";

        canvas.style.width = width + "vh";
        canvas.style.height = height + "vh";

        canvasLayer.style.width = width + "vh";
        canvasLayer.style.height = height + "vh";

        canvasBackground.style.width = width + "vh";
        canvasBackground.style.height = height + "vh";

    } else {
        return false;
    }
}

myHeight.onchange = function () {

    if (myHeight.value >= 5 && myHeight.value <= 80) {

        height = myHeight.value;
        myWidth.value = myHeight.value * (7 / 5);
        width = myWidth.value;

        canvasR.style.height = height + "vh";
        canvasR.style.width = width + "vh";

        canvas.style.width = width + "vh";
        canvas.style.height = height + "vh";

        canvasLayer.style.width = width + "vh";
        canvasLayer.style.height = height + "vh";

        canvasBackground.style.width = width + "vh";
        canvasBackground.style.height = height + "vh";

    } else {
        return false;
    }
}

newLayerBtn.addEventListener('click', saveLayer);

newLayerBtn.onclick = function () {
    ctxL.clearRect(0, 0, canvasLayer.width, canvasLayer.height);
}


function saveLayer() {

    nC++;

    let dataURL = canvasLayer.toDataURL();

    let myDiv = document.createElement('div');
    myDiv.classList.add("imgW");
    myDiv.id = nC;

    let newP = document.createElement('img');
    newP.classList.add('myImgP');
    newP.src = dataURL;

    let myXBtn = document.createElement('button');
    myXBtn.classList.add('myXBtn');

    let myTxtN = document.createTextNode('x');

    myXBtn.appendChild(myTxtN);
    myDiv.appendChild(myXBtn);
    myDiv.appendChild(newP);

    previewWrapper.appendChild(myDiv);

    if (nC > 0) {
        previewWrapper.insertBefore(myDiv, previewWrapper.childNodes[0]);
    }

    let myXBtns = document.getElementsByClassName("myXBtn");

    for (let i = 0; i < myXBtns.length; i++) {
        myXBtns[i].onclick = function () {
            this.parentNode.remove();
        }
    }

    let myImages = document.getElementsByClassName("myImgP");

    for (let i = 0; i < myImages.length; i++) {

        myImages[i].onclick = function () {
            myC = this;
            ctxR.drawImage(myC, 0, 0);
            ctx.drawImage(myC, 0, 0);
            ctxL.drawImage(myC, 0, 0);

            
        }
        
    }
    ctxR.clearRect(0, 0, canvasR.width, canvasR.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctxL.clearRect(0, 0, canvasLayer.width, canvasLayer.height);
    ctxR.fillStyle = "#fff";
    ctxR.fillRect(0, 0, canvasR.width, canvasR.height);
    
}


myColor.onchange = function () {
    color = myColor.value;
}

myOpacity.onchange = function () {
    opacity = myOpacity.value;
}

myLineWidth.onchange = function () {
    lineWidth = myLineWidth.value;
}

myClearBtn.onclick = function () {
    ctxR.clearRect(0, 0, canvasR.width, canvasR.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctxL.clearRect(0, 0, canvasLayer.width, canvasLayer.height);
    ctxR.fillStyle = "#fff";
    ctxR.fillRect(0, 0, canvasR.width, canvasR.height);
}

blank.onclick = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctxR.fillStyle = "#fff";
    ctxL.fillStyle = "#fff";
    ctxR.fillRect(0, 0, canvasR.width, canvasR.height);
    ctxL.fillRect(0, 0, canvasLayer.width, canvasLayer.height);
}


imgFile.onchange = function () {

    let reader = new FileReader();
    let myImg = new Image();

    reader.onloadend = function () {
        myImg.src = reader.result;
    }

    reader.readAsDataURL(this.files[0]);

    myImg.onload = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctxR.drawImage(myImg, 0, 0, canvasR.width, canvasR.height);
        ctxL.drawImage(myImg, 0, 0, canvasLayer.width, canvasLayer.height);
    }
}
init();
}, false);