<template>
    <div class="edit-pre-panel">
        <HeadInfo></HeadInfo>
        <div class="main-box">
            <Member></Member>
            <Discuss></Discuss>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
import HeadInfo from "./headInfo/index.vue";
import Member from "./member/index.vue";
import Discuss from "./discuss/index.vue";
import useSubmit from "./useSubmit";
export default defineComponent({
    name: "edit-pre-panel",
    props: {
        reload: {
            type: Function
        }
    },
    setup(props, { emit }) {
        console.log(props);
        console.log(emit);
        const state = reactive({
            defaultValue: [new Date(), new Date()],
            shortcuts: [
                {
                    text: "今天",
                    value: () => {
                        const end = new Date();
                        const start = new Date();
                        return [start, end];
                    }
                },
                {
                    text: "本周",
                    value: () => {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        return [start, end];
                    }
                }
            ]
        });

        const submit = () => {
            emit("requestParams", formData);
        };

        const add = () => {
            console.log(1);
        };
        const { statusList, formData, formRef } = useSubmit();
        return {
            ...toRefs(state),
            statusList,
            formData,
            formRef,
            submit,
            add
        };
    },
    components: { HeadInfo, Member, Discuss }
});
</script>

<style lang="scss" scoped>
.edit-pre-panel {
    width: 100%;
    height: 100%;
    user-select: none;
    background-color: #F5F6FA;
    .main-box {
        padding: 24px;
        margin-bottom: 0;
        > div {
            margin-bottom: 24px;
        }
    }
}
</style>
