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
                        ></el-option>
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
            <div class="prompt-text">
                <p>违法和不良信息举报电话：0512-65520773</p>
                <p>举报邮箱：zhangyunlong@upplus.net</p>
            </div>
            <div class="version-text">版本:{{ packageInfo.version }}</div>
        </div>
    </div>
</template>

<script>
import { get, set } from "@/utils/storage.js";
import { Login, LessonManager, GetGradeClassTree, GetBasicTag } from "./api";
import isElectron from "is-electron";
export default {
    name: "index",
    data() {
        this.packageInfo = require("../../../package.json");
        return {
            form: {
                account: "",
                password: ""
            },
            recordAccountList: [],
            loading: false
        };
    },
    methods: {
        async login() {
            const { account, password } = this.form;
            if (account.length === 0 || password.length === 0) return false;
            this.loading = true;
            const res = await Login({ account, password });
            this.loading = false;
            if (res.resultCode === 200) {
                set("SET_TOKEN", res.result.token);
                this.recordAccount();
                const userinfo = await LessonManager();
                if (userinfo.resultCode === 200) {
                    set("USER_INFO", userinfo.result);
                }
                const GetGradeClassList = await GetGradeClassTree();
                if (GetGradeClassList.resultCode === 200) {
                    set("GradeClassList", GetGradeClassList.result);
                }
                const GetBasicTagList = await GetBasicTag();
                if (GetBasicTagList.resultCode === 200) {
                    set("GetBasicTagList", GetBasicTagList.result);
                }
                if (isElectron()) {
                    ipcRenderer.send("maximizeWindow");
                }
                this.$router.push("home");
            }
        },
        handleChange(account) {
            this.recordAccountList.forEach((item) => {
                if (item.account === account) {
                    this.form.password = item.password;
                }
            });
        },
        // 记录账号
        recordAccount() {
            const { account } = this.form;
            const recordList = get("RECORD_LOGIN_LIST") || [];
            const index = recordList.findIndex(
                (item) => item.account === account
            );
            index > -1
                ? (recordList[index] = this.form)
                : recordList.unshift(this.form);
            set("RECORD_LOGIN_LIST", recordList);
        },
        getRecordAccount() {
            this.recordAccountList = get("RECORD_LOGIN_LIST") || [];
        }
    },
    mounted() {
        this.getRecordAccount();
    }
};
</script>

<style scoped lang="scss">
$btn_color: #4b71ee;
.login-content {
    display: flex;
    width: 100%;
    height: 100%;
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
        /deep/.el-form {
            .el-form-item {
                position: relative;
                margin-bottom: 32px;
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
                }
            }
        }
        .prompt-text {
            position: absolute;
            bottom: 10px;
            text-align: center;
            color: #9c9faa;
            font-size: 10px;
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
