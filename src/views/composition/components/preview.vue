
<template>
    <div class="preview" v-if="dialogVisible">
        <img class="close" @click="close" src="../../../assets/composition/icon_close@2x.png" alt="" />
        <div class="main">
            <img @click="prev" v-if="active > 0" class="prev" src="../../../assets/composition/icon_arrow_left@2x.png"
                alt="" />
            <!-- v-if="active>0" -->
            <img v-if="Number(active)!==imgList.length-1" @click="next" class="next" src="../../../assets/composition/icon_arrow_right@2x.png" alt="" />
            <div class="img-box">
                <img :src="current" alt="" />
            </div>
        </div>
        <div class="bottom">
            <div :class="['img-wrapper',Number(active)===Number(idx)&&'active']" v-for="(item,idx) in imgList" :key="idx" @click="changeCurrent(item,idx)">
                <img :src="item.url" alt="" />
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { reactive, ref, toRefs, watch, nextTick } from 'vue';

//
const props = defineProps({
    imgList: {
        type: Object,
        default: () => {
            return []
        }
    }
})
const {imgList} = toRefs(props)
//
const state = reactive({
    active: 0,
    current:'',
    dialogVisible: false
});
const { active,dialogVisible,current } = toRefs(state);

const emit = defineEmits(['cancel', 'back', 'afterChoose']);

const changeCurrent = (item:any,idx: number | string) => {
    state.active = Number(idx)
    state.current = props.imgList[idx].url
}

const close = () => {
    state.dialogVisible = false
}

const openDialog = (idx:number)=>{
    state.active = idx
    state.dialogVisible = true
    state.current = props.imgList[idx].url
}

const prev = () => {
    state.active--
    state.current = props.imgList[state.active].url
}

const next = () => {
    state.active++
    state.current = props.imgList[state.active].url
}

const backScan = () => {
    emit('back')
}

defineExpose({
    openDialog
})
</script>
<style lang="scss" scoped>
.preview {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 900;
    background-color: fade-out($color: #000000, $amount: 0.5);

    .close {
        position: absolute;
        right: 40px;
        top: 40px;
        width: 42px;
        height: 42px;
        cursor: pointer;
    }

    .main {
        height: calc(100% - 104px);
        min-height: 500px;
        overflow-y: auto;
        position: relative;
        width: 80vw;
        margin: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 60px 100px 30px 100px;
        box-sizing: border-box;

        .img-box {
            max-height: 100%;
            max-width: 100%;

            img {
                width: 100%;
                height: 100%;
                max-height: 720px;
                object-fit: contain;
            }
        }

        .prev {
            position: absolute;
            left: 0;
            top: 50%;
            width: 56px;
            height: 56px;
            cursor: pointer;
        }

        .next {
            position: absolute;
            right: 0;
            top: 50%;
            width: 56px;
            height: 56px;
            cursor: pointer;
        }
    }

    .bottom {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 104px;
        background-color: fade-out($color: #000000, $amount: 0.6);
        display: flex;
        align-items: center;
        justify-content: center;

        .img-wrapper {
            width: 72px;
            height: 72px;
            border-radius: 4px;
            box-sizing: border-box;
            margin-right: 12px;

            &.active {
                border: 2px solid #4B71EE;
            }

            img {
                width: 100%;
                height: 100%;
            }
        }
    }
}
</style>