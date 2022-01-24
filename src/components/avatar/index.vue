<template>
    <el-avatar
        :src="src"
        :size="size"
        style="background: #fff;"
    />
    <!-- <img :src="src" alt="" class=""/> -->
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch, watchEffect } from "vue";
import { avatarProps } from "element-plus";
import { getOssUrl } from "@/utils/oss";
import { HeadPortrait } from "@/types/myStudent";
const imgUrl = require("@/assets/images/attend-class/touxiang_student.png");
export default defineComponent({
    name: "avatar",
    props: {
        ...avatarProps,
        file: {
            type: Object as PropType<HeadPortrait>,
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
        watchEffect(() => {
            const file = props.file;
            if (props.file.FileName) {
                const key = file.Extention ? `${file.FilePath}/${file.FileName}.${file.Extention}` : `${file.FilePath}/${file.FileName}`;
                getOssUrl(key, file.Bucket).then(res => {
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
