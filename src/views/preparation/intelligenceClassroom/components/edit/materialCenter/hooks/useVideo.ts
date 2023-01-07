import { ref, watch } from "vue";
import { secondToTime } from "@/utils/common";

export default (templateData:any) => {
    const videoPlayerRef = ref();
    const showClip = ref(false);
    const duration = ref(0);
    const sliderValue = ref<number[]>([]);
    const videoElement = ref();

    watch(() => templateData, (val) => {
        videoElement.value = {
            width: 1040,
            height: 585,
            left: 0,
            top: 0,
            rotate: 0,
            showType: 0,
            type: "video",
            name: val.Name,
            src: `${val.Files[0].FilePath}/${val.Files[0].FileMD5}.${val.Files[0].FileExtention}`
        };
    }, { immediate: true });

    const initVideoClip = async () => {
        showClip.value = !showClip.value;
        if (showClip.value) {
            const videRef = videoPlayerRef.value.handleGetVideoRef();
            duration.value = videRef?.duration || 0;
            sliderValue.value = templateData.clip ? templateData.clip : [0, duration.value];
        } else {
            duration.value = 0;
            sliderValue.value = [];
        }
    };

    const formatTooltip = (value: number) => {
        return secondToTime(value);
    };

    const handleSliderChange = (val:number[]) => {
        const videRef = videoPlayerRef.value.handleGetVideoRef();
        videRef.currentTime = val[0];
    };

    const resetBtn = () => {
        sliderValue.value = [0, duration.value];
        videoElement.value = {
            ...videoElement.value,
            clip: undefined
        };
    };
    const saveBtn = () => {
        videoElement.value = {
            ...videoElement.value,
            clip: sliderValue.value
        };
    };

    return {
        videoPlayerRef,
        showClip,
        duration,
        sliderValue,
        videoElement,
        initVideoClip,
        handleSliderChange,
        formatTooltip,
        resetBtn,
        saveBtn
    };
};
