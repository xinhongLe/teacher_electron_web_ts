import { useElementSize, useTemplateRefsList } from "@vueuse/core";
import { computed, ref, watch } from "vue";

export default () => {
    const swiperRef = ref<HTMLDivElement>();
    const { width } = useElementSize(swiperRef);
    const isShowSlideBtn = ref(false);
    const translateX = ref(0);
    const slideIndex = ref(0);
    const listWarpRef = ref<HTMLDivElement>();
    const swiperItemRefs = useTemplateRefsList<HTMLDivElement>();

    const maxTranslateX = computed(() => width.value - (listWarpRef.value?.offsetWidth || 0));
    const isDisablePrev = computed(() => translateX.value === 0);
    const isDisableNext = computed(() => translateX.value >= maxTranslateX.value);

    const slidePrev = () => {
        if (isDisablePrev.value) return;
        const x = translateX.value - swiperItemRefs.value[slideIndex.value].offsetWidth;
        translateX.value = x < 0 ? 0 : x;
        if (translateX.value === 0) {
            slideIndex.value = 0;
        } else {
            slideIndex.value--;
        }
    };

    const slideNext = () => {
        if (isDisableNext.value) return;
        const x = translateX.value + swiperItemRefs.value[slideIndex.value].offsetWidth;
        translateX.value = x > maxTranslateX.value ? maxTranslateX.value : x;
        slideIndex.value++;
    };

    watch(width, (v) => {
        isShowSlideBtn.value = v > listWarpRef.value!.offsetWidth;
    });

    return {
        swiperRef,
        isShowSlideBtn,
        translateX,
        listWarpRef,
        slidePrev,
        slideNext,
        slideIndex,
        isDisablePrev,
        isDisableNext,
        swiperItemRefs
    };
};
