const dragLine = {
    mounted(el: HTMLElement) {
        let moveEl = el as HTMLElement;
        const mouseDown = (e: MouseEvent) => {
            e.preventDefault();

            //鼠标点击物体那一刻相对于物体左侧边框的距离=点击时的位置相对于浏览器最左边的距离-物体左边框相对于浏览器最左边的距离
            // console.log(e.clientX, e.clientY, "-----起始", el.offsetLeft);
            let X = e.clientX - el.offsetLeft;
            let Y = e.clientY - el.offsetTop;
            const move = (e: MouseEvent) => {
                e.preventDefault();

                // 获取拖拽元素的位置
                let left = e.clientX - X;
                let top = e.clientY - Y;

                // if (left <= 0) {
                //     left = 0;
                // } else if (
                //     left >=
                //     document.documentElement.clientWidth - el.offsetWidth
                // ) {
                //     left =
                //         document.documentElement.clientWidth - el.offsetWidth;
                // }

                if (top <= 0) {
                    top = 0;
                } else if (
                    top >
                    document.documentElement.clientHeight - el.offsetHeight
                ) {
                    top =
                        document.documentElement.clientHeight - el.offsetHeight;
                }

                // el.style.left = left + "px";
                el.style.top = top + "px";
            };
            document.addEventListener("mousemove", move);
            document.addEventListener("mouseup", () => {
                document.removeEventListener("mousemove", move);
            });
        };
        moveEl.addEventListener("mousedown", mouseDown);
    },
};
const directives = {
    install: function (app: any) {
        app.directive("dragLine", dragLine);
    },
};
export default directives;
