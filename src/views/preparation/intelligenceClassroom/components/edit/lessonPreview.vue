<template>
    <div class="box">
        <el-dialog v-model="previewDialog" title="预览" width="80%">
            <div class="iframe-box">
                <iframe :src="url"></iframe>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
    name: "lessonPreview",
    props: {
        previewDialog: {
            type: Boolean,
            require: true
        },
        url: {
            type: String,
            default: () => ""
        }
    },
    emits: ["update:previewDialog"]
});
</script>

<style scoped>
.box{
    flex: 1;
}
 .iframe-box{
     width: 100%;
     height: 100%;
 }
</style>
