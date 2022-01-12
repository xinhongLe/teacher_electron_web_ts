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
</style>
