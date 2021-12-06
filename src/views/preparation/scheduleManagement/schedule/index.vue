<template>
    <div>
        <Calendar
            :days="days"
            ref="calendarRef"
            :isShowText="true"
            :isDrop="true"
            :isShowDetailBtn="true"
        >
            <header>
                <div class="left">
                    <div>
                        <div></div>
                        <span>历史课程</span>
                    </div>
                    <div>
                        <div></div>
                        <span>待上课程</span>
                    </div>
                    <div>
                        <div></div>
                        <span>缺课包</span>
                    </div>
                </div>
                <div class="date">
                    <span @click="weekPre"
                        ><i class="el-icon-arrow-left"></i
                    ></span>
                    <span> {{ nowTime }} ~ {{ lateTime }}</span>
                    <span @click="weekNext"
                        ><i class="el-icon-arrow-right"></i
                    ></span>
                </div>
                <div @click="templatesVisible = true" >
                    <img
                        src="~@/assets/indexImages/icon_guanlimuban.png"
                        alt=""
                    />
                    <span>管理模板</span>
                </div>
            </header>
        </Calendar>
        <ManageTemplates
            v-if="templatesVisible"
            v-model:dialogVisible="templatesVisible"
            @success="success"
        />
    </div>
</template>

<script lang="ts">
import useTime from "@/hooks/useTime";
import { defineComponent, ref } from "vue";
import Calendar from "@/components/calendar/index.vue";
import ManageTemplates from "./ManageTemplates.vue";
export default defineComponent({
    setup() {
        const templatesVisible = ref(false);
        const calendarRef = ref<InstanceType<typeof Calendar>>();
        const { days, initDays, nowTime, lateTime, weekPre, weekNext } = useTime();
        initDays();

        const success = () => {
            calendarRef.value && calendarRef.value.updateClassSchedule();
        };
        return {
            days,
            nowTime,
            lateTime,
            weekPre,
            success,
            calendarRef,
            templatesVisible,
            weekNext
        };
    },
    components: { Calendar, ManageTemplates }
});
</script>

<style lang="scss" scoped>
header {
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
    border-bottom: 2px solid #e0e2e7;
    > div:nth-of-type(1) {
        font-size: 12px;
        color: #5f626f;
        > div {
            padding: 0 20px 0 0;
            display: flex;
            align-items: center;
        }
        span {
            padding: 0 0 0 5px;
        }
        > div:nth-of-type(1) {
            div {
                width: 12px;
                height: 12px;
                background: #ddfbe8;
                border-radius: 1px;
                border: 1px solid #8cdda9;
            }
        }
        > div:nth-of-type(2) {
            div {
                width: 12px;
                height: 12px;
                background: #cbdaff;
                border-radius: 1px;
                border: 1px solid #4b71ee;
            }
        }
        > div:nth-of-type(3) {
            div {
                width: 12px;
                height: 12px;
                background: #ffe8e8;
                border-radius: 1px;
                border: 1px solid #ff9d9d;
            }
        }
    }
    .left {
        span {
            color: #6b8bf1;
            display: block;
        }
    }
    .date {
        span {
            cursor: pointer;
        }
    }
    > div {
        display: flex;
        justify-content: space-around;
        align-items: center;
        span {
            padding: 0px 30px 0 30px;
        }
        span:nth-of-type(2) {
            pointer-events: none;
            display: block;
            user-select: none;
        }
        span:nth-of-type(1) {
            color: #6b8bf1;
            display: block;
        }
        span:nth-of-type(3) {
            color: #6b8bf1;
            display: block;
            cursor: pointer;
        }
    }
    > div:nth-of-type(3) {
        width: 100px;
        border: 1px solid #98aef6;
        padding: 10px;
        font-size: 12px;
        font-weight: 400;
        color: #4b71ee;
        cursor: pointer;
        span {
            padding: 0;
        }
    }
}
</style>
