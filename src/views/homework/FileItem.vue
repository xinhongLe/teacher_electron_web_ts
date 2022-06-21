<template>
    <div class="file-info">
        <p @click="viewInfo(file.File)">
            <FileType :fileExtension="file.File.Extention"/>
            <span class="ellipsis" :title="file.File.Name">{{ file.File.Name }}</span>
        </p>
        <Enlarge
            v-model:visible="visible"
            v-if="visible"
            :src="src"
            :extention="file.File.Extention"
        />
    </div>
</template>

<script lang="ts">
import { HomeworkPaperFile } from "@/types/homework";
import { defineComponent, PropType } from "vue";
import Enlarge from "@/components/enlarge/index.vue";
import { showFileIcon } from "@/utils";
import useViewHomeworkFile from "@/hooks/useViewHomeworkFile";
import FileType from "../../components/fileType/index.vue";
export default defineComponent({
    props: {
        file: {
            type: Object as PropType<HomeworkPaperFile>,
            default: () => ({})
        }
    },
    setup() {
        const { src, visible, viewInfo } = useViewHomeworkFile();
        return {
            showFileIcon,
            src,
            visible,
            viewInfo
        };
    },
    components: { Enlarge, FileType }
});
</script>

<style lang="scss" scoped>
.file-info {
    position: relative;
    // margin-right: 20px;
    padding: 10px 20px;
    background-color: #f3f7ff;
    border-radius: 4px;
    p {
        background: #fff;
        padding: 8px;
        display: flex;
        align-items: center;
        img {
            width: 20px;
            height: 20px;
            vertical-align: middle;
            margin-right: 10px;
        }
         .ellipsis {
            margin-left: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: inline-block;
            width: auto;
            max-width: calc(100% - 25px);
        }
    }
}
</style>
