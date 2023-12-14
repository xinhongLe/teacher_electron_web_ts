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

        window.addEventListener('resize', () => {
            containerWidth = window.innerWidth - getScrollWidth();
            containerHeight = window.innerHeight;
            let { width, height } = el.getBoundingClientRect();
            let left = el.offsetLeft;
            let top = el.offsetTop;

            if (left + width > containerWidth) {
                el.style.left = containerWidth - width + 'px';
            }
            if (top + height > containerHeight) {
                el.style.top = containerHeight - height + 'px';
            }
        })

        el.addEventListener(
            "mousedown",
            (e) => {
                e.stopPropagation();
                let { width, height } = el.getBoundingClientRect();
                const left = el.offsetLeft;
                const top = el.offsetTop;
                const mouseX = e.clientX;
                const mouseY = e.clientY;
                const leftLimit = left;
                const rightLimit = containerWidth - left - width;
                const topLimit = top;
                const bottomLimit = containerHeight - top - height;

                document.onmousemove = (e) => {
                    let disX = e.clientX - mouseX;
                    let disY = e.clientY - mouseY;
                    if (disX < 0 && disX <= -leftLimit) {
                    } else if (disX > 0 && disX >= rightLimit) {
                    } else {
                        el.style.right = rightLimit - disX + "px";
                    }
                    if (disY < 0 && disY <= -topLimit) {
                        el.style.top = top - topLimit + "px";
                    } else if (disY > 0 && disY >= bottomLimit) {
                        el.style.top = top + bottomLimit + "px";
                    } else {
                        el.style.top = top + disY + "px";
                    }
                    return false;
                };

                document.onmouseup = () => {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            },
            { passive: false }
        );

        // 触摸屏操作
        let left = 0;
        let top = 0;
        let mouseX = 0;
        let mouseY = 0;
        let leftLimit = 0;
        let rightLimit = 0;
        let topLimit = 0;
        let bottomLimit = 0;

        el.addEventListener("touchstart", (e) => {
            e.stopPropagation();
            left = el.offsetLeft;
            top = el.offsetTop;
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
            let { width, height } = el.getBoundingClientRect();
            leftLimit = left;
            rightLimit = containerWidth - left - width;
            topLimit = top;
            bottomLimit = containerHeight - top - height;
        });

        el.addEventListener("touchmove", (e) => {
            e.stopPropagation();
            let disX = e.touches[0].clientX - mouseX;
            let disY = e.touches[0].clientY - mouseY;
            if (disX < 0 && disX <= -leftLimit) {
            } else if (disX > 0 && disX >= rightLimit) {
            } else {
                el.style.right = rightLimit - disX + "px";
            }
            if (disY < 0 && disY <= -topLimit) {
                el.style.top = top - topLimit + "px";
            } else if (disY > 0 && disY >= bottomLimit) {
                el.style.top = top + bottomLimit + "px";
            } else {
                el.style.top = top + disY + "px";
            }
            return false;
        });
    }
};

// 获取元素的相关CSS
function getStyle(el: any, attr: any) {
    return el.currentStyle
        ? el.currentStyle[attr]
        : window.getComputedStyle(el, "false")[attr];
}

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
    }
};

export default directives;
