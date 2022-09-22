import { ref } from "vue";

export default () => {
    const playStatus = ref(1); /* *1未播放 2播放中 3暂停 4播放结束 **/
    const audioList = ref([]);
    const readingTimes = ref(2);
    const delayTime = ref(2500);
    const nowReadingIndex = ref("");
    const timer = ref();
    const audio = ref("");
    const showSelect = ref(false);
    const isShowAnswer = ref(true);
    const openSelect = () => {
        showSelect.value = true;
    };
    return {
        playStatus,
        audioList,
        readingTimes,
        delayTime,
        nowReadingIndex,
        timer,
        audio,
        showSelect,
        isShowAnswer,
        openSelect
    };
};
