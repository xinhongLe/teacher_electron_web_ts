<template>
    <div class="me-remark">
        <div class="me-remark-content">
            <div class="me-remark-title" v-if="teachProcess">教学过程</div>
            <ul v-if="teachProcess">
                <li v-for="(item, index) in teachProcess.split('\n')" :key="index">
                    <span class="dot" v-if="item"></span>
                    {{ item }}
                </li>
            </ul>
            <div class="h-place"></div>
            <div class="me-remark-title" v-if="design">设计意图</div>
            <ul v-if="design">
                <li v-for="(item, index) in design.split('\n')" :key="index">
                    <span class="dot" v-if="item"></span>
                    {{ item }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { computed, defineComponent } from "vue";
export default defineComponent({
    props: ["teachProcess", "design"],
    setup(props) {
        const teachProcess = computed(() => props.teachProcess);
        const design = computed(() => props.design);
        console.log(design.value, teachProcess.value);
        return {
            teachProcess,
            design
        };
    }
});
</script>

<style lang="scss" scoped>
.me-remark {
    width: 240px;
    background-color: #fff;
    box-sizing: border-box;
    padding: 20px !important;
}

.me-remark-title {
    font-weight: 600;
    font-size: 16px;
    color: var(--app-color-dark);
    text-align: left;
}

.me-remark-content {
    height: 100%;
    overflow-y: auto;
}

.me-remark-content ul {
    margin-top: 20px;
    font-size: 14px;
    color: #5F626F;
    text-align: left;
}

.me-remark-content ul li {
    margin-bottom: 16px;
    line-height: 20px;
    word-break: break-all;
    display: flex;
    .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        margin-top: 8px;
        margin-right: 8px;
        flex-shrink: 0;
        background-color: #CCCED3;
    }
}

.h-place {
    height: 20px;
}
</style>
