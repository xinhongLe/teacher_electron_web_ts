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
import {classSet, getTeacherPageGameConfig} from "@/api/game";
import {Slide} from "wincard";
import {getOssUrl} from "@/utils/oss";

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
        const state = reactive({
            activeIndex: 1,
            tabList: [
                {name: "内容配置", value: 1},
                {name: "调整布局", value: 2}
            ],
            form: {
                Type: 1,
                ThemeId: 0,
                AutoJudge: 1,
                DefaultCount: 2,
                classData: [
                    {
                        Data: "",
                        Type: 1,
                        File: {url: "", Bucket: "", Name: "", FileName: "", FilePath: "", Extention: "", Type: 2},
                        Position: {x: 200, y: 600},
                        Size: {Width: 297, Height: 377},
                        Item: [
                            {
                                Data: "",
                                Type: 1,
                                File: {
                                    url: "",
                                    Bucket: "",
                                    Name: "",
                                    FileName: "",
                                    FilePath: "",
                                    Extention: "",
                                    Type: 2
                                },
                                Position: {x: 200, y: 168},
                                Size: {Width: 240, Height: 168}
                            }
                        ]
                    }
                ]
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
                    AutoJudge: !!state.form.AutoJudge,
                    ThemeId: state.form.ThemeId,
                    Type: state.form.Type,
                    DefaultCount: state.form.DefaultCount,
                    ClassificationData: state.form.classData
                }
            };

            console.log(data, "ok----------");
            classSet(data).then(res => {
                if (res.resultCode === 200) {
                    const data = {
                        ID: props.slide?.game?.id,
                        Name: props.slide?.game?.name,
                        Url: props.slide?.game?.src.includes("?pageId")
                            ? `${props.slide?.game?.src.split("?pageId")[0]}?pageId=${props.slide?.id}&time=${new Date().getTime()}` : `${props.slide?.game?.src}?pageId=${props.slide?.id}&time=${new Date().getTime()}`
                    };
                    emit("save", data);
                }
            });
        };

        onMounted(async () => {
            getTeacherPageGameConfig({PageID: props.slide!.id}).then(async res => {
                if (res.resultCode === 200 && res.result.Config) {
                    state.form.AutoJudge = res.result.Config.AutoJudge ? 1 : 0;
                    state.form.ThemeId = res.result.Config.ThemeId;
                    state.form.Type = res.result.Config.Type;
                    state.form.DefaultCount = res.result.Config.DefaultCount;
                    const data = res.result.Config.ClassificationData || [];
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].Type === 0) {
                            const fileInfo = await getOssUrl(`${data[i].File.FilePath}/${data[i].File.FileName}.${data[i].File.Extention}`, `${data[i].File.Bucket}`);
                            data[i].File.url = fileInfo;
                        }

                        for (let j = 0; j < data[i].Item.length; j++) {
                            if (data[i].Item[j].Type === 0) {
                                const fileInfo = await getOssUrl(`${data[i].Item[j].File.FilePath}/${data[i].Item[j].File.FileName}.${data[i].Item[j].File.Extention}`, `${data[i].Item[j].File.Bucket}`);
                                data[i].Item[j].File.url = fileInfo;
                            }
                        }
                    }
                    state.form.classData = data;
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
