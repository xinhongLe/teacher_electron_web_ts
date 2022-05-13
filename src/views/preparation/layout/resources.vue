<template>
    <div class="p-layout-list">
        <div class="tip">
            <img src="@/assets/images/preparation/pic_finish_buzhi.png" alt="">
            请选择书册
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    setup() {
        
    }
});
</script>

<style lang="scss" scoped>
.p-layout-list {
    flex: 1;
    min-height: 0;
    min-width: 0;
    position: relative;
}

.tip {
    width: 200px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 400;
    img {
        margin-bottom: 10px;
    }
}
</style>
