<template>
    <div class="login-content">
        <div class="left-content"></div>
        <div class="right-content">
            <div class="login-logo">
                <img src="@/assets/images/login/logo.png" alt="" />
                <p>爱学仕校园</p>
            </div>
            <el-form :model="form" label-width="0px">
                <el-form-item>
                    <img src="@/assets/images/login/icon_zhanghao.png" alt="" />
                    <el-input
                        class="zh-class"
                        v-model.trim="form.account"
                        placeholder="请输入手机号码"
                        maxlength="11"
                    ></el-input>
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
                        <span style="float: right; color: #8492a6; font-size: 13px">
                            <i @click.stop="delAccount(index)" class="el-icon-close"></i>
                        </span>
                    </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <img src="@/assets/images/login/icon_password.png" alt="" />
                    <el-input
                        type="password"
                        v-model="form.password"
                        placeholder="请输入密码"
                    ></el-input>
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
            <div class="version-text">版本:{{ version }}</div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, onMounted, onUnmounted, reactive, ref } from "vue";
import useLogin from "@/hooks/useLogin";
import { useRouter } from "vue-router";
import { ILoginData } from "@/types/login";
import { STORAGE_TYPES, get } from "@/utils/storage";
import isElectron from "is-electron";
export default defineComponent({
    setup() {
        const router = useRouter();

        const form = reactive({
            account: "",
            password: ""
        });

        const loading = ref(false);
        const recordAccountList = ref([]);
        recordAccountList.value = get(STORAGE_TYPES.RECORD_LOGIN_LIST) || [];

        const { userLogin, recordAccount } = useLogin();

        const login = async () => {
            const { account, password } = form;
            if (account.length === 0 || password.length === 0) return false;
            loading.value = true;
            await userLogin(account, password);
            recordAccount(form);
            loading.value = false;
            router.push("/");
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
        };
        const onEnter = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                login();
            }
        };

        const close = () => {
            window.electron.exit();
        };

        const version = ref(require("../../../package.json").version);

        onMounted(() => {
            document.addEventListener("keyup", onEnter);
            if (isElectron()) {
                window.electron.ipcRenderer.invoke("closeSuspension");
                window.electron.unmaximizeWindow();
            }
        });

        onUnmounted(() => {
            document.removeEventListener("keyup", onEnter);
        });

        return {
            form,
            recordAccountList,
            loading,
            login,
            close,
            version,
            handleChange,
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
    -webkit-app-region: drag;
    .left-content {
        width: 50%;
        background: url("../../assets/images/login/bg_login.png") no-repeat
            center center;
        background-size: cover;
    }
    .right-content {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 50%;
        .login-logo {
            text-align: center;
            margin-bottom: 35px;
            img {
                width: 142px;
                height: 142px;
            }
            p {
                font-size: 32px;
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
            .el-form-item {
                position: relative;
                margin-bottom: 32px;
                -webkit-app-region: no-drag;
                img {
                    position: absolute;
                    left: 12px;
                    top: 26px;
                    width: 16px;
                    height: 18px;
                    z-index: 2;
                }
                .el-input__inner {
                    width: 528px;
                    height: 70px;
                    font-size: 22px;
                    color: #000;
                    background: #f5f6fa !important;
                    border: none;
                    padding-left: 62px;
                }
                .zh-class {
                    width: 480px;
                    z-index: 1;
                    .el-input__inner {
                        width: 100%;
                    }
                }
                .el-select {
                    position: absolute;
                    right: 0;
                    bottom: 0;
                }
                .el-button--primary {
                    height: 70px;
                    margin-top: 40px;
                    font-size: 26px;
                    letter-spacing: 4px;
                    background: $btn_color;
                    border: $btn_color;
                    -webkit-app-region: no-drag;
                }
            }
            .el-input__suffix {
                display: flex;
                align-items: center;
            }
        }
        .prompt-text {
            position: absolute;
            bottom: 10px;
            text-align: center;
            color: #9c9faa;
            font-size: 12px;
            p {
                margin-bottom: 10px;
            }
        }
        .version-text {
            position: absolute;
            bottom: 10px;
            right: 15px;
            font-size: 14px;
        }
    }
}
</style>
