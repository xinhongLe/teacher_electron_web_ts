<template>
    <div>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" label-position="right">
            <div class="header">
                <div>
                    <el-form-item label="每题答题时间：" prop="TimeMode" label-width="122px" style="margin-bottom: 0">
                        <el-radio-group v-model="form.TimeMode" class="ml-4">
                            <el-radio :label="0" size="large">固定</el-radio>
                            <el-radio :label="1" size="large">不固定</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="form.TimeMode === 0" label="时间(秒)：" prop="Time"
                                  label-width="122px">
                        <el-input v-model.number="form.Time"/>
                    </el-form-item>
                </div>
                <el-form-item label="两边题目模式：" label-width="120px">
                    <el-radio-group v-model="form.Mode">
                        <el-radio class="m_r_14" :label="0">同题</el-radio>
                        <el-radio :label="1">不同题</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="出题顺序：">
                    <el-radio-group v-model="form.Order">
                        <el-radio class="m_r_14" :label="0">固定</el-radio>
                        <el-radio :label="1">随机</el-radio>
                    </el-radio-group>
                </el-form-item>
            </div>
            <div class="add-box">
                <img @click=addQuestion src="@/assets/projection/icon_add_btn.png" alt="">
                <span>新增分类</span>
                <span>( <span class="num">{{ form.Data.length }}</span>/10 )</span>
            </div>
            <div class="content-box">
                <div v-for="(item, index) in form.Data" :key="index" class="content">
                    <div class="first-row">
                        <div v-if="item.IsMore" style="font-weight: 600;color: #46a1ff;">多选</div>
                        <div>题目{{ index + 1 }}</div>
                        <div v-if="index !== 0" class="text" @click="delQuestion(index)">移除</div>
                    </div>
                    <el-form-item label="类型：">
                        <el-radio-group v-model="item.QuestionType">
                            <el-radio :label="0">判断</el-radio>
                            <el-radio :label="1">选择</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="form.TimeMode === 1" label="答题时间(秒)：" :prop="`Data[${index}].Time`"
                                  :rules="rules.Time"
                                  label-width="122px">
                        <el-input v-model.number="item.Time"/>
                    </el-form-item>
                    <div v-if="item.QuestionType == 0">
                        <el-form-item label="素材：">
                            <el-radio-group v-model="item.PanduanData.Type">
                                <el-radio :label="1">文本</el-radio>
                                <el-radio :label="0">图片</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item v-if="item.PanduanData.Type === 1" label="题目："
                                      :prop="`Data[${index}].PanduanData.Question`"
                                      :rules="rules.Question">
                            <el-input v-model="item.PanduanData.Question" :autosize="{ minRows: 4, maxRows: 4 }"
                                      maxlength="45" show-word-limit type="textarea"/>
                        </el-form-item>
                        <el-form-item v-else label="题目：" :prop="`Data[${index}].PanduanData.File.url`"
                                      :rules="rules.File">
                            <el-upload
                                class="avatar-uploader"
                                action=""
                                accept=".jpg,.jpeg,.gif,.png"
                                :auto-upload="false"
                                :on-change="(file) => onChange(file, index,0)"
                                :show-file-list="false"
                            >
                                <img v-if="item.PanduanData.File.url" :src="item.PanduanData.File.url" class="avatar"/>
                                <el-icon v-else class="avatar-uploader-icon">
                                    <Plus/>
                                </el-icon>
                                <template #tip>
                                    <div class="el-upload__tip">
                                        <span>支持jpg.jpeg.gif.png</span>
                                    </div>
                                </template>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="答案：" :prop="`Data[${index}].PanduanData.Select`" :rules="rules.Select">
                            <el-radio-group v-model="item.PanduanData.Select">
                                <el-radio :label="0">正确</el-radio>
                                <el-radio :label="1">错误</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </div>
                    <div v-else>
                        <el-form-item label="素材：">
                            <el-radio-group v-model="item.DuoxuanData.Type">
                                <el-radio :label="1">文本</el-radio>
                                <el-radio :label="0">图片</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item v-if="item.DuoxuanData.Type === 1" label="题目："
                                      :prop="`Data[${index}].DuoxuanData.Subject`"
                                      :rules="rules.Question">
                            <el-input v-model="item.DuoxuanData.Subject" maxlength="45" show-word-limit/>
                        </el-form-item>
                        <el-form-item v-else label="题目：" :prop="`Data[${index}].DuoxuanData.File.url`"
                                      :rules="rules.File">
                            <el-upload
                                class="avatar-uploader"
                                action=""
                                accept=".jpg,.jpeg,.gif,.png"
                                :auto-upload="false"
                                :on-change="(file) => onChange(file, index,1)"
                                :show-file-list="false"
                            >
                                <img v-if="item.DuoxuanData.File.url" :src="item.DuoxuanData.File.url" class="avatar"/>
                                <el-icon v-else class="avatar-uploader-icon">
                                    <Plus/>
                                </el-icon>
                                <template #tip>
                                    <div class="el-upload__tip">
                                        <span>支持jpg.jpeg.gif.png</span>
                                    </div>
                                </template>
                            </el-upload>
                        </el-form-item>
                        <span style="color: #409eff;cursor: pointer;"
                              @click="addOprion(item.DuoxuanData?.Options)">
                            添加选项
                        </span>
                        <el-form-item :label="'选项'+ (index2 + 1)" v-for="(data,index2) in item.DuoxuanData?.Options"
                                      :prop="item.DuoxuanData.Type ? `Data[${index}].DuoxuanData.Options[${index2}].Text` : `Data[${index}].DuoxuanData.Options[${index2}].RightKey`"
                                      :rules="rules.Text" style="align-items: center">
                            <div style="display: flex;align-items: center;">
                                <el-input v-if="item.DuoxuanData.Type" v-model="data.Text" maxlength="15"
                                          show-word-limit/>
                                <el-checkbox style="padding: 0 10px" v-model="data.RightKey" :true-label="1"
                                             :false-label="0" label="正确答案"
                                             size="large"/>
                                <img
                                    v-if="index2 > 1"
                                    class="del_img"
                                    @click="delOption(item.DuoxuanData?.Options,index2)"
                                    src="@/assets/projection/icon_delete.png"
                                    alt=""
                                />
                            </div>

                        </el-form-item>
                    </div>

                </div>
            </div>
        </el-form>
        <div style="text-align: center">
            <el-button type="primary" @click="handleComfirm">保存</el-button>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, PropType, reactive, ref, toRefs} from "vue";
