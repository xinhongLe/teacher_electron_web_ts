<template>
    <div class="container">
        <!--        <webview v-if="isElectron" class="iframe" :src="url"></webview>-->
        <iframe
            v-if="url"
            :src="url"
            sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation allow-downloads"
            class="iframe"
            id="questionIframe"
        />
        <!--        v-else-->
    </div>
</template>

<script lang="ts">
import {get, STORAGE_TYPES} from "@/utils/storage";
import {defineComponent, onActivated, ref, onDeactivated, nextTick, onMounted, onUnmounted} from "vue";
import {systemId, VUE_APP_GVC_WEB} from "@/config";
import isElectron from "is-electron";
import {IYunInfo} from "@/types/login";
import {getPlatformByOrgId} from "@/api/home";

// ts
export default defineComponent({
    name: "QuestionIframe",
    emits: ["selectedQuestion"],
    setup(props, {emit}) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const url = ref("");
        const selectQuestionList: any = ref([]);
        const selectedQuestion = (e: any) => {
            const iframe = document.getElementById("questionIframe") as HTMLIFrameElement;
            // 通过origin对消息进行过滤，避免遭到XSS攻击
            console.log('e.data', e.data)
            const questionData: any = JSON.parse(e.data.data);
            if (e.source === (iframe && iframe.contentWindow)) {
                console.log('questionData====>40', questionData);
                questionData?.forEach((item: any) => {
                    item.Questions.forEach((question: any) => {
                        selectQuestionList.value.push(question);
                    })
                });
                emit("selectedQuestion", selectQuestionList.value)
            }
        };

        //云平台信息
        const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);

        onMounted(() => {
            // token 令牌
            const token = get(STORAGE_TYPES.SET_TOKEN);
            // webview地址
            nextTick(() => {
                url.value = `http://192.168.20.106:8089/?platformID=${systemId}&orgId=${yunInfo.OrgId}&orgTypeID=${yunInfo.OrgTypeId}&userID=${yunInfo.UserId}&userName=${yunInfo.UserName}&systemID=${yunInfo.SystemId}&token=${token}&#/addItem`;
                window.addEventListener("message", selectedQuestion, false);
            })
        })

        onUnmounted(() => {
            console.log("onDeactivated");
            window.removeEventListener("message", selectedQuestion);
        });
        return {
            url,
            selectQuestionList,
            isElectron: isElectron(),
        };
    },
});
</script>

<style lang="scss" scoped>
.container {
    flex: 1;
    height: 100%;

    .iframe {
        width: 100%;
        height: 100%;
    }
}
</style>
