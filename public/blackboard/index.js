// 画板数据栈
const globalData = [];
// 撤销的数据栈
const repealDataArr = [];
// 存储的黑板数据
const storageCanvasData = [];
// 画板控制开关
const painting = false;
// 第一个点坐标
const startPoint = { x: undefined, y: undefined };
// 黑板序号
let boardIndex = 1;

let fabCanvas;
let penColor = "";
let penSize = 2;
// 记录黑板数据
let currentState = [];
// 记录删除黑板数据
let deleteState = [];
let isAction = false;
let actionSleep = null;
const origin = { x: 0, y: 0 };
let isMoving = false;
const Broadnumber = gn("openBroadList");

init();

// 初始化画布大小
function init() {
    fabCanvas = new fabric.Canvas("canvas", {
        backgroundColor: "#293937",
        width: window.innerWidth,
        height: window.innerHeight - 50
    });
    // 禁止橡皮擦除背景色
    fabCanvas.get("backgroundColor").set({ erasable: false });
    fabCanvas.freeDrawingBrush.width = 2;
    selectPenMode();
}

move.addEventListener("mousedown", (e) => {
    origin.x = e.x;
    origin.y = e.y;
    isMoving = true;
});

move.addEventListener("mousemove", (e) => {
    if (!isMoving) return;
    const left = e.x - origin.x;
    const top = e.y - origin.y;
    origin.x = e.x;
    origin.y = e.y;
    const objects = fabCanvas.getObjects();
    objects.map((obj) => {
        obj.set({
            left: obj.left + left,
            top: obj.top + top
        });
    });
    fabCanvas.renderAll();
});

move.addEventListener("mouseup", (e) => {
    isMoving = false;
});

fabCanvas.on("object:added", function(e) {
    closeBroadList();
    brushPopup.style.display = "none";
    eraserPopup.style.display = "none";
    if (isAction) return;
    deleteState = [];
    const json = fabCanvas.toDatalessJSON(["clipPath"]);
    currentState.push(JSON.stringify(json));
    if (currentState.length > 0) {
        rescind.style.color = "#FFF";
        gn("rescindImg").src = "./ico/icon_chexiao.png";
    }
});

fabCanvas.on("object:modified", function(e) {
    if (isAction) return;
    deleteState = [];
    const json = fabCanvas.toDatalessJSON(["clipPath"]);
    currentState.push(JSON.stringify(json));
});

// 打开黑板列表
openBroadList.onclick = function() {
    const dataUrl = fabCanvas.toJSON();
    const canvasimg = fabCanvas.toDataURL();
    const data = { data: dataUrl, img: canvasimg };
    storageCanvasData[boardIndex - 1] = data;
    const canvasbroads = document.querySelectorAll(".canvas_broad");
    for (let i = 0; i < canvasbroads.length; i++) {
        canvasbroads[i].classList.remove("active");
    }
    canvasbroads[Broadnumber.innerHTML - 1].classList.add("active");
    gn("broadList").style.display = "block";
    drawboradImage();
};

function drawboradImage() {
    const broad = gn(`broad_${boardIndex}`);
    const chldEle = broad.children;
    var image = new Image();
    image.src = fabCanvas.toDataURL();
    const imgSrc = fabCanvas.toDataURL();
    if (chldEle[2]) {
        chldEle[2].src = imgSrc;
    } else {
        broad.appendChild(image);
    }
}
// 新建画板
addBtn.onclick = function() {
    const dataUrl = fabCanvas.toJSON();
    const canvasimg = fabCanvas.toDataURL();
    const data = { data: dataUrl, img: canvasimg };
    storageCanvasData[boardIndex - 1] = data;
    gn("addBroadBtn").click();
};
addBroadBtn.onclick = function() {
    clear();
    boardIndex++;
    const dataUrl = fabCanvas.toJSON();
    const canvasimg = fabCanvas.toDataURL();
    storageCanvasData.push({ data: dataUrl, img: canvasimg });
    Broadnumber.innerHTML = boardIndex;
    creatBroadlist();
    if (Broadnumber.innerHTML > 1) {
        gn("arrowLast").src = "./ico/arrow_last.png";
    } else {
        gn("arrowLast").src = "./ico/arrow_last_disabled.png";
    }
    if (boardIndex > 1 && Broadnumber.innerHTML > boardIndex) {
        gn("arrowNext").src = "./ico/arrow_next.png";
    }
};

