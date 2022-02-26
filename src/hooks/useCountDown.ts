import { computed, ref } from "vue";

export default () => {
    let timer: any;
    const time = ref(0);
    const timeList = ref(["00", "00"]);
    function setTimeList() {
        const h = Number(
            Math.floor(time.value / 600) < 10
                ? "0" + String(Math.floor(time.value / 3600))
                : Math.floor(time.value / 3600)
        );
        const m = String(
            Math.floor((time.value - h * 600) / 60) < 10
                ? "0" + String(Math.floor((time.value - h * 600) / 60))
                : Math.floor((time.value - h * 600) / 60)
        );
        timeList.value[0] = m;
        const s = String(
            time.value - h * 600 - Number(m) * 60 < 10
                ? "0" + String(time.value - h * 600 - Number(m) * 60)
                : time.value - h * 600 - Number(m) * 60
        );
        timeList.value[1] = s;
    }

    const startCountDown = () => {
        timer && clearInterval(timer);
        timer = setInterval(() => {
            time.value++;
            setTimeList();
        }, 1000);
    };

    const endCountDown = () => {
        timer && clearInterval(timer);
    };

    return {
        startCountDown,
        endCountDown,
        showTime: computed(() => timeList.value.join(":"))
    };
};
