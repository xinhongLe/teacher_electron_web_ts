import { nextTick } from "vue";

const drag = {
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
        // console.log("isMobile---", isMobile());
        // 鼠标在目标元素上按下
        el.addEventListener(
            "mousedown",
            (e) => {
                e.preventDefault();
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
            },
            { passive: false }
        );

        //触摸屏 触摸按下
        let left = 0;
        let top = 0;
        let mouseX = 0;
        let mouseY = 0;
        let leftLimit = 0;
        let rightLimit = 0;
        let topLimit = 0;
        let bottomLimit = 0;
        el.addEventListener("touchstart", (e) => {
            let { width, height } = el.getBoundingClientRect();
            // 当前目标元素的left与top
            left = el.offsetLeft;
            top = el.offsetTop;
            // 保存按下的触摸按下的X与Y
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
            // 计算边界值
            leftLimit = left;
            rightLimit = containerWidth - left - width;
            topLimit = top;
            bottomLimit = containerHeight - top - height;
        });
        el.addEventListener("touchmove", (e) => {
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
function isMobile() {
    let userAgentInfo = navigator.userAgent;
    let Agents = [
        "Android",
        "iPhone",
        "SymbianOS",
        "Windows Phone",
        "iPad",
        "iPod",
    ];
    let getArr = Agents.filter((i) => userAgentInfo.includes(i));
    return getArr.length ? true : false;
}
const directives = {
    install: function (app: any) {
        app.directive("drag", drag);
    },
};
export default directives;
