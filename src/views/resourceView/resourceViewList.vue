<template>
    <div class="resource-view">
        <IntelligenceClassroom
            v-if="type === 1"
            :resourceId="target"
            :dialog="true"
            :isMySelf="isMySelf"
        />
        <LookVideo v-if="type === 2" :dialog="true" :close="close" />
        <LookQuestion v-if="type === 3" :dialog="true" :close="close" />
        <div class="iframe-box" v-if="type === 0">
            <iframe :src="url"></iframe>
        </div>
        <div class="iframe-teach-box" v-if="type === 4">
            <iframe :src="url"></iframe>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, provide, ref, watchEffect } from "vue";
import IntelligenceClassroom from "../preparation/intelligenceClassroom/index.vue";
import LookVideo from "@/components/lookVideo/index.vue";
import LookQuestion from "@/components/lookQuestion/index.vue";
import { IResourceItem } from "@/api/resource";
import { getOssUrl } from "@/utils/oss";
import { useStore } from "@/store";

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
        },
        close: {
            type: Function,
            default: () => {}
        }
    },
    setup(props, { emit }) {
        const store = useStore();
        const url = ref("");
        const initIframeSrc = async () => {
            if (!props.resource) return;
            if (props.type === 0 && props.resource.File) {
                const { FilePath, FileMD5, FileExtention, FileBucket } = props.resource.File;
                const key = `${FilePath}/${FileMD5}.${FileExtention}`;
                const fileUrl = await getOssUrl(key, FileBucket);
                url.value = "https://owa.lyx-edu.com/op/view.aspx?src=" + encodeURIComponent(fileUrl);
            }

            if (props.type === 4) {
                url.value = props.resource.ResourceToolUrl;
            }
        };

        const isMySelf = computed(() => props.resource!.UserId === store.state.userInfo.userCenterUserID);

        watchEffect(initIframeSrc);
        return {
            url,
            isMySelf
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
    .iframe-box {
        width: 100%;
        height: 100%;
        overflow: hidden;
        iframe {
            height: calc(100% + 55px);
            margin-top: -55px;
        }
    }
    .iframe-teach-box {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    iframe {
        width: 100%;
        height: 100%;
    }
}
</style>
