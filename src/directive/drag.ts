const drag = {
    // mounted(el: HTMLElement) {
    //     let moveEl = el as HTMLElement;
    //     const mouseDown = (e: MouseEvent) => {
    //         //鼠标点击物体那一刻相对于物体左侧边框的距离=点击时的位置相对于浏览器最左边的距离-物体左边框相对于浏览器最左边的距离
    //         // console.log(e.clientX, e.clientY, "-----起始", el.offsetLeft);
    //         let X = e.clientX - el.offsetLeft;
    //         let Y = e.clientY - el.offsetTop;
    //         const move = (e: MouseEvent) => {
    //             // 获取拖拽元素的位置
    //             let left = e.clientX - X;
    //             let top = e.clientY - Y;

    //             if (left <= 0) {
    //                 left = 0;
    //             } else if (
    //                 left >=
    //                 document.documentElement.clientWidth - el.offsetWidth
    //             ) {
    //                 left =
    //                     document.documentElement.clientWidth - el.offsetWidth;
    //             }

    //             if (top <= 0) {
    //                 top = 0;
    //             } else if (
    //                 top >
    //                 document.documentElement.clientHeight - el.offsetHeight
    //             ) {
    //                 top =
    //                     document.documentElement.clientHeight - el.offsetHeight;
    //             }

    //             el.style.left = left + "px";
    //             el.style.top = top + "px";
    //         };
    //         document.addEventListener("mousemove", move);
    //         document.addEventListener("mouseup", () => {
    //             document.removeEventListener("mousemove", move);
    //         });
    //     };
    //     moveEl.addEventListener("mousedown", mouseDown);
    // },
    mounted(el: HTMLElement, binding: any) {
        // 设置目标元素基础属性
        el.style.cursor = "move";
        el.style.position = "fixed";
        // 获取容器宽高
        const containerId = binding.value || null;
        let containerWidth = window.innerWidth - getScrollWidth();
        let containerHeight = window.innerHeight;
        // 存在父级容器
        if (containerId) {
            const containerEle: any = document.getElementById(containerId);
            let { width, height } = containerEle.getBoundingClientRect();
            containerWidth = width;
            containerHeight = height;
            if (
                !["fixed", "absolute", "relative"].includes(
                    getStyle(containerEle, "position")
                )
            ) {
                containerEle.style.position = "relative";
            }
            el.style.position = "absolute";
        }
        //鼠标------
        // 鼠标在目标元素上按下
        el.addEventListener("mousedown", (e) => {
            let { width, height } = el.getBoundingClientRect();
            // 当前目标元素的left与top
            const left = el.offsetLeft;
            const top = el.offsetTop;
            // 保存按下的鼠标的X与Y
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            // 计算边界值
            const leftLimit = left;
            const rightLimit = containerWidth - left - width;
            const topLimit = top;
            const bottomLimit = containerHeight - top - height;

            // 监听鼠标移动
            document.onmousemove = (e) => {
                // 鼠标移动的距离
                let disX = e.clientX - mouseX;
                let disY = e.clientY - mouseY;
                // 左右边界
                if (disX < 0 && disX <= -leftLimit) {
                    // el.style.right = leftLimit + width + "px";
                } else if (disX > 0 && disX >= rightLimit) {
                    // el.style.right = rightLimit - width + "px";
                } else {
                    el.style.right = rightLimit - disX + "px";
                }
                // 上下边界
                if (disY < 0 && disY <= -topLimit) {
                    el.style.top = top - topLimit + "px";
                } else if (disY > 0 && disY >= bottomLimit) {
                    el.style.top = top + bottomLimit + "px";
                } else {
                    el.style.top = top + disY + "px";
                }
                return false;
            };

            // 监听鼠标抬起
            document.onmouseup = () => {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        });

        //触摸屏-----
        //触摸屏 触摸按下
        el.addEventListener("touchstart", (e) => {
            let { width, height } = el.getBoundingClientRect();
            // 当前目标元素的left与top
            const left = el.offsetLeft;
            const top = el.offsetTop;
            // 保存按下的触摸按下的X与Y
            const mouseX = e.touches[0].clientX;
            const mouseY = e.touches[0].clientY;
            // 计算边界值
            const leftLimit = left;
            const rightLimit = containerWidth - left - width;
            const topLimit = top;
            const bottomLimit = containerHeight - top - height;

            // 监听触摸移动
            document.ontouchmove = (e) => {
                // 鼠标移动的距离
                let disX = e.touches[0].clientX - mouseX;
                let disY = e.touches[0].clientY - mouseY;
                // 左右边界
                if (disX < 0 && disX <= -leftLimit) {
                    // el.style.right = leftLimit + width + "px";
                } else if (disX > 0 && disX >= rightLimit) {
                    // el.style.right = rightLimit - width + "px";
                } else {
                    el.style.right = rightLimit - disX + "px";
                }
                // 上下边界
                if (disY < 0 && disY <= -topLimit) {
                    el.style.top = top - topLimit + "px";
                } else if (disY > 0 && disY >= bottomLimit) {
                    el.style.top = top + bottomLimit + "px";
                } else {
                    el.style.top = top + disY + "px";
                }
                return false;
            };

            // 监听触摸抬起
            document.ontouchend = () => {
                document.ontouchmove = null;
                document.ontouchcancel = null;
            };
        });
    },
};
// 获取元素的相关CSS
function getStyle(el: any, attr: any) {
    return el.currentStyle
        ? el.currentStyle[attr]
        : window.getComputedStyle(el, "false")[attr];
}
// 返回滚动条的宽度, 没有则返回0
function getScrollWidth() {
    let noScroll,
        scroll,
        oDiv = document.createElement("DIV");
    oDiv.style.cssText =
        "position:absolute; top:-1000px; width:100px; height:100px; overflow:hidden;";
    noScroll = document.body.appendChild(oDiv).clientWidth;
    oDiv.style.overflowY = "scroll";
    scroll = oDiv.clientWidth;
    document.body.removeChild(oDiv);
    let isExsit =
        document.body.scrollHeight >
        (window.innerHeight || document.documentElement.clientHeight);
    return isExsit ? noScroll - scroll : 0;
}
const directives = {
    install: function (app: any) {
        app.directive("drag", drag);
    },
};
export default directives;