import {cooOss, getOssUrl} from "@/utils/oss";
import {carSet, getTeacherPageGameConfig} from "@/api/game";
import {ElMessage} from "element-plus";
import {Slide} from "wincard";
import {get, STORAGE_TYPES} from "@/utils/storage";

export default defineComponent({
    name: "carGame",
    props: {
        slide: {
            type: Object as PropType<Slide>,
            require: true
        }
    },
    emits: ["save"],
    setup(props, {emit}) {
        const state = reactive({
            rules: {
                Time: [{required: true, message: "请输入时间", trigger: "blur"}],
                Question: [
                    {required: true, message: "请输入题目", trigger: "blur"},
                    {max: 60, message: "最多60字符", trigger: "blur"}
                ],
                Select: [{required: true, message: "请选择答案", trigger: "blur"}],
                File: [{required: true, message: "请上传图片", trigger: ["change", "blur"]}],
                Text: [{required: true, message: "请输入选项", trigger: "blur"}],
            },
            form: {
                Time: "",
                Mode: 0,
                Order: 0,
                TimeMode: 0,//答题时间 0 固定 1 不固定
                Data: [
                    {
                        IsMore: false,//是否是多选
                        QuestionType: 0,//题目类型 0 判断 1 多选
                        Time: "",//计时
                        PanduanData: //判断
                            {
                                Question: "",
                                Select: 0,//判断题选项（0正确1错误）
                                Type: 1,//题目类型 0 图片 1 文字
                                File: {
                                    url: "",
                                    Bucket: "",
                                    Name: "",
                                    FileName: "",
                                    FilePath: "",
                                    Extention: "",
                                    Type: 2
                                }
                            },
                        DuoxuanData: //多选
                            {
                                Sort: "",
                                Subject: "",//标题
                                Answer: "",//答案
                                OptionsCount: 0,//选项个数
                                Type: 1,//题目类型 0 图片 1 文字
                                File: {
                                    url: "",
                                    Bucket: "",
                                    Name: "",
                                    FileName: "",
                                    FilePath: "",
                                    Extention: "",
                                    Type: 2
                                },
                                Options: [
                                    {
                                        Sort: 1,
                                        Text: "",//选项文本
                                        RightKey: 0,//0 错误答案 1 正确答案
                                    }
                                ]
                            }
                    },
                    {
                        IsMore: false,//是否是多选
                        QuestionType: 0,//题目类型 0 判断 1 多选
                        Time: "",//计时
                        PanduanData: //判断
                            {
                                Question: "",
                                Select: 0,//判断题选项（0正确1错误）
                                Type: 1,//题目类型 0 图片 1 文字
                                File: {
                                    url: "",
                                    Bucket: "",
                                    Name: "",
                                    FileName: "",
                                    FilePath: "",
                                    Extention: "",
                                    Type: 2
                                }
                            }
                        ,
                        DuoxuanData: //多选
                            {
                                Sort: "",
                                Subject: "",//标题
                                Answer: "",//答案
                                OptionsCount: 0,//选项个数
                                Type: 1,//题目类型 0 图片 1 文字
                                File: {
                                    url: "",
                                    Bucket: "",
                                    Name: "",
                                    FileName: "",
                                    FilePath: "",
                                    Extention: "",
                                    Type: 2
                                },
                                Options: [
                                    {
                                        Sort: 1,
                                        Text: "",//选项文本
                                        RightKey: 0,//0 错误答案 1 正确答案
                                    },
                                    {
                                        Sort: 2,
                                        Text: "",//选项文本
                                        RightKey: 0,//0 错误答案 1 正确答案
                                    }
                                ]
                            }
                    },

                ]
            }
        });

        const addQuestion = () => {
            if (state.form.Data.length === 10) {
                return ElMessage.warning("最多只能新增10道题目");
            }
            state.form.Data.push(
                {
                    IsMore: false,//是否是多选
                    QuestionType: 0,//题目类型 0 判断 1 多选
                    Time: "",//计时
                    PanduanData: //判断
                        {
                            Question: "",
                            Select: 0,//判断题选项（0正确1错误）
                            Type: 1,//题目类型 0 图片 1 文字
                            File: {
                                url: "",
                                Bucket: "",
                                Name: "",
                                FileName: "",
                                FilePath: "",
                                Extention: "",
                                Type: 2
                            }
                        }
                    ,
                    DuoxuanData: //多选
                        {
                            Sort: "",
                            Subject: "",//标题
                            Answer: "",//答案
                            OptionsCount: 0,//选项个数
                            Type: 1,//题目类型 0 图片 1 文字
                            File: {
                                url: "",
                                Bucket: "",
                                Name: "",
                                FileName: "",
                                FilePath: "",
                                Extention: "",
                                Type: 2
                            },
                            Options: [
                                {
                                    Sort: 1,
                                    Text: "",//选项文本
                                    RightKey: 0,//0 错误答案 1 正确答案
                                }
                            ]
                        }
                }
            );
        };
        const delQuestion = (index: number) => {
            state.form.Data.splice(index, 1);
        };

        const upload = async (file: any, index: number, type: number) => {
            const filePath = await cooOss(file, get(STORAGE_TYPES.OSS_PATHS)?.["ElementFile"]);
            const fileInfo = await getOssUrl(filePath?.objectKey as string, get(STORAGE_TYPES.OSS_PATHS)?.["ElementFile"].Bucket);
            if (!type) {
                state.form.Data[index].PanduanData.File = {
                    url: fileInfo,
                    Bucket: "axsfile",
                    FilePath: filePath?.objectKey.split("/")[0] || "ElementFile",
                    FileName: filePath?.name || "",
                    Name: filePath?.name || "",
                    Extention: filePath?.fileExtension || "",
                    Type: 2
                };
            } else {
                state.form.Data[index].DuoxuanData.File = {
                    url: fileInfo,
                    Bucket: "axsfile",
                    FilePath: filePath?.objectKey.split("/")[0] || "ElementFile",
                    FileName: filePath?.name || "",
                    Name: filePath?.name || "",
                    Extention: filePath?.fileExtension || "",
                    Type: 2
                };
            }

        };

        const onChange = (file: any, index: number, type: number) => {
            if (file) {
                var reader = new FileReader();
                reader.onload = function (event: any) {
                    var base64 = event.target.result;
                    var img = document.createElement("img");
                    img.src = base64;
                    img.onload = function () { // 注意只有onload以后才可以拿到图片信息
                        const imgWidth = img.width;
                        const imgHeight = img.height;
                        if (imgWidth > 420 || imgHeight > 520 || (file.raw.size / 1024) > 1024) {
                            return ElMessage.warning("图片像素不超过420 * 520，且文件大小不超过1M");
                        }
                        upload(file.raw, index, type);
                    };
                };
                reader.readAsDataURL(file.raw);
            }
        };
        //删除选择题的选项
        const delOption = (data: any, index: number) => {
            data.splice(index, 1)
            data.length && data.forEach((item: any, index: number) => {
                item.Sort = index + 1
            })
        };
        //添加选择题选项
        const addOprion = (data: any) => {
            if (data.length >= 4) return;
            data.push({
                Sort: 1,
                Text: "",//选项文本
                RightKey: 0,//0 错误答案 1 正确答案
            });
            data.length && data.forEach((item: any, index: number) => {
                item.Sort = index + 1
            })
        };

        const formRef = ref();
        const handleComfirm = () => {
            formRef.value.validate((valid: boolean) => {
                if (valid) {
                    let flag;
                    state.form.Data.forEach((item, index) => {
                        if (item.QuestionType == 1) {
                            const datas: any = item.DuoxuanData.Options.map(option => option.RightKey)
                            console.log('datasdatas', datas)

                            flag = datas.every((val: number) => {
                                return val == 0
                            })
                            console.log('flag', flag)
                        }
                    })
                    if (flag) {
                        ElMessage.warning("选项中至少要有一个正确答案");
                        return false;
                    }
                    const list = state.form.Data.map((item: any, index: number) => {
                        item.sort = index + 1;
                        return item;
                    });

                    const data = {
                        pageID: props.slide?.id as string,
                        gameID: props.slide?.game?.id as string,
                        config: {
                            info: {
                                Time: state.form.Time,
                                Mode: state.form.Mode,
                                Order: state.form.Order,
                                TimeMode: state.form.TimeMode
                            },
                            data: list
                        }
                    };
                    _carSet(data);
                }
            });
        };

        const _carSet = (data: any) => {
            carSet(data).then(res => {
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

        onMounted(() => {
            getTeacherPageGameConfig({PageID: props.slide!.id}).then(async res => {
                if (res.resultCode === 200 && res.result.Config) {
                    const files = res.result.Config.Data || [];
                    for (let i = 0; i < files.length; i++) {
                        const fileInfo = await getOssUrl(`${files[i].PanduanData.File.FilePath}/${files[i].PanduanData.File.FileName}.${files[i].PanduanData.File.Extention}`, `${files[i].PanduanData.File.Bucket}`);
                        files[i].PanduanData.File.url = fileInfo;
                    }
                    state.form = {
                        Time: res.result.Config.Info.Time,
                        TimeMode: res.result.Config.Info.TimeMode,
                        Mode: res.result.Config.Info.Mode,
                        Order: res.result.Config.Info.Order,
                        Data: files
                    };
                }
            });
        });

        return {
            formRef,
            ...toRefs(state),
            addQuestion,
            delQuestion,
            onChange,
            handleComfirm,
            delOption,
            addOprion
        };
    }
});

</script>

<style scoped lang="scss">
.m_r_14 {
    margin-right: 14px;
}

.header {
    display: flex;
    //align-items: center;
    align-items: flex-start;
    justify-content: flex-start;

    > div {
        margin-right: 20px;
    }
}

.add-box {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 20px;

    img {
        cursor: pointer;
        width: 25px;
        height: 25px;
        padding-bottom: 4px;
    }

    span {
        margin-left: 4px;
    }

    .num {
        color: var(--el-color-primary);
    }
}

.content-box {
    //height: 600px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    overflow-y: auto;

    .del_img {
        width: 18px;
        height: 18px;
        //position: absolute;
        //right: -6px;
        //top: -10px;
        //z-index: 2;
        cursor: pointer;
    }

}

.content {
    box-sizing: border-box;
    width: 390px;
    //height: 300px;
    border: 1px solid var(--el-border-color);
    padding: 24px;
    margin-bottom: 20px;
    margin-right: 20px;

    .first-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;

        .text {
            color: var(--el-color-primary);
            cursor: pointer;
        }
    }
}

.avatar-uploader {
    line-height: 20px !important;

    .avatar {
        display: block;
        border-radius: 6px;
        width: 96px;
        height: 96px;
    }

    .el-upload {
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: var(--el-transition-duration-fast);
    }

    .el-icon.avatar-uploader-icon {
        border: 1px solid var(--el-border-color);
        font-size: 28px;
        color: #8c939d;
        width: 96px;
        height: 96px;
        line-height: 96px;
        text-align: center;
    }
}
</style>
