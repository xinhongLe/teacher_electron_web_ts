<template>
    <div class="fixed" v-if="visible">
        <div class="main">
            <header>
                <div></div>
                <div @click="cancel">
                    <img src="../../assets/indexImages/cuo.png" alt="" class="close-icon"/>
                </div>
            </header>
            <div class="center">
                <div class="left">
                    <img src="../../assets/indexImages/logo.png" alt="" />
                </div>
                <div class="right">
                    <div class="top">是否退出爱学仕校园？</div>
                    <div class="bottom">
                        <button @click="cancel">取消</button>
                        <button @click="sure">确定</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
// import useOutLogin from "@/hooks/useOutLogin";
import isElectron from "is-electron";
import { defineComponent } from "vue";
export default defineComponent({
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    setup(props, { emit }) {
        const cancel = () => {
            emit("update:visible", false);
        };

        const sure = () => {
            cancel();
            // useOutLogin();
            if (isElectron()) {
                window.electron.exit();
            }
        };

        return {
            sure,
            cancel
        };
    }
});
</script>

<style lang="scss" scoped>
.fixed {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 102;
    user-select: none;
    background: rgba(0, 0, 0, 0.8);
    /* display: none; */
}

.fixed > .main {
    width: 450px;
    height: 220px;
    background: #ffffff;
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 10px;
}

.fixed > .main > header {
    width: 100%;
    height: 50px;
    box-sizing: border-box;
    border-bottom: 1px solid #dddd;
    display: flex;
    align-items: center;
    padding: 0 20px 0 20px;
    justify-content: space-between;
    .close-icon {
        width: 32px;
        height: 32px;
    }
}

.fixed .center {
    padding: 20px;
    display: flex;
}

.fixed .center > .left {
    padding: 0 20px 0 20px;
}

.fixed .center > .left > img {
    width: 100px;
    height: 100px;
}
.fixed .center > .right > .top {
    font-size: 20px;
    margin-top: 15px;
}
.fixed .center > .right > .bottom {
    display: flex;
    justify-content: space-between;
}
.fixed .center > .right > .bottom button {
    margin-top: 15px;
    width: 70px;
    height: 36px;
    outline: none;
    border: none;
    border-radius: 10px;
    cursor: pointer;
}
.fixed .center > .right > .bottom button:nth-of-type(2) {
    background: rgb(60, 143, 255);
    color: #ffffff;
}
.fixed .center > .right > .bottom button:hover {
    box-shadow: 0 0 5px 4px #918f8f; /*盒子阴影*/
    transition: all 0.5s; /*持续时间*/
}
</style>
