<template>
    <el-col :md="6" :lg="4">
        <el-dropdown
            :style="{display: 'block'}"
        >
            <template #dropdown>
                <el-dropdown-menu class="popover-content">
                    <el-dropdown-item>
                        <div class="popover-item">
                            <img src="@/assets/my-student/icon_jilu@2x.png" />
                            <span>学习记录</span>
                        </div>
                    </el-dropdown-item>
                    <el-dropdown-item>
                        <div class="popover-item">
                            <img src="@/assets/my-student/icon_xinxi@2x.png" />
                            <span>个人信息</span>
                        </div>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
            <div class="student">
                <Avatar/>
                <div class="student-userinfo">
                    <p class="student-name">{{ item.Name }}</p>
                    <p class="student-phone" :class="!item.Phone ? 'student-phone-no' : ''">
                        {{ item.Phone ? item.Phone : '未绑定家长' }}
                    </p>
                    <p class="student-account">{{ item.Account }}</p>
                </div>
            </div>
        </el-dropdown>
    </el-col>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import Avatar from "@/components/avatar/index.vue";
import { Student } from "@/types/myStudent";
export default defineComponent({
    components: { Avatar },
    props: {
        item: {
            type: Object as PropType<Student>,
            required: true
        }
    }
    // setup() {
    // }
});
</script>

<style lang="scss" scoped>
    .student {
        height: 100px;
        background: #fff;
        border-radius: 4px;
        display: flex;
        cursor: pointer;
        border: 1px solid #fff;
        margin-bottom: 16px;
        padding: 19px 21px 21px;
        align-items: center;
        &:hover {
            background: #e6ecff;
            border-color: #98aef6;
        }

        .student-userinfo {
            margin: 0;
            padding: 0 0 0 16px;
            flex: 1;
            overflow: hidden;
            .student-phone {
                font-size: 12px;
                margin-top: 4px;
                font-weight: 500;
                color: #5f626f;
                line-height: 17px;
            }
            .student-name {
                font-size: 16px;
                font-weight: 500;
                color: #19203d;
                line-height: 22px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .student-account {
                margin-top: 2px;
                font-size: 12px;
                font-weight: 500;
                color: #5f626f;
            }
            .student-phone-no {
                color: #ff6b6b;
            }
        }
    }
    .popover-content {
        width: 240px;
        padding: 16px 0;
        .popover-item {
            display: flex;
            align-items: center;
            height: 48px;
            cursor: pointer;
            font-size: 16px;
            color: #19203d;
            img {
                width: 16px;
                margin-right: 12px;
            }
        }
    }
</style>
