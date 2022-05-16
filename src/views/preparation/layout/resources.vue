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
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import ResourceItem from "./resourceItem.vue";
import DeleteTip from "./dialog/deleteTip.vue";
import EditTip from "./dialog/editTip.vue";
import ResourceVersion from "./dialog/resourceVersion.vue";
import DeleteVideoTip from "./dialog/deleteVideoTip.vue";

export default defineComponent({
    components: { ResourceItem, DeleteTip, EditTip, ResourceVersion, DeleteVideoTip },
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
            }
        ]);

        const deleteTipVisible = ref(false);
        const editTipVisible = ref(false);
        const resourceVersionVisible = ref(false);
        const deleteVideoTipVisible = ref(false);
        const target = ref("");
        const eventEmit = (event: string, data: any) => {
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
            }
        };

        return {
            resourceList,
            target,
            deleteTipVisible,
            editTipVisible,
            resourceVersionVisible,
            deleteVideoTipVisible,
            eventEmit
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
