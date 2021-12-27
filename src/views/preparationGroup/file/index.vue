<template>
    <div class="preparation-file">
        <img class="file-type" v-if="fileInfo.fileType === 'word'" src="../../../assets/preparationGroup/editPanel/icon_word.png" alt="" />
        <img class="file-type" v-else-if="fileInfo.fileType === 'pdf'" src="../../../assets/preparationGroup/editPanel/icon_pdf.png" alt="" />
        <div class="file-info">
            <p class="file-name ellipsis">{{`${fileInfo.fileName}.${fileInfo.extend}`}}</p>
            <p class="file-size">{{`${fileInfo.size}`}}</p>
        </div>
        <img class="file-download" src="../../../assets/preparationGroup/editPanel/download.png" alt="" />
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
import useSubmit from "../search/useSubmit";
export default defineComponent({
    name: "card",
    props: {
        fileInfo: {
            type: Object
        }
    },
    setup(props, { emit }) {
        console.log(props);
        console.log(emit);
        const state = reactive({
            loading: false
        });

        const switchStatus = (status: number) => {
            return statusList.filter((v) => {
                return v.value === status;
            })[0].label;
        };
        const { statusList } = useSubmit();
        return {
            ...toRefs(state),
            statusList,
            switchStatus
        };
    },
    components: { }
});
</script>

<style lang="scss" scoped>
.preparation-file {
    width: 180px;
    height: 48px;
    line-height: 48px;
    background: #FFFFFF;
    border-radius: 4px;
    border: 1px solid #E0E2E7;
    display: flex;
    align-items: center;
    padding: 12px;
    .file-type {
        display: inline-block;
        width: 24px;
        height: auto;
    }
    .file-info {
        width: calc(100% - 40px);
        padding: 0 12px;
        p {
            margin: 0;
            padding: 0;
            line-height: 18px;
        }
        .file-name {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #19203D;
        }
        .file-size {
            font-size: 10px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #5F626F;
        }
    }
    .file-download {
        display: inline-block;
        width: 16px;
        height: auto;
        cursor: pointer;
    }
    .ellipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
</style>