// 选择黑板
gn("imgList").addEventListener(
    "click",
    function(event) {
        let parentTarget;
        if (event.target.className == "canvas_broad_del") {
            // 删除事件
            const deElement = event.target.parentNode;
            const delDomId = deElement.id;
            const ind = delDomId.charAt(delDomId.length - 1);
            boardIndex--;
            Broadnumber.innerHTML = boardIndex;
            const divEle = gn("imgList");
            divEle.removeChild(deElement);
            storageCanvasData.splice(ind - 1, 1);
            fabCanvas
                .loadFromJSON(storageCanvasData[boardIndex - 1].data)
                .renderAll();
            creatBroadlist();
            return;
        }
        if (event.target.className == "canvas_broad") {
            parentTarget = event.target;
        } else {
            parentTarget = event.target.parentNode;
        }
        const canvasbroads = document.querySelectorAll(".canvas_broad");
        for (let i = 0; i < canvasbroads.length; i++) {
            canvasbroads[i].classList.remove("active");
        }
        parentTarget.classList.add("active");
        const checkedDomId = parentTarget.id;
        boardIndex = checkedDomId.charAt(checkedDomId.length - 1);
        fabCanvas.loadFromJSON(storageCanvasData[boardIndex - 1].data).renderAll();
        Broadnumber.innerHTML = boardIndex;

        if (Broadnumber.innerHTML > 1) {
            gn("arrowLast").src = "./ico/arrow_last.png";
        } else {
            gn("arrowLast").src = "./ico/arrow_last_disabled.png";
        }
        if (boardIndex > 1 && Broadnumber.innerHTML < boardIndex) {
            gn("arrowNext").src = "./ico/arrow_next.png";
        } else {
            gn("arrowNext").src = "./ico/arrow_next_disabled.png";
        }
    },
    false
);

function creatBroadlist() {
    const divEle = gn("imgList");
    while (divEle.hasChildNodes()) {
    // 当divEle下还存在子节点时 循环继续
        divEle.removeChild(divEle.firstChild);
    }
    for (let i = 1; i < storageCanvasData.length + 1; i++) {
        const broadhtml = `<div id="broad_${i}" class="canvas_broad">
                        <div id="broadindex_${i}" class="canvas_broad_index">${i}</div>
                        <img id="broaddel_${1}" class="canvas_broad_del" src="./ico/btn_delete.png" />
                        <img src = "${storageCanvasData[i - 1].img}" />
                      </div>`;
        divEle.innerHTML += broadhtml;
    }

    const canvasbroads = document.querySelectorAll(".canvas_broad");
    for (let i = 0; i < canvasbroads.length; i++) {
        canvasbroads[i].classList.remove("active");
    }
    canvasbroads[Broadnumber.innerHTML - 1].classList.add("active");
    if (canvasbroads.length > 1) {
        gn("broaddel_1").style.display = "block";
    } else {
        gn("broaddel_1").style.display = "none";
    }
}

// 关闭按钮
btn_close.onclick = function() {
    closeBroadList();
};
// 隐藏黑板列表
function closeBroadList() {
    gn("broadList").style.display = "none";
}

// 上一页
arrowLast.onclick = function() {
    const dataUrl = fabCanvas.toJSON();
    const canvasimg = fabCanvas.toDataURL();
    const data = { data: dataUrl, img: canvasimg };
    storageCanvasData[boardIndex - 1] = data;
    const canvasbroads = document.querySelectorAll(".canvas_broad");
    if (boardIndex > 1) {
        boardIndex--;
        fabCanvas.loadFromJSON(storageCanvasData[boardIndex - 1].data).renderAll();
        Broadnumber.innerHTML = boardIndex;
    }
    if (Broadnumber.innerHTML <= 1) {
        gn("arrowLast").src = "./ico/arrow_last_disabled.png";
    }
    if (Broadnumber.innerHTML < canvasbroads.length) {
        gn("arrowNext").src = "./ico/arrow_next.png";
    } else {
        gn("arrowNext").src = "./ico/arrow_next_disabled.png";
    }
};
// 下一页
arrowNext.onclick = function() {
    const dataUrl = fabCanvas.toJSON();
    const canvasimg = fabCanvas.toDataURL();
    const data = { data: dataUrl, img: canvasimg };
    storageCanvasData[boardIndex - 1] = data;
    const canvasbroads = document.querySelectorAll(".canvas_broad");
    if (canvasbroads.length > 1) {
        if (boardIndex <= canvasbroads.length) {
            boardIndex++;
            fabCanvas
                .loadFromJSON(storageCanvasData[boardIndex - 1].data)
                .renderAll();
            Broadnumber.innerHTML = boardIndex;
        }
    }
    if (boardIndex == canvasbroads.length) {
        gn("arrowNext").src = "./ico/arrow_next_disabled.png";
    }
    if (Broadnumber.innerHTML > 1) {
        gn("arrowLast").src = "./ico/arrow_last.png";
    } else {
        gn("arrowLast").src = "./ico/arrow_last_disabled.png";
    }
};

