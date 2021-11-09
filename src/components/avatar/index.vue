<template>
    <el-avatar
        :src="src"
        :size="size"
    />
    <!-- <img :src="src" alt="" class=""/> -->
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { avatarProps } from "element-plus";
import { downloadFile } from "@/utils/oss";
const imgUrl = require("@/assets/images/attend-class/touxiang_student.png");
export default defineComponent({
    name: "avatar",
    props: {
        ...avatarProps,
        file: {
            type: Object,
            default: () => ({})
        }
    },
    setup(props) {
        const src = ref(imgUrl);
        watch(() => props.src, (newSrc) => {
            if (newSrc) {
                src.value = src;
            }
        });
        watch(() => props.file, (newFile) => {
            if (newFile) {
                const key = newFile.Extention ? `${newFile.FilePath}.${newFile.FileName}.${newFile.Extention}` : `${newFile.FilePath}.${newFile.FileName}`;
                downloadFile(key, newFile.Bucket).then(res => {
                    src.value = res;
                });
            }
        });
        return {
            src,
            size: props.size
        };
    }
});
</script>

<style lang="scss" scoped>

</style>
