<template>
     <div class="container">
        <div class="student-once">
            <div class="student-useravator">
                <Avatar :file="HeadPortrait"></Avatar>
            </div>
            <div class="student-userinfo">
                <p class="student-name">{{ name }}</p>
                <p class="student-classname">{{ className }}</p>
                <!-- <p class="student-name">{{item.StudentName}}</p>
                <p class="student-classname">{{item.StudentClassName}}</p> -->
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import Avatar from "@/components/avatar/index.vue";
import { HeadPortrait } from "@/types/myStudent";
export default defineComponent({
    props: {
        name: {
            type: String,
            default: ""
        },
        className: {
            type: String,
            default: ""
        },
        HeadPortrait: {
            type: Object as PropType<HeadPortrait>,
            default: () => ({})
        }
    },
    components: { Avatar }
});
</script>

<style lang="scss" scoped>
.container {
    width: 18%;
}
.student-once {
    margin: 8px 8px 8px 8px;
    width: 250px;
    height: 72px;
    background: #fff;
    display: flex;
    padding: 17px 22px;
    justify-content: space-between;
    .student-useravator {
        display: flex;
        align-items: center;
        img {
            width: 38px;
            height: 38px;
            border-radius: 38px;
        }
    }
    .student-userinfo {
        margin: 0;
        padding: 0 0 0 18px;
        flex: 1;
        overflow: hidden;
        .student-classname {
            font-size: 12px;
            line-height: 18px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-weight: 500;
            color: #5f626f;
        }
        .student-name {
            font-size: 16px;
            line-height: 22px;
            font-family: PingFang-SC-Medium, PingFang-SC;
            font-weight: 500;
            color: #19203d;
        }
    }
}
</style>
