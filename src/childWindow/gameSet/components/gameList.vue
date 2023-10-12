<template>
   <div class="game-list">
       <div class="header flex_between">
           <div class="title">互动游戏</div>
           <el-icon size="20" @click="close" color="#7A8393"><Close /></el-icon>
       </div>
       <div class="content">
           <div class="item" v-for="(item,index) in list" :key="index">
               <img :src="item.imgUrl" alt="">
               <div class="title">{{item.Name}}</div>
               <div class="item-footer flex_between">
                   <div class="flex_between" @click="openGame(item)">
                       <el-icon size="18" color="#7A8393"><VideoPlay /></el-icon>
                       <span>进入游戏</span>
                   </div>
                   <div class="flex_between" @click="gameSet(item)">
                       <el-icon size="18" color="#7A8393"><Setting /></el-icon>
                       <span>配置</span>
                   </div>
               </div>
           </div>
       </div>
   </div>

    <game-type-set v-if="gameSetVisible" v-model="gameSetVisible" :currentGame="currentGame"></game-type-set>
</template>

<script lang="ts" setup>
import { reactive, toRefs } from "vue";
import { getGameToolList } from "@/api/game";
import { getOssUrl } from "@/utils/oss";
import { IGameItem } from "@/types/game";
import GameTypeSet from "@/childWindow/gameSet/components/gameTypeSet.vue";
interface State {
    list: IGameItem[],
    currentGame: IGameItem,
    gameSetVisible: boolean
}
const state = reactive<State>({
    list: [],
    currentGame: {} as IGameItem,
    gameSetVisible: false
});

const { list, currentGame, gameSetVisible } = toRefs(state);

const close = () => {
    window.electron.destroyWindow();
};

const openGame = (item:IGameItem) => {
    window.electron.ipcRenderer.invoke("openSubjectTool", item.Url, "游戏");
};

const gameSet = (item:IGameItem) => {
    state.currentGame = item;
    state.gameSetVisible = true;
    console.log(state.currentGame, "state.currentGame");
    console.log(state.gameSetVisible, "state.gameSetVisible");
};

const _getGameToolList = () => {
    const data = { state: 2, name: "" };
    getGameToolList(data).then(async res => {
        if (res.resultCode === 200) {
            const data = res.result || [];
            for (let i = 0; i < data.length; i++) {
                if (data[i].File) {
                    const fileInfo = await getOssUrl(`${data[i].File.FilePath}/${data[i].File.FileName}.${data[i].File.Extention}`, `${data[i].File.Bucket}`);
                    data[i].imgUrl = fileInfo;
                }
            }
            state.list = data;
        }
    });
};
_getGameToolList();

</script>

<style scoped lang="scss">
.flex_between{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.game-list{
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    border-radius: 8px 8px 0px 0px;
    background: #F6F7F8;
    .header{
        height: 60px;
        background: #FFFFFF;
        box-shadow: inset 0px -1px 0px 0px #EBEFF1;
        padding: 0 20px;
        .title{
            font-size: 16px;
            font-weight: 600;
            color: #414E65;
        }
        :deep(.icon){
            cursor: pointer;
            width: 20px;
            height: 20px;
        }
    }
    .content{
        flex: 1;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        margin: 20px 20px 20px 10px;
        overflow-y: auto;
        .item{
            margin-left: 10px;
            margin-bottom: 10px;
            border-radius: 4px 4px 0px 40;
            img{
                width: 240px;
                height: 144px;
                object-fit: cover;
            }
            .title{
                font-size: 14px;
                font-weight: 600;
                color: #414E65;
                padding: 10px;
                background: #fff;
            }
            .item-footer{
                padding: 0 10px 10px 10px;
                font-size: 14px;
                color: #7A8393;
                display: flex;
                background: #fff;
                border-radius: 0px 0px 4px 4px;
                >div{
                    cursor: pointer;
                }
                :deep(.icon){
                    margin-right: 4px;
                    vertical-align: bottom;
                }
            }
        }
    }
}
</style>
