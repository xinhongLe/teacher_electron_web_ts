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
                            :label="item.account"
                            :value="item.account"
                        >
                            <span style="float: left">{{ item.account }}</span>
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
                <el-form-item>
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
export default defineComponent({
    setup() {
        const router = useRouter();
        const route = useRoute();

        const form = reactive({
            account: "",
            password: ""
        });

        const loading = ref(false);
        const recordAccountList = ref([]);
        recordAccountList.value = get(STORAGE_TYPES.RECORD_LOGIN_LIST, true) || [];

        const { userLogin } = useLogin();

        const login = async () => {
            const { account, password } = form;
            if (account.length === 0 || password.length === 0) return false;
            loading.value = true;
            await userLogin(account, password);
            loading.value = false;

            const redirect: any = route.redirectedFrom;
            if (redirect) {
                const params: any = redirect?.query;
                router.push({
                    path: redirect.path,
                    query: Object.keys(params).length > 0 ? params : ""
                });
            } else {
                router.push("/");
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
            const { exec } = require("child_process");
            const os = require("os");
            if (os.platform() === "win32") {
                exec("osk.exe");
            } else {
                exec("onboard");
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
            margin-bottom: 35px;
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
                margin-bottom: 32px;
                -webkit-app-region: no-drag;
                .key-board-img {
                    width: 21px;
                    height: 16px;
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
                    width: 90%;
                    z-index: 1;
                    padding-right: 40px;
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
            bottom: 10px;
            text-align: center;
            color: #ccc;
            font-size: 16px;
            p {
                margin-bottom: 10px;
            }
        }
    }
}
</style>
