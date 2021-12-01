<template>
    <div class="file-info">
        <p @click="viewInfo(file.File)">
            <img
                :src="
                    require(`@/assets/images/homeworkNew/${showFileIcon(
                        file.File.Extention
                    )}.png`)
                "
                alt=""
            />
            <span>{{ file.File.Name }}</span>
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
    components: { Enlarge }
});
</script>

<style lang="scss" scoped>
.file-info {
    position: relative;
    margin-right: 20px;
    padding: 10px 20px;
    background-color: #f3f7ff;
    border-radius: 4px;
    p {
        background: #fff;
        padding: 8px;
        img {
            width: 20px;
            height: 20px;
            vertical-align: middle;
            margin-right: 10px;
        }
    }
}
</style>
