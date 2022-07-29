<template>
    <div class="iframe-box">
        <iframe class="iframe-content" :src="url"></iframe>
        <div class="iframe-footer">
            <div class="iframe-footer-btn" @click="close">
                <p>关闭</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { IResourceItem } from "@/api/resource";
import { getOssUrl } from "@/utils/oss";
import { defineComponent, PropType, ref, watchEffect } from "vue";

export default defineComponent({
    props: {
        resource: {
			type: Object as PropType<IResourceItem | undefined>,
			required: true
		}
    },
    setup(props, { emit }) {
        const url = ref("");
        const initIframeSrc = async () => {
            if (!props.resource || !props.resource.ResourceToolUrl) return;
            url.value = props.resource.ResourceToolUrl;
        };

        watchEffect(initIframeSrc);

        const close = () => {
            emit("close");
        };
        return {
            close,
            url
        }
    }
});

</script>

<style lang="scss" scoped>
.iframe-box {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: #fff;
    overflow: hidden;
    .iframe-content {
        margin-top: -55px;
        flex: 1;
        min-height: 0;
    }
    .iframe-footer {
        width: 100%;
        height: 80px;
        padding: 12px;
        background: rgb(125, 164, 236);
        display: flex;
        align-items: center;
        justify-content: center;
        .iframe-footer-btn {
            width: 64px;
            height: 64px;
            cursor: pointer;
            margin-right: 20px;
            background: url("~@/assets/look/btn_guanbi@2x.png");
            background-size: 100% 100%;
            p {
                color: #fff;
                text-align: center;
                font-size: 12px;
                line-height: 24px;
                margin-top: 40px;
                font-weight: 550;
            }
        }
    }
}
</style>
