<template>
    <el-config-provider :locale="locale">
        <div class="main">
            <Helper />
        </div>
    </el-config-provider>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Helper from "@/components/suspension/helper.vue";
import zhCn from "element-plus/es/locale/lang/zh-cn";

export default defineComponent({
    setup() {
        return {
            locale: zhCn
        };
    },
    components: { Helper }
});
</script>

<style lang="scss">
html {
    font-size: 10px;
}
body {
    margin: 0;
    user-select: none;
    overflow: hidden;
}
.main {
    position: relative;
    height: 100vh;
    width: 100vw;
}
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}
/* 滚动条背景 */
::-webkit-scrollbar-track {
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.06);
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.08);
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.16);
    -webkit-box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
}
</style>