// 画笔模式
function selectPenMode(colorName) {
    fabCanvas.freeDrawingBrush = new fabric.PencilBrush(fabCanvas);
    fabCanvas.isDrawingMode = true;
    fabCanvas.freeDrawingBrush.color = colorName || "white";
    fabCanvas.freeDrawingBrush.width = penSize || 2;
    const cursor =
    "url('ico/chalk" + (colorName ? "_" + colorName : "") + ".cur'),auto";
    fabCanvas.freeDrawingCursor = cursor;
}

// 橡皮模式
function selectEraseMode() {
    fabCanvas.freeDrawingBrush = new fabric.EraserBrush(fabCanvas);
    fabCanvas.freeDrawingBrush.width = 30;
    fabCanvas.isDrawingMode = true;
    fabCanvas.freeDrawingCursor = "url('ico/icon-rubber2.cur'),auto";
}

// 拖拽模式
function selectDragMode() {
    fabCanvas.isDrawingMode = false;
}

// 选择
chooseOn.onclick = function() {
    chooseMenu("choose");
    selectDragMode();
    gn("move").style.display = "none";
};
// 移动
moveOn.onclick = function() {
    chooseMenu("moveto");
    gn("move").style.display = "block";
};
// 画笔
brushOn.onclick = function() {
    chooseMenu("brush");
    brushPopup.style.display = "block";
    eraserPopup.style.display = "none";
    gn("move").style.display = "none";
    gn("brush_Du").src = "./ico/arrow_up.png";
    gn("eraser_Du").src = "./ico/arrow_down.png";
    fabCanvas.freeDrawingBrush.width = penSize;
    selectPenMode(penColor);
};
// 橡皮
let iseraser = true;
eraserOn.onclick = function() {
    chooseMenu("eraser");
    if (iseraser) {
        eraserPopup.style.display = "block";
    } else {
        eraserPopup.style.display = "none";
    }
    iseraser = !iseraser;
    brushPopup.style.display = "none";
    gn("move").style.display = "none";
    gn("eraser_Du").src = "./ico/arrow_up.png";
    gn("brush_Du").src = "./ico/arrow_down.png";
    selectEraseMode();
};

function chooseMenu(menuName) {
    brushPopup.style.display = "none";
    moveto.classList.remove("active");
    gn("movetoImg").src = "./ico/icon_moveto.png";
    choose.classList.remove("active");
    gn("chooseImg").src = "./ico/icon_choose.png";
    brush.classList.remove("active");
    gn("brushImg").src = "./ico/icon_brush.png";
    eraser.classList.remove("active");
    gn("eraserImg").src = "./ico/icon_eraser.png";
    gn(menuName).classList.add("active");
    gn(`${menuName}Img`).src = `./ico/icon_${menuName}_selected.png`;
    closeBroadList();
}

white.onclick = function(event) {
    event.stopPropagation();
    chooseColor();
};

black.onclick = function(event) {
    event.stopPropagation();
    chooseColor("black");
};

red.onclick = function(event) {
    event.stopPropagation();
    chooseColor("red");
};

orange.onclick = function(event) {
    event.stopPropagation();
    chooseColor("orange");
};

blue.onclick = function(event) {
    event.stopPropagation();
    chooseColor("blue");
};

