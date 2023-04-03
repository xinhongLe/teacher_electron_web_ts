const dragLine = {
    mounted(el: HTMLElement, binding: any) {
        console.log("binding", binding);
        let moveEl = el as HTMLElement;
        const mouseDown = (e: MouseEvent) => {
            //鼠标点击物体那一刻相对于物体左侧边框的距离=点击时的位置相对于浏览器最左边的距离-物体左边框相对于浏览器最左边的距离
            // console.log(e.clientX, e.clientY, "-----起始", el.offsetLeft);
            let X = e.clientX - el.offsetLeft;
            let Y = e.clientY - el.offsetTop;
            const move = (e: MouseEvent) => {
                moveEl.style.bottom = "initial";
                // 获取拖拽元素的位置
                let left = e.clientX - X;
                let top = e.clientY - Y;
                if (binding.value == "left") {
                    if (left <= 0) {
                        left = 0;
                    } else if (
                        left >=
                        document.documentElement.clientWidth - el.offsetWidth
                    ) {
                        left =
                            document.documentElement.clientWidth -
                            el.offsetWidth;
                    }
                    el.style.left = left + "px";
                }

                if (top <= 0) {
                    top = 0;
                } else if (
                    top >
                    document.documentElement.clientHeight - el.offsetHeight
                ) {
                    top =
                        document.documentElement.clientHeight - el.offsetHeight;
                }

                el.style.top = top + "px";
            };
            document.addEventListener("mousemove", move, { passive: true });
            document.addEventListener(
                "mouseup",
                () => {
                    document.removeEventListener("mousemove", move);
                },
                { passive: true }
            );
        };
        moveEl.addEventListener("mousedown", mouseDown, { passive: true });

        const touchStart = (e: TouchEvent) => {
            //鼠标点击物体那一刻相对于物体左侧边框的距离=点击时的位置相对于浏览器最左边的距离-物体左边框相对于浏览器最左边的距离
            // console.log(e.clientX, e.clientY, "-----起始", el.offsetLeft);
            let X = e.touches[0].clientX - el.offsetLeft;
            let Y = e.touches[0].clientY - el.offsetTop;
            const move = (e: TouchEvent) => {
                moveEl.style.bottom = "initial";
                // 获取拖拽元素的位置
                let left = e.touches[0].clientX - X;
                let top = e.touches[0].clientY - Y;
                if (binding.value == "left") {
                    if (left <= 0) {
                        left = 0;
                    } else if (
                        left >=
                        document.documentElement.clientWidth - el.offsetWidth
                    ) {
                        left =
                            document.documentElement.clientWidth -
                            el.offsetWidth;
                    }
                    el.style.left = left + "px";
                }

                if (top <= 0) {
                    top = 0;
                } else if (
                    top >
                    document.documentElement.clientHeight - el.offsetHeight
                ) {
                    top =
                        document.documentElement.clientHeight - el.offsetHeight;
                }

                el.style.top = top + "px";
            };
            document.addEventListener("touchmove", move, { passive: true });
            document.addEventListener(
                "touchend",
                () => {
                    document.removeEventListener("touchmove", move);
                },
                { passive: true }
            );
        };

        moveEl.addEventListener("touchstart", touchStart, { passive: true });
    },
};
const directives = {
    install: function (app: any) {
        app.directive("dragLine", dragLine);
    },
};
export default directives;
