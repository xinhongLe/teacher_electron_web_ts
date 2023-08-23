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
import {UserInfoState} from "@/types/store";

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
                    if (item.Questions) {
                        item.Questions.forEach((question: any) => {
                            selectQuestionList.value.push(question);
                        })
                    } else {
                        item.List.forEach((question: any) => {
                            selectQuestionList.value.push(question);
                        })
                    }
                });
                emit("selectedQuestion", selectQuestionList.value)
            }
        };
        //云平台信息
        const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
        const currentUserInfo: UserInfoState = get(STORAGE_TYPES.CURRENT_USER_INFO);
        const getPlatformIdByOrgId = async () => {
            console.log('currentUserInfo', currentUserInfo)
            const id = currentUserInfo.schoolId;
            // return getPlatformByOrgId([{id}]).then(res => {
            //     return res.result.length > 0 ? res.result[0].platformId : "";
            // });
            const res = await getPlatformByOrgId([{id}]);
            return res.result.length > 0 ? res.result[0].platformId : "";
        };

        onMounted(async () => {
            const platformID = await getPlatformIdByOrgId();
            // token 令牌
            const token = get(STORAGE_TYPES.SET_TOKEN);
            // webview地址
            nextTick(() => {
                url.value = `${VUE_APP_GVC_WEB}/?platformID=${platformID}&appID=16662462570678105996252073380532&appKey=16662462570678174865564538490630&appSecret=16662462570678182362101982065296&orgId=${currentUserInfo.schoolId}&userID=${yunInfo.UserId}&userName=${yunInfo.UserName}&systemID=${yunInfo.SystemId}&token=${token}&#/addItem`;
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
