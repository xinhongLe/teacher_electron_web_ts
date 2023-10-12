<template>
    <div class="game-set-app">
        <game-list></game-list>
    </div>
</template>

<script lang="ts" setup>
import GameList from "./components/gameList";
import { reactive, toRefs } from "vue";
interface State {
    statue: string
}

const state = reactive<State>({
    statue: "gameList"
});

const { statue } = toRefs(state);

</script>

<style scoped lang="scss">
.game-set-app{
    width: 100%;
    height: calc(100vh - 20px);
}
</style>
