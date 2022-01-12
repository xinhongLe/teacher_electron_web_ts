<template>
    <div class="preparation-file-small" :title="fileInfo.fileName">
        <img class="file-type" v-if="fileInfo.fileType === 'word'" src="../../../assets/preparationGroup/editPanel/icon_word.png" />
        <img class="file-type" v-else-if="fileInfo.fileType === 'excel'" src="../../../assets/preparationGroup/editPanel/icon_excel.png" />
        <img class="file-type" v-else-if="fileInfo.fileType === 'ppt'" src="../../../assets/preparationGroup/editPanel/icon_ppt.png" />
        <img class="file-type" v-else-if="fileInfo.fileType === 'pdf'" src="../../../assets/preparationGroup/editPanel/icon_pdf.png" />
        <img class="file-type" v-else-if="fileInfo.fileType === 'txt'" src="../../../assets/preparationGroup/editPanel/icon_txt.png" />
        <img class="file-type" v-else-if="fileInfo.fileType === 'video'" src="../../../assets/preparationGroup/editPanel/icon_video.png" />
        <img class="file-type" v-else-if="fileInfo.fileType === 'radio'" src="../../../assets/preparationGroup/editPanel/icon_radio.png" />
        <img class="file-type" v-else-if="fileInfo.fileType === 'image'" src="../../../assets/preparationGroup/editPanel/icon_image.png" />
        <img class="file-type" v-else-if="fileInfo.fileType === 'zip'" src="../../../assets/preparationGroup/editPanel/icon_zip.png" />
        <img class="file-type" v-else src="../../../assets/preparationGroup/editPanel/icon_other.png" />
        <p class="file-name"><span class="ellipsis">{{ fileInfo.fileName }}</span>{{`.${fileInfo.fileExtension}`}}</p>
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
.preparation-file-small {
    display: flex;
    align-items: center;
    padding: 12px;
    width: 132px;
    height: 34px;
    line-height: 34px;
    border-radius: 4px;
    background: rgba(75, 113, 238, 0.1);
    margin-left: 10px;
    cursor: pointer;
    .file-type {
        display: inline-block;
        width: 16px;
        height: auto;
    }
    .file-name {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #19203D;
        margin-left: 5px;
        display: flex;
        align-items: center;
    }
    .ellipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
        max-width: 65px;
    }
}
</style>
