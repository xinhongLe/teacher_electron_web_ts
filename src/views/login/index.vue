<template>
    <div class="login-content" :class="{web: !isElectron}">
        <div class="left-content">
            <div class="version-text">版本: {{ version }}</div>
        </div>
        <div class="right-content">
            <div class="login-logo">
                <img src="@/assets/images/login/logo.png" alt="" />
                <p>爱学仕校园</p>
            </div>
            <el-form :model="form" label-width="0px">
                <el-form-item>
                    <el-input
                        class="zh-class"
                        v-model.trim="form.account"
                        placeholder="请输入手机号码"
                        maxlength="11"
                    >
                        <template #prefix>
                            <img
                                src="@/assets/images/login/icon_zhanghao.png"
                                alt=""
                            />
                        </template>
                    </el-input>
                    <el-select
                        v-model="form.account"
                        @change="handleChange"
                        popper-class="login-select-class"
                    >
                        <el-option
                            v-for="(item, index) in recordAccountList"
                            :key="index"
                            :label="(item as any).account"
                            :value="(item as any).account"
                        >
                            <span style="float: left">{{ (item as any).account }}</span>
                            <span
                                style="
                                    float: right;
                                    color: #8492a6;
                                    font-size: 13px;
                                "
                            >
                                <i
                                    @click.stop="delAccount(index)"
                                    class="el-icon-close"
                                ></i>
                            </span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="isPassWordLogin">
                    <el-input
                        type="password"
                        v-model="form.password"
                        placeholder="请输入密码"
                    >
                        <template #prefix>
                            <img
                                src="@/assets/images/login/icon_password.png"
                                alt=""
                            />
                        </template>
                        <template #suffix v-if="isElectron">
                            <img
                                src="@/assets/images/login/icon_keyboard.png"
                                alt=""
                                class="key-board-img"
                                @click="openVirtualKeyBoard"
                            />
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item v-else>
                    <el-input
                        type="text"
                        v-model="form.code"
                        placeholder="请输入验证码"
                    >
                        <template #prefix>
                            <img
                                src="@/assets/images/login/icon_yzm.png"
                                alt=""
                            />
                        </template>
                        <template #suffix>
                            <span class="get-code-btn" @click="getCode" v-if="codeTime === 0">获取验证码</span>
                            <span class="get-code-btn" v-else>{{`${codeTime}秒后重发`}}</span>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        :loading="loading"
                        style="width: 100%"
                        type="primary"
                        @click="login"
                        >登录</el-button
                    >
                </el-form-item>
            </el-form>
            <div class="login-method">
                <template v-if="isPassWordLogin">
                    <img src="@/assets/images/login/icon_yanzhengma.png" alt="" :width="13">
                    <span @click="isPassWordLogin = false" class="text">验证码登录</span>
                </template>
                <template v-else>
                    <img src="@/assets/images/login/icon_mima.png" alt=""  :width="12">
                    <span @click="isPassWordLogin = true" class="text">密码登录</span>
                </template>
            </div>
            <div class="close-icon" v-if="isElectron" @click="close">
                <i class="el-icon-close"></i>
            </div>
            <div class="prompt-text">
                <p>违法和不良信息举报电话：0512-65520773</p>
                <p>举报邮箱：zhangyunlong@upplus.net</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, reactive, ref } from "vue";
