<template>
    <el-dialog
        :close-on-click-modal="false"
        title=""
        v-model="visible"
        width="1100px"
        @close="close"
    >
        <div class="header">
            <div>
                <div class="title">
                    <img
                        v-if="templateData.Type === 5"
                        src="@/assets/images/material/icon_jpzy_2.png"
                        alt=""
                    />{{ templateData?.Name }}
                </div>
                <div class="text" v-if="templateData.Type === 5">
                    系统精品资源
                </div>
                <div class="text" v-else>
                    <el-icon><Clock /></el-icon>预估时长：{{
                        templateData?.EstimatedDuration
                    }}分钟
                </div>
            </div>
            <div v-if="templateData.Type === 5" class="video_header">
                <div class="cvideo" v-if="templateData.url2">
                    <img src="@/assets/images/material/icon_cj.png" alt="" />
                </div>
                <el-button size="large" type="primary" @click="insertVideo"
                    >插入视频</el-button
                >
            </div>
            <div v-else>
                <el-button size="large" type="primary" @click="handleInsert(1)"
                    >全部插入</el-button
                >
            </div>
        </div>
        <div class="content">
            <!-- type为5视频裁剪 -->
            <div class="row" v-if="templateData.Type === 5">
                <video object-fit="cover" :src="templateData.url2" controls>
                    您的浏览器不支持视频播放
                </video>
            </div>
            <div
                class="row"
                v-else
                v-for="item in templateData.CardData[0]?.PageList"
                :key="item"
            >
                <!-- 游戏页或者教具页 显示大图 -->
                <el-image
                    v-if="item.Type === 20 || item.Type === 16"
                    :src="item.url"
                    fit="cover"
                >
                    <template #error>
                        <div class="image-slot">加载失败...</div>
                    </template>
                </el-image>
                <!-- 其它页显示源资源 -->
                <ThumbnailSlide
                    v-else
                    :slide="pageListMap.get(item.ID) || {}"
                    :size="1040"
                ></ThumbnailSlide>
                <div
                    class="custom-btn"
                    size="large"
                    @click="handleInsert(2, item)"
                    type="primary"
                >
                    插入本页
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from "vue";
export default defineComponent({
    name: "templateView",
    props: {
        dialogVisible: {
            type: Boolean,
            require: true,
        },
        currentSelectTemplate: {
            type: Object,
            required: true,
        },
        allPageListMap: {
            type: Object,
            required: true,
        },
    },

    emits: ["update:dialogVisible", "insertData", "insertMaterial"],
    setup(props, { emit }) {
        const visible = computed(() => props.dialogVisible);
        const templateData = computed(() => props.currentSelectTemplate);

        const pageListMap = computed(() => props.allPageListMap);
        const close = () => {
            emit("update:dialogVisible", false);
        };
        const handleInsert = (val: number, page?: any) => {
            if (val === 1) {
                emit("insertData", {
                    type: "page",
                    data: templateData.value.CardData[0]?.PageList,
                    teachPageTemplateID: templateData.value.TeachPageTemplateID,
                });
            } else {
                emit("insertData", {
                    type: "page",
                    data: [page],
                    teachPageTemplateID: templateData.value.TeachPageTemplateID,
                });
            }
            close();
        };
        //插入视频
        const insertVideo = () => {
            emit("insertMaterial", { showType: 0, ...templateData.value });
        };

        return {
            visible,
            templateData,
            pageListMap,
            handleInsert,
            insertVideo,
            close,
        };
    },
});
</script>

<style scoped lang="scss">
.el-dialog {
    height: 800px;
}
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    .title {
        font-size: 20px;
        font-weight: 600;
        color: #212121;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        img {
            margin-right: 12px;
        }
    }
    .text {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #90949e;
        .el-icon {
            margin-right: 6px;
        }
    }
    .video_header {
        display: flex;
        .cvideo {
            width: 40px;
            height: 40px;
            background: #ffffff;
            border-radius: 4px;
            border: 1px solid #d8dbdd;
            margin-right: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }
    }
}

.content {
    height: 800px;
    padding: 0 10px;
    overflow-y: auto;
    .row {
        position: relative;
        margin-bottom: 20px;
        box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.1);
        .custom-btn {
            position: absolute;
            right: 20px;
            bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 104px;
            height: 40px;
            background: #212121;
            border-radius: 4px;
            color: #fff;
            cursor: pointer;
        }
        :deep(.el-image) {
            width: 100%;
            height: 585px;
        }
        video {
            width: 100%;
        }
    }
}
</style>
