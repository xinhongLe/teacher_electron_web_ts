<template>
    <div class="loading-container" v-show="show">
        <div class="book">
            <img :src="loadingImg" alt="">
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
    show: {
        type: Boolean
    }
});

const loadingIndex = ref(0);
const loadingImg = computed(() => require(`../../assets/images/loading/${loadingIndex.value}.png`));

const startLoading = () => {
    if (loadingIndex.value === 26) {
        loadingIndex.value = 0;
    } else {
        loadingIndex.value++;
    }
    if (props.show) setTimeout(startLoading, 50);
};

startLoading();

watch(() => props.show, startLoading);
</script>

<style lang="scss" scoped>
.loading-container {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 99999;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
}

.book {
    width: 200px;
    height: 200px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    img {
        display: block;
        width: 100%;
    }
}
</style>
