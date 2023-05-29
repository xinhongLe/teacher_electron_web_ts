<template>
    <div>
        <div class="tab-class">
            <div
                @click="handleTab(item.value)"
                :class="[activeIndex === item.value ? 'active' : '' ]"
                v-for="item in tabList"
                :key="item.value">
                {{ item.name }}
            </div>
        </div>
        <div class="content">
            <component :is="currentComponent" :newForm="form" @save="save"></component>
        </div>

        <!--        <el-button type="primary" @click="save">保存</el-button>-->
    </div>
</template>

<script lang="ts">
import {defineComponent, markRaw, ref, reactive, toRefs, PropType, onMounted} from "vue";
import SetContent from "./components/setContent.vue";
import setLayout from "./components/setLayout.vue";
import {getTeacherPageGameConfig, UpdateImageTextConnectionOption} from "@/api/game";
import {Slide} from "wincard";
import {getOssUrl} from "@/utils/oss";
import {createRandomCode} from "@/utils/common";

export default defineComponent({
    name: "classGame",
    props: {
        slide: {
            type: Object as PropType<Slide>,
            require: true
        }
    },
    emits: ["save"],
    components: {SetContent, setLayout},
    setup(props, {emit}) {
        const id: string = createRandomCode();
        const state = reactive({
            activeIndex: 1,
            tabList: [
                {name: "内容配置", value: 1},
                {name: "调整布局", value: 2}
            ],
            form: {
                LeftItems: {
                    Type: 1,
                    Items: [
                        {
                            Id: id, //随机唯一id,
                            Data: "",
                            File: {
                                ID: "",
                                Name: "",
                                SN: 0,
                                FileName: "",
                                Bucket: "",
                                FilePath: "",
                                Extention: "",
                                FileMD5: "",
                                Type: 0,
                                StaffID: ""
                            },
                            Position: {x: 200, y: 200},
                            Size: {Width: 240, Height: 100},
                        }
                    ]
                },
                RightItems: {
                    Type: 0,
                    Items: [
                        {
                            Id: id,
                            Data: "",
                            File: {
                                ID: "",
                                Name: "",
                                SN: 0,
                                FileName: "",
                                Bucket: "",
                                FilePath: "",
                                Extention: "",
                                FileMD5: "",
                                Type: 0,
                                StaffID: ""
                            },
                            Position: {x: 600, y: 200},
                            Size: {Width: 240, Height: 100},
                        }
                    ]
                }
            }
        });

        const currentComponent = ref<any>(markRaw(SetContent));

        const handleTab = (value: number) => {
            state.activeIndex = value;
            currentComponent.value = (value === 1) ? markRaw(SetContent) : markRaw(setLayout);
        };

        const save = () => {
            const data = {
                pageID: props.slide?.id as string,
                gameID: props.slide?.game?.id as string,
                config: {
                    LeftItems: state.form.LeftItems,
                    RightItems: state.form.RightItems
                }
            };

            console.log(data, "ok----------");
            UpdateImageTextConnectionOption(data).then(res => {
                if (res.resultCode === 200) {
                    // console.log('res---', res)
                    const data = {
                        ID: props.slide?.game?.id,
                        Name: props.slide?.game?.name,
                        Url: props.slide?.game?.src.includes("?pageId")
                            ? `${props.slide?.game?.src.split("?pageId")[0]}?pageId=${props.slide?.id}&time=${new Date().getTime()}` : `${props.slide?.game?.src}?pageId=${props.slide?.id}&time=${new Date().getTime()}`
                    };
                    emit("save", data);
                }
            })

            // classSet(data).then(res => {
            //     if (res.resultCode === 200) {
            //         const data = {
            //             ID: props.slide?.game?.id,
            //             Name: props.slide?.game?.name,
            //             Url: props.slide?.game?.src.includes("?pageId")
            //                 ? `${props.slide?.game?.src.split("?pageId")[0]}?pageId=${props.slide?.id}&time=${new Date().getTime()}` : `${props.slide?.game?.src}?pageId=${props.slide?.id}&time=${new Date().getTime()}`
            //         };
            //         emit("save", data);
            //     }
            // });
        };

        onMounted(async () => {
            getTeacherPageGameConfig({PageID: props.slide!.id}).then(async res => {
                if (res.resultCode === 200 && res.result.Config) {
                    console.log('res-------------', res)
                    // state.form.AutoJudge = res.result.Config.AutoJudge ? 1 : 0;
                    // state.form.ThemeId = res.result.Config.ThemeId;
                    // state.form.Type = res.result.Config.Type;
                    // state.form.DefaultCount = res.result.Config.DefaultCount;
                    state.form.LeftItems.Type = res.result.Config.LeftItems.Type;
                    state.form.RightItems.Type = res.result.Config.RightItems.Type;

                    const LeftItems = res.result.Config.LeftItems.Items || [];
                    for (const item of LeftItems) {
                        if (item.File.FilePath && item.File.FileName) {
                            const fileInfo = await getOssUrl(`${item.File.FilePath}/${item.File.FileName}.${item.File.Extention}`, `${item.File.Bucket}`);
                            item.File.url = fileInfo;
                        }
                    }
                    state.form.LeftItems.Items = LeftItems;
                    const RightItems = res.result.Config.RightItems.Items || [];
                    for (const item of RightItems) {
                        if (item.File.FilePath && item.File.FileName) {
                            const fileInfo = await getOssUrl(`${item.File.FilePath}/${item.File.FileName}.${item.File.Extention}`, `${item.File.Bucket}`);
                            item.File.url = fileInfo;
                        }
                    }
                    state.form.RightItems.Items = RightItems;

                }
            });
        });
        return {
            ...toRefs(state),
            currentComponent,
            handleTab,
            save
        };
    }
});

</script>

<style scoped lang="scss">
.tab-class {
    display: flex;
    margin-bottom: 20px;
    border-bottom: 1px solid var(--el-border-color);

    > div {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 120px;
        height: 30px;
        background: #F6F7F8;
        cursor: pointer;
        border: 1px solid var(--el-border-color);
        border-bottom: none;

        &:first-child {
            border-top-left-radius: 6px;
        }

        &:last-child {
            border-top-right-radius: 6px;
        }
    }

    .active {
        background: #2E95FF;
        color: #fff;
    }
}

.content {
    width: 100%;
    height: 700px;
}

</style>
