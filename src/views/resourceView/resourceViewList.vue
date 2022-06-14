<template>
    <div class="resource-view">
        <IntelligenceClassroom
            v-if="type === 1"
            :resourceId="target"
        />
        <LookVideo v-if="type === 2" :dialog="true" />
        <LookQuestion v-if="type === 3" :dialog="true" />
        <iframe :src="url" v-if="type === 0"></iframe>
    </div>
</template>

<script lang="ts">
import useWindowInfo, { windowInfoKey } from "@/hooks/useWindowInfo";
import { defineComponent, PropType, provide, ref, watchEffect } from "vue";
import IntelligenceClassroom from "../preparation/intelligenceClassroom/index.vue";
import LookVideo from "@/components/lookVideo/index.vue";
import LookQuestion from "@/components/lookQuestion/index.vue";
import { IResourceItem } from "@/api/resource";
import { getOssUrl } from "@/utils/oss";

export default defineComponent({
    components: { IntelligenceClassroom, LookVideo, LookQuestion },
    props: {
        target: {
            type: String,
            default: ""
        },
        resource: {
			type: Object as PropType<IResourceItem | undefined>,
			required: true
		},
        type: {
            type: Number
        },
        visible: {
            type: Boolean,
            default: false
        }
    },
    setup(props, { emit }) {
        provide(windowInfoKey, useWindowInfo());

        const url = ref("");
        const initIframeSrc = async () => {
            if (!props.resource || !props.resource.File || props.type !== 0) return;
            const { FilePath, FileMD5, FileExtention, FileBucket } = props.resource.File;
            const key = `${FilePath}/${FileMD5}${FileExtention}`;
            const fileUrl = await getOssUrl(key, FileBucket);
            console.log(fileUrl);
            url.value = "https://owa.lyx-edu.com/wv/wordviewerframe.aspx?WOPISrc=" + encodeURIComponent(fileUrl);
            console.log(url.value);
        };

        watchEffect(initIframeSrc);
        return {
            url
        };
    }
});
</script>

<style lang="scss" scoped>
.resource-view {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    iframe {
        width: 100%;
        height: 100%;
    }
}
</style>
