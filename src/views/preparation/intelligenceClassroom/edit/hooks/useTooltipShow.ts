import { ref } from "vue";

export default () => {
    const tooltipShow = ref(true);
    const mouseenter = (event: any, lable: string) => {
        const labelBox = event.target;
        const labelText = event.target.firstChild;
        tooltipShow.value = labelBox.offsetWidth > labelText.offsetWidth;
        if (!tooltipShow.value) {
            const div = document.createElement("div");
            div.innerHTML = lable;
            div.setAttribute("id", "tooltipShow");
            div.setAttribute("class", "tooltip-class");
            div.style.left = event.pageX + "px";
            div.style.top = event.pageY - 60 + "px";
            document.body.appendChild(div);
        }
    };
    const mouseleave = () => {
        tooltipShow.value = true;
        const div = document.getElementById("tooltipShow");
        if (div) {
            div.remove();
        }
    };

    return {
        tooltipShow,
        mouseenter,
        mouseleave
    };
};
