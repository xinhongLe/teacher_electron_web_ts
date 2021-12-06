<template>
    <div class="me-remark">
        <div class="me-remark-title">教学建议</div>
        <div class="me-remark-content">
            <ul v-if="value">
                <li v-for="(item, index) in remark.split('\n')" :key="index">
                    {{ item }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { computed, defineComponent } from "vue-demi";
export default defineComponent({
    props: ["value"],
    setup(props) {
        console.log(props.value, "111111111111111111111112");
        const remark = computed(() => props.value);
        return {
            remark
        };
    }
});
</script>

<style lang="scss" scoped>
.me-remark {
    width: 300px;
    background-color: #fff;
    box-sizing: border-box;
    padding: 20px !important;
}

.me-remark-title {
    font-weight: 600;
    font-size: 16px;
    color: #444;
    text-align: left;
}

.me-remark-content ul {
    margin-top: 20px;
    padding-left: 20px;
    font-size: 14px;
    color: #888;
    text-align: left;
}

.me-remark-content ul li {
    margin-bottom: 8px;
}
</style>
