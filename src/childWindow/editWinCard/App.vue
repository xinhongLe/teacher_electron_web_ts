<template>
    <div class="main-container">
        <div class="main-body">
            <editWinCard />
        </div>
    </div>
</template>

<script lang="ts" setup>
import editWinCard from "../../views/preparation/intelligenceClassroom/edit/index.vue";
// onMounted(() => {
//     nextTick(() => {
//         console.log("window.electron.store------------", window.electron.store);
//     });
// });
</script>

<style lang="scss" scoped>
.main-container {
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    -webkit-app-region: no-drag;
    .main-body {
        display: flex;
        flex: 1;
        overflow-y: auto;
        -webkit-app-region: no-drag;
    }
}
</style>
