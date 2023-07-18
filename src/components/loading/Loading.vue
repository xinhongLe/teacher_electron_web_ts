<template>
    <div class="loading-container" v-show="show">
        <div class="book"></div>
    </div>
</template>

<script lang="ts" setup>
defineProps({
    show: {
        type: Boolean,
    },
});
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
    background: url("~@/assets/images/loading/loading.png") no-repeat;
    background-size: 100%;
    animation-name: swim;
    animation-duration: 2s;
    animation-timing-function: steps(27, end);
    animation-iteration-count: infinite;
    animation-fill-mode: backwards;
}

@keyframes swim {
    100% {
        background-position: 0px -5400px;
    }
}
</style>
