<template>
    <el-popover :placement="placement" :width="50" trigger="hover">
        <template #reference>
            <slot></slot>
        </template>
        <div class="operation" v-if="!flag">
            <template v-if="!data.ParentID">
                <div @click.stop="handleItem(1)">
                    <img src="@/assets/edit/icon_file_add.png" alt=""/>
                    新增文件夹
                </div>
                <div @click.stop="handleItem(2)">
                    <img src="@/assets/edit/icon_page_add.png" alt=""/>
                    新增空白页
                </div>
                <div @click.stop="handleItem(5)">
                    <img src="@/assets/edit/icon_nt.png" alt=""/>
                    粘贴页
                </div>
            </template>
            <template v-else>
                <div @click.stop="handleItem(4)">
                    <img src="@/assets/edit/icon_yc.png" alt=""/>
                    {{ data.State ? "隐藏" : "显示" }}
                </div>
                <!--游戏页暂不支持复制-->
                <div v-if="data.Type !== 20" @click.stop="handleItem(6)">
                    <img src="@/assets/edit/icon_copy.png" alt=""/>
                    复制页
                </div>
                <div v-show="data.Type !== 20" @click.stop="handleItem(7)">
                    <img src="@/assets/edit/icon_save.png" alt=""/>
                    保存模板
                    <el-popover placement="right-start" :width="222" trigger="hover" effect="dark" class="tips-popover" :teleported="true">
                        <template #reference>
                            <img src="@/assets/edit/icon_wenti.png" alt="" style="margin-left:4px "/>
                        </template>
                        <div class="tips">
                            <div class="title" @click.stop>
                                <img src="@/assets/edit/pic_wenti.png" alt=""/>
                                小贴士
                            </div>
                            <p>
                                试试按住Shift键点选多页 <br/>
                                鼠标右击「<i>批量保存模板</i>」
                            </p>
                        </div>
                    </el-popover>
                </div>
            </template>

            <div @click.stop="handleItem(3)">
                <img src="@/assets/edit/icon_cmm.png" alt=""/>
                重命名
            </div>
            <div @click.stop="handleItem(8)" class="delete">
                <img src="@/assets/edit/icon_delete.png" alt=""/>
                删除
            </div>
        </div>
        <div class="operation" v-else>
            <div @click.stop="handleItem(2)">
                <img src="@/assets/edit/icon_file_add.png" alt=""/>
                新增空白页
            </div>
            <div @click.stop="handleItem(9)">
                <img src="@/assets/edit/icon_page_add.png" alt=""/>
                新增互动页
            </div>
        </div>
    </el-popover>
</template>

<script lang=ts>
import { computed, defineComponent, PropType } from "vue";
import { CardProps, PageProps } from "@/views/preparation/intelligenceClassroom/api/props";

export default defineComponent({
    name: "CardPopover",
    props: {
        data: {
            type: Object as PropType<CardProps | PageProps>,
            default: null
        },
        placement: {
            type: String,
            default: "right-start"
        }
    },
    emits: ["handle"],
    setup(props, { emit, attrs }) {
        const handleItem = (type: number) => {
            emit("handle", type, props.data);
        };

        const flag = computed(() => attrs.add === "");

        return {
            flag,
            handleItem
        };
    }
});
</script>

<style scoped lang="scss">
.operation {
    text-align: left;

    img {
        width: 16px;
        height: 16px;
        margin-right: 8px;
    }

    & > div {
        cursor: pointer;
        padding: 4px 0;
        display: flex;
        align-items: center;
        margin-left: 16px;

        &.delete {
            color: #FB5151;
        }
    }
}
</style>
