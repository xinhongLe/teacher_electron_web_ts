<template>
    <div class="container" :class="{ error: isError }">
        <div class="choice">
            {{ choiceValue }}
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
    props: {
        choiceValue: {
            type: String,
            default: ""
        },
        isError: {
            type: Boolean,
            default: false
        }
    },
    setup() {
        return {};
    }
});
</script>

<style lang="scss" scoped>
.container {
    background: rgba(188, 247, 221, 1);
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    &.error {
        background: rgba(255, 217, 217, 1);
    }
    .choice {
        width: 80px;
        height: 80px;
        background: #fff;
        color: #000;
        font-size: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>
