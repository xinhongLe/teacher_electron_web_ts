<template>
    <div class="me-remark">
        <div class="me-remark-title">教学建议</div>
        <div class="me-remark-content">
            <ul v-if="value">
                <li v-for="(item, index) in remark.split('\n')" :key="index">
                    <span class="dot"></span>
                    {{ item }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { computed, defineComponent } from "vue";
export default defineComponent({
    props: ["value"],
    setup(props) {
        const remark = computed(() => props.value);
        return {
            remark
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
</style>
