<template>
    <div>
       <div class="quick-detail">
           <div class="content">
               <div class="header">
                   <span>班级：</span>
                   <el-select v-model="currentClass"  placeholder="请选择">
                       <el-option
                           v-for="item in leftList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"
                       />
                   </el-select>
               </div>
               <div class="process">
                   <div class="title">还未开始抢答</div>
                   <img src="@/assets/images/suspension/pic_avatar.png" alt="">
               </div>
           </div>
           <div class="footer">
               <div class="custom-btn">开始抢答</div>
           </div>
       </div>

       <div class="close-row">
           <div class="close-btn" @click="close">
               <el-icon :size="14" color="#FFFFFF"><close /></el-icon>
               <span>关闭</span>
           </div>
       </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from "vue";
export default defineComponent({
    name: "quickAnswerDetail",
    setup() {
        const state = reactive({
            currentClass: 1,
            leftList: [
                { label: "一年级1班", value: 1 },
                { label: "二年级1班", value: 2 },
                { label: "三年级1班", value: 3 }
            ]
        });
        const close = () => {
            window.electron.destroyWindow();
        };

        return {
            ...toRefs(state),
            close
        };
    }
});
</script>

<style scoped lang="scss">
.quick-detail{
    background-color: #fff;
    border-radius: 8px;
}
.content{
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;
    height: 280px;
    background-image: url("../../assets/images/suspension/qiangda_bg.png") !important;
    background-position: center center;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    .header{
        position: absolute;
        left: 20px;
        top: 10px;
        font-size: 14px;
        color: #fff;
        :deep(.el-select){
            width: 120px;
            .el-input__inner{
                background: transparent;
                border: none;
                color: #fff;
            }
        }
    }
    .process{
        .title{
            font-size: 20px;
            color: #FFFFFF;
            margin: 40px 0;
        }
        img{
            width: 88px;
            height: 88px;
        }
    }
}
.footer{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    margin-top: 20px;
    .custom-btn{
        cursor: pointer;
        width: 196px;
        height: 64px;
        line-height: 50px;
        text-align: center;
        font-size: 16px;
        color: #FFFFFF;
        background: url("../../assets/images/suspension/btn_qd.png") no-repeat center center;
        background-size: 100% 100%;
    }
}

.close-row{
    display: flex;
    justify-content: center;
    width: 100%;
    .close-btn{
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 112px;
        height: 36px;
        line-height: 36px;
        text-align: center;
        font-size: 14px;
        color: #FFFFFF;
        background: rgba(0,0,0,0.2);
        border-radius: 18px;
        border: 1px solid #FFFFFF;
        margin-top: 10px;
        //background-color: pink;
        >span{
            margin-left: 4px;
        }
    }
}

</style>
