<template>
  <div class="helper-container">
    <div class="header">
      <img src="@/assets/images/suspension/pic_tittle_zhike@2x.png"
           alt="" />
      <div class="right-btns">
        <div class="right-btn"
             @click="$emit('close-helper')">
          <svg t="1623303211083"
               class="icon"
               viewBox="0 0 1024 1024"
               version="1.1"
               xmlns="http://www.w3.org/2000/svg"
               p-id="2457"
               width="200"
               height="200">
            <path d="M128 448h768v128H128z"
                  p-id="2458"
                  fill="#ffffff"></path>
          </svg>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="tool-list">
        <div class="blackboard-box"
             @click="openBlackboard()">
          <img src="@/assets/images/suspension/pic_blackboard@2x.png"
               alt="" />
          <div class="blackboard-text">黑板</div>
          <!-- <div class="blackboard-btn" @click="openBlackboard()">打开</div> -->
        </div>
        <div class="blackboard-box"
             @click="opentTimer()">
          <img src="@/assets/images/suspension/pic_blackboard@2x.png"
               alt="" />
          <div class="blackboard-text">计时器</div>
        </div>
      </div>

      <div class="teach-list">
        <p class="teach-list-title">教学助手</p>
        <div class="teach-class">
          <div class="teach-content"
               v-for="(item, index) in gameList"
               :key="index"
               @click="openUrl(item.url)">
            <div class="img-warp">
              <img :src="item.imgUrl" />
            </div>
            <p>{{item.name}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { Game } from "./interface";
import { getToolList } from "@/api/index";
import { downloadFile } from "@/utils/oss";
export default defineComponent({
    setup(props, { emit }) {
        const gameList = ref<Game[]>([]);
        const openBlackboard = () => {
            window.open("/blackboard/");
        };
        const opentTimer = () => {
            console.log("打开定时器");
            emit("close-helper");
        };
        const getGradeList = async () => {
            const res = await getToolList();
            if (res.resultCode === 200) {
                const list = res.result;
                const imgListPromise = list.map(item => {
                    const { File } = item;
                    const { FileName, Bucket, FilePath, Extention } = File;
                    const key = `${FilePath}/${FileName}.${Extention}`;
                    return downloadFile(key, Bucket);
                });
                const imgList = await Promise.all(imgListPromise);
                gameList.value = list.map((item, index) => ({ url: item.Url, imgUrl: imgList[index], name: item.Name }));
            }
        };
        const openUrl = (url:string) => {
            window.open(url);
        };
        onMounted(getGradeList);
        return {
            openBlackboard,
            opentTimer,
            getGradeList,
            openUrl,
            gameList
        };
    }
});
</script>

<style lang="scss" scoped>
.helper-container {
  position: fixed;
  right: 0;
  bottom: 0;
  width: 470px;
  height: 800px;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  background: #1a1d3e;
  .header {
    height: 55px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    box-sizing: border-box;
    padding: 0 15px;
    img {
      width: 150px;
      display: block;
    }
    .right-btns {
      display: flex;
      align-items: center;
    }
    .right-btn {
      width: 25px;
      height: 25px;
      svg {
        width: 25px;
        height: 25px;
        cursor: pointer;
      }
    }
  }
  .container {
    flex: 1;
    display: flex;
    padding: 0 15px 15px;
    overflow-y: auto;
    flex-direction: column;
    .tool-list {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      color: #fff;
      margin: 10px 0 10px 30px;
    }
    .blackboard-box {
      padding: 10px;
      background-color: #2b314b;
      border-radius: 8px;
      margin-right: 20px;
      margin-bottom: 10px;
      text-align: center;
      cursor: pointer;
    }

    .blackboard-box img {
      width: 100px;
      height: auto;
    }

    .blackboard-text {
      color: #ffffff;
      font-size: 16px;
      margin-top: 10px;
    }

    .blackboard-btn {
      padding: 6px 30px;
      border-radius: 3px;
      border: 1px solid #aaaaaa;
      color: #ffffff;
      cursor: pointer;
      font-size: 16px;
    }

    .blackboard-btn:hover {
      border-color: #aaaaaa;
      color: #aaaaaa;
    }
    .teach-list {
      flex: 1;
      display: flex;
      overflow-y: auto;
      flex-direction: column;
      .teach-list-title {
        margin: 20px 0;
        color: #ffffff;
        font-weight: 600;
        font-size: 18px;
      }
      .teach-class {
        flex: 1;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        color: #fff;
        overflow-y: auto;
        margin: 10px 0 10px 30px;
        &::-webkit-scrollbar {
          display: none;
        }
        .teach-content {
          margin-right: 20px;
          margin-bottom: 10px;
          text-align: center;
          cursor: pointer;
          flex: 1;
          .img-warp {
            width: 108px;
            height: 108px;
            background: #d1eaff;
            display: flex;
            justify-content: center;
            img {
              object-fit: contain;
            }
          }

          p {
            margin: 10px 0;
          }
        }
      }
    }
  }
}
</style>
