<template>
    <div class="edit-pre-panel">
        <HeadInfo></HeadInfo>
        <div class="main-box" :class="editStatus ? `opacity` : ``">
            <Member></Member>
            <Discuss></Discuss>
            <Summary></Summary>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted, onBeforeUnmount, getCurrentInstance } from "vue";
import HeadInfo from "./headInfo/index.vue";
import Member from "./member/index.vue";
import Discuss from "./discuss/index.vue";
import Summary from "./summary/index.vue";
import useSubmit from "./useSubmit";
export default defineComponent({
    name: "edit-pre-panel",
    props: {
        reload: {
            type: Function
        }
    },
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance() as any;
        console.log(props);
        console.log(emit);
        const state = reactive({
            editStatus: false,
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
        onMounted(() => {
            proxy.mittBus.on("watchStatus", (status: boolean) => {
                state.editStatus = status;
            });
        });
        onBeforeUnmount(() => {
            proxy.mittBus.off("watchStatus");
        });
        return {
            ...toRefs(state),
            statusList,
            formData,
            formRef,
            submit,
            add
        };
    },
    components: { HeadInfo, Member, Discuss, Summary }
});
</script>

<style lang="scss" scoped>
.edit-pre-panel {
    width: 100%;
    height: fit-content;
    user-select: none;
    background-color: #F5F6FA;
    .main-box {
        min-height: calc(100% - 340px);
        height: auto;
        padding: 24px;
        margin-bottom: 0;
        background-color: #F5F6FA;
        > div {
            margin-bottom: 24px;
        }
    }
    .opacity {
        opacity: 0.5;
        pointer-events: none;
        cursor: default;
    }
}
</style>