import useLogin from "@/hooks/useLogin";
import { useRouter, useRoute } from "vue-router";
import { ILoginData } from "@/types/login";
import { STORAGE_TYPES, get, set } from "@/utils/storage";
import isElectron from "is-electron";
import { sendMsg } from "./api";
export default defineComponent({
    setup() {
        const router = useRouter();
        const route = useRoute();

        const form = reactive({
            account: "",
            code: "",
            password: ""
        });

        const loading = ref(false);
        const recordAccountList = ref([]);
        const isPassWordLogin = ref(true);
        const codeTime = ref(0);
        let timer:any;
        recordAccountList.value = get(STORAGE_TYPES.RECORD_LOGIN_LIST, true) || [];

        const { userLogin } = useLogin();

        const login = async () => {
            const { account, password, code } = form;
            if ((isPassWordLogin.value && (account.length === 0 || password.length === 0)) || (!isPassWordLogin.value && (account.length === 0 || code.length === 0))) return false;
            loading.value = true;
            const loginSuccess = await userLogin({ account, password, code, isPassWordLogin: isPassWordLogin.value });
            loading.value = false;
            if (!loginSuccess) return;
            const redirect: any = route.redirectedFrom;
            if (redirect && redirect.path !== "/" && !isElectron()) {
                const params: any = redirect?.query;
                router.push({
                    path: redirect.path,
                    query: Object.keys(params).length > 0 ? params : ""
                });
            } else {
                router.push("/home");
            }
        };
        const handleChange = (account: string) => {
            recordAccountList.value.forEach((item: ILoginData) => {
                if (item.account === account) {
                    form.password = item.password;
                }
            });
        };
        const delAccount = (index: number) => {
            recordAccountList.value.splice(index, 1);
            set(STORAGE_TYPES.RECORD_LOGIN_LIST, recordAccountList.value, true);
        };
        const onEnter = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                login();
            }
        };

        const close = () => {
            window.electron.exit();
        };

        const openVirtualKeyBoard = () => {
            window.electron.ipcRenderer.invoke("openVirtualKeyBoard");
        };

        const getCode = async () => {
            if (!form.account) return;
            const res = await sendMsg({
                phone: form.account
            });
            if (res.resultCode === 200) {
                codeTime.value = 60;
                timer = setInterval(() => {
                    codeTime.value--;
                    if (codeTime.value === 0) {
                        clearInterval(timer);
                    }
                }, 1000);
            }
        };

        const version = ref(require("../../../package.json").version);

        onMounted(() => {
            document.addEventListener("keyup", onEnter);
        });

        onUnmounted(() => {
            document.removeEventListener("keyup", onEnter);
        });

        if (isElectron()) {
            window.electron.ipcRenderer.invoke("closeSuspension");
            window.electron.setContentSize(750, 520);
            window.electron.unmaximizeWindow();
            window.electron.setCenter();
        }

        return {
            form,
            recordAccountList,
            loading,
            login,
            close,
            version,
            handleChange,
            openVirtualKeyBoard,
            delAccount,
            getCode,
            codeTime,
            isPassWordLogin,
            isElectron: isElectron()
        };
    }
});
</script>

<style scoped lang="scss">
$btn_color: #4b71ee;
.login-content {
    display: flex;
    width: 100%;
    height: 100%;
    &.web {
        .right-content {
            :deep(.el-form) {
                width: initial;
                .el-input__inner {
                    width: 528px;
                    height: 70px;
                }
                .zh-class {
                    width: 480px;
                    z-index: 1;
                    .el-input__inner {
                        width: 100%;
                    }
                }
            }

        }
    }
    .left-content {
        width: 50%;
        background: url("../../assets/images/login/bg_login.png") no-repeat
            center center;
        background-size: cover;
        -webkit-app-region: drag;
        position: relative;
        .version-text {
            position: absolute;
            color: #b0c0fa;
            bottom: 60px;
            left: 30px;
            font-size: 16px;
        }
    }
    .right-content {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 50%;
        padding: 0 40px;
        .login-logo {
            text-align: center;
            margin-bottom: 15px;
            img {
                width: 95px;
                height: 95px;
            }
            p {
                font-size: 26px;
                font-weight: 600;
                color: #19203d;
                line-height: 45px;
            }
        }
        .login-method {
            color: #4b71ee;
            display: flex;
            align-items: center;
            height: 16px;
            .text {
                margin-left: 10px;
                cursor: pointer;
            }
        }
        .close-icon {
            position: absolute;
            top: 20px;
            right: 20px;
            cursor: pointer;
            -webkit-app-region: no-drag;
            .el-icon-close {
                font-size: 30px;
            }
        }
        :deep(.el-form) {
            width: 100%;
            .el-form-item {
                position: relative;
                margin-bottom: 20px;
                -webkit-app-region: no-drag;
                .key-board-img {
                    width: 21px;
                    height: 16px;
                    cursor: pointer;
                }
                .get-code-btn {
                    color: #4b71ee;
                    font-size: 16px;
                    cursor: pointer;
                }
                img {
                    width: 16px;
                    height: 18px;
                    z-index: 2;
                }
                .el-input__inner {
                    // width: 300px;
                    font-size: 16px;
                    color: #000;
                    background: #f5f6fa !important;
                    border: none;
                    padding-left: 50px;
                    // padding-right: 95px;
                }
                .el-input__prefix, .el-input__suffix-inner {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .el-input__prefix {
                    left: 12px;
                }
                .el-input__suffix {
                    display: flex;
                    align-items: center;
                    right: 12px;
                }
                .zh-class {
                    width: calc(100% - 40px);
                    z-index: 1;
                    // padding-right: 40px;
                }
                .el-select {
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    left: 0;
                }
            }
        }
        :deep(.el-button--primary) {
            height: 50px;
            font-size: 16px;
            margin-top: 10px;
            letter-spacing: 4px;
            background: $btn_color;
            border: $btn_color;
            -webkit-app-region: no-drag;
        }
        .prompt-text {
            position: absolute;
            bottom: 5px;
            text-align: center;
            color: #ccc;
            font-size: 12px;
            p {
                margin-bottom: 5px;
            }
        }
    }
}
</style>
