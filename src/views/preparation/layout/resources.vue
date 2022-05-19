<template>
    <div class="p-layout-list">
        <!-- <div class="tip">
            <img src="@/assets/images/preparation/pic_finish_buzhi.png" alt="">
            请选择书册
        </div> -->
        <ResourceItem
            v-for="(item, index) in resourceList"
            :key="index"
            :data="item"
            @eventEmit="eventEmit"
        />

        <DeleteTip
            :target="target"
            v-model:visible="deleteTipVisible"
        />

         <EditTip
            :target="target"
            v-model:visible="editTipVisible"
        />

        <ResourceVersion
            :target="target"
            v-model:visible="resourceVersionVisible"
        />

        <DeleteVideoTip 
            :target="target"
            v-model:visible="deleteVideoTipVisible"
        />

        <ResourceView
            :target="target"
            v-model:visible="resourceVisible"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import ResourceItem from "./resourceItem.vue";
import DeleteTip from "./dialog/deleteTip.vue";
import EditTip from "./dialog/editTip.vue";
import ResourceVersion from "./dialog/resourceVersion.vue";
import DeleteVideoTip from "./dialog/deleteVideoTip.vue";
import ResourceView from "./dialog/resourceView.vue";
import { getDomOffset, sleep } from "@/utils/common";

export default defineComponent({
    components: { ResourceItem, DeleteTip, EditTip, ResourceVersion, DeleteVideoTip, ResourceView },
    setup() {
        const resourceList = ref([
            {
                type: 0,
                source: 0,
                name: "数一数",
                difficulty: 0,
                updateTime: "2021-10-20 11:5",
                size: 182912,
                view: 23
            },
            {
                type: 1,
                source: 1,
                name: "数一数",
                difficulty: 0,
                updateTime: "2021-10-20 11:5",
                size: 453322,
                view: 23
            },
            {
                type: 2,
                source: 2,
                name: "数一数",
                difficulty: 1,
                updateTime: "2021-10-20 11:5",
                size: 342245,
                view: 23
            },
            {
                type: 3,
                source: 3,
                name: "补图形",
                difficulty: 2,
                updateTime: "2021-10-20 11:5",
                size: 2343343,
                view: 23
            },
            {
                type: 3,
                source: 3,
                name: "补图形",
                difficulty: 2,
                updateTime: "2021-10-20 11:5",
                size: 2343343,
                view: 23
            },
            {
                type: 3,
                source: 3,
                name: "补图形",
                difficulty: 2,
                updateTime: "2021-10-20 11:5",
                size: 2343343,
                view: 23
            },
            {
                type: 3,
                source: 3,
                name: "补图形",
                difficulty: 2,
                updateTime: "2021-10-20 11:5",
                size: 2343343,
                view: 23
            },
            {
                type: 3,
                source: 3,
                name: "补图形",
                difficulty: 2,
                updateTime: "2021-10-20 11:5",
                size: 2343343,
                view: 23
            }
        ]);

        const deleteTipVisible = ref(false);
        const editTipVisible = ref(false);
        const resourceVersionVisible = ref(false);
        const deleteVideoTipVisible = ref(false);
        const resourceVisible = ref(false);
        const target = ref("");
        const leftEnd = ref(0);
        const topEnd = ref(0);
        const eventEmit = (event: string, data: any, e?: MouseEvent | TouchEvent) => {
            console.log(event, data);
            switch(event) {
                case "delete":
                    deleteVideoTipVisible.value = true;
                    break;
                case "edit":
                    editTipVisible.value = true;
                    break;
                case "version":
                    resourceVersionVisible.value = true;
                    break;
                case "download":
                    break;
                case "add":
                    if (e) dealFly(e);
                    break;
                case "move":
                    break;
                case "detail":
                    resourceVisible.value = true;
                    break;
            }
        };

        const dealFly = async (event: MouseEvent | TouchEvent) => {
            // 简单的加入购物车动画
            const x = event instanceof MouseEvent ? event.pageX : event.changedTouches[0].pageX;
            const y = event instanceof MouseEvent ? event.pageY : event.changedTouches[0].pageY;
            const img = document.createElement("img");
            img.src = require("@/assets/images/preparation/resources/icon_cjkejian_star.png");
            img.style.position = "fixed";
            img.style.display = "block";
            img.style.width = "50px";
            img.style.height = "50px";
            img.style.borderRadius = "25px";
            img.style.top = y + "px";
            img.style.left = x + "px";
            img.style.transition = "all 0.5s linear,top 0.5s cubic-bezier(.28,.94,0,.8)";
            img.onload = async () => {
                document.body.appendChild(img);
                await sleep(100);
                img.style.left = leftEnd.value + "px";
                img.style.top = topEnd.value + "px";
                await sleep(500);
                img.remove();
            };
        };

        onMounted(() => {
            const cart = document.getElementById("myCourseCart");
            if (cart) {
                const { left, top } = getDomOffset(cart);
                leftEnd.value = left + 20;
                topEnd.value = top - 40;
            }
        });

        return {
            resourceList,
            target,
            deleteTipVisible,
            editTipVisible,
            resourceVersionVisible,
            deleteVideoTipVisible,
            eventEmit,
            resourceVisible
        };
    }
});
</script>

<style lang="scss" scoped>
.p-layout-list {
    flex: 1;
    min-height: 0;
    min-width: 0;
    position: relative;
    padding: 0 20px;
    overflow-y: auto;
}

.tip {
    width: 200px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 400;
    img {
        margin-bottom: 10px;
    }
}
</style>
