<template>
    <div class="resource-content">
        <div class="resource-list">
            <ResourceItem
                v-for="(item, index) in resourceList"
                :key="index"
                :data="item"
                :btns="false"
                @eventEmit="eventEmit"
            />
        </div>
        <div class="resource-filter"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onActivated, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import ResourceItem from "../preparation/layout/resourceItem.vue";

export default defineComponent({
    components: { ResourceItem },
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
        const router = useRouter();

        const eventEmit = (event: string, data: any, e?: MouseEvent | TouchEvent) => {
            console.log(event, data);
            switch(event) {
                case "delete":
                    break;
                case "version":
                     break;
                case "detail":
                    router.push("/resource/" + data.type + "/" + data.id);
                    break;
            }
        };

        return {
            resourceList,
            eventEmit
        }
    }
});
</script>

<style lang="scss" scoped>
.resource-content {
    flex: 1;
    padding: 15px;
    height: 100%;
    background-color: #F5F6FA;
    overflow-y: auto;
}
</style>