function chooseColor(colorName) {
    white.classList.remove("active");
    eraser.classList.remove("active");
    black.classList.remove("active");
    red.classList.remove("active");
    orange.classList.remove("active");
    blue.classList.remove("active");
    gn(colorName || "white").classList.add("active");
    brushPopup.style.display = "none";
    gn("brush_Du").src = "./ico/arrow_down.png";
    penColor = colorName;
    selectPenMode(colorName);
}

// 画笔粗细
small.onclick = function(event) {
    event.stopPropagation();
    fabCanvas.freeDrawingBrush.width = 2;
    penSize = 2;
    chooseWidth("small");
};

medium.onclick = function(event) {
    event.stopPropagation();
    fabCanvas.freeDrawingBrush.width = 6;
    penSize = 6;
    chooseWidth("medium");
};

max.onclick = function(event) {
    event.stopPropagation();
    fabCanvas.freeDrawingBrush.width = 10;
    penSize = 10;
    chooseWidth("max");
};

function chooseWidth(widthName) {
    medium.classList.remove("active");
    max.classList.remove("active");
    small.classList.remove("active");
    gn(widthName).classList.add("active");
    brushPopup.style.display = "none";
    gn("brush_Du").src = "./ico/arrow_down.png";
}

// 清屏
clearOn.onclick = function() {
    gn("eraserPopup").style.display = "none";
    setTimeout(() => {
        gn("confirm").style.display = "block";
    // let con;
    // con = confirm("是否清空黑板?"); //在页面上弹出对话框
    // if (con == true) {
    //   document.getElementById("brushOn").click();
    //   clear();
    // }
    }, 100);
};

sure.onclick = function() {
    gn("confirm").style.display = "none";
    document.getElementById("brushOn").click();
    clear();
};

confirmClose.onclick = function() {
    gn("confirm").style.display = "none";
};
cancel.onclick = function() {
    gn("confirm").style.display = "none";
};

function clear() {
    fabCanvas.clear();
    fabCanvas.setBackgroundColor("#293937");
    fabCanvas.get("backgroundColor").set({ erasable: false });
    fabCanvas.renderAll();
}
// 撤销
rescindOn.onclick = function() {
    isAction = true;
    if (currentState.length > 1) {
        const deleteJson = currentState.pop();
        deleteState.push(deleteJson);
        const jsonString = currentState[currentState.length - 1];
        const json = JSON.parse(jsonString);
        fabCanvas.loadFromJSON(json).renderAll();
    } else {
        if (currentState.length == 1) {
            const deleteJson = currentState.pop();
            deleteState.push(deleteJson);
        }
        currentState = [];
        clear();
    }
    if (currentState.length === 0) {
        gn("rescind").style.color = "#999";
        gn("rescindImg").src = "./ico/icon_chexiao_disabled.png";
    }
    if (deleteState.length > 0) {
        gn("regain").style.color = "#FFF";
        gn("regainImg").src = "./ico/icon_huifu.png";
    }
    clearTimeout(actionSleep);
    actionSleep = setTimeout(() => {
        isAction = false;
    }, 500);
};

// 恢复
regainOn.onclick = function() {
    isAction = true;
    if (deleteState.length > 0) {
        const deleteJson = deleteState.pop();
        currentState.push(deleteJson);
        const json = JSON.parse(deleteJson);
        fabCanvas.loadFromJSON(json).renderAll();
    }
    if (deleteState.length === 0) {
        gn("regain").style.color = "#999";
        gn("regainImg").src = "./ico/icon_huifu_disabled.png";
    }
    if (currentState.length > 0) {
        gn("rescind").style.color = "#FFF";
        gn("rescindImg").src = "./ico/icon_chexiao.png";
    }
    clearTimeout(actionSleep);
    actionSleep = setTimeout(() => {
        isAction = false;
    }, 500);
};

// 切换主题
let istheme = true;
SwitchTheme.onclick = function() {
    if (istheme) {
        fabCanvas.setBackgroundColor("#ccc");
        fabCanvas.get("backgroundColor").set({ erasable: false });
        fabCanvas.renderAll();
        istheme = false;
    } else {
        fabCanvas.setBackgroundColor("#293937");
        fabCanvas.get("backgroundColor").set({ erasable: false });
        fabCanvas.renderAll();
        istheme = true;
    }
};

// 获取指定的dom
function gn(str) {
    return document.getElementById(str);
}
