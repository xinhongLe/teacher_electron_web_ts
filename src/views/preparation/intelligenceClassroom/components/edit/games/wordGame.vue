<template>
    <div>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="50px" label-position="left">
           <div>
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="记忆时间：" prop="MemoryTime" label-width="100px">
                            <el-input v-model.number="form.MemoryTime" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="1" style="padding-left: 0">
                        <div style="padding-top: 10px">秒</div>
                    </el-col>
                   <el-col :span="6">
                       <el-form-item label="回合数：" prop="Round" label-width="80px">
                           <el-input v-model.number="form.Round" />
                       </el-form-item>
                   </el-col>
                </el-row>
                <div class="add-box"  @click = addQuestion>
                    <img src="@/assets/projection/icon_add_btn.png" alt="">
                    <span>新增题目</span>
                </div>
            </div>
           <div class="content-box">
               <div v-for="(item, index) in form.Question" :key="index" class="content">
                 <div class="first-row">
                     <div>{{index + 1}}</div>
                     <div v-if="index !==0" class="text" @click="delQuestion(index)">移除</div>
                 </div>
                 <el-form-item label="题目" :prop="`Question[${index}].Subject`" :rules="rules.option">
                     <el-input v-model="item.Subject" />
                 </el-form-item>
                 <el-form-item label="单词" :prop="`Question[${index}].Word`" :rules="rules.option">
                     <el-input v-model="item.Word" />
                 </el-form-item>
                 <el-form-item label="图片" :prop="`Question[${index}].File.url`" :rules="rules.File">
                     <el-upload
                         class="avatar-uploader"
                         action=""
                         accept=".jpg,.jpeg,.gif,.png"
                         :http-request="(file) => uploadHttp(file, index)"
                         :show-file-list="false"
                     >
                         <img v-if="item.File.url" :src="item.File.url" class="avatar" />
                         <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                         <template #tip>
                             <div class="el-upload__tip">
                                 支持jpg.jpeg.gif.png
                             </div>
                         </template>
                     </el-upload>
                 </el-form-item>
               </div>
           </div>
        </el-form>
        <div style="text-align: center">
            <el-button type="primary" @click="handleComfirm">保存</el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, reactive, ref, toRefs } from "vue";
import { cooOss, getOssUrl } from "@/utils/oss";
import { getTeacherPageGameConfig, wordSet } from "@/api/game.ts";
import { ElMessage } from "element-plus";
import { Slide } from "wincard";
import { get, STORAGE_TYPES } from "@/utils/storage";
export default defineComponent({
    name: "wordGame",
    props: {
        slide: {
            type: Object as PropType<Slide>,
            require: true
        }
    },
    emits: ["save"],
    setup(props, { emit }) {
        const state = reactive({
            rules: {
                MemoryTime: [{ required: true, message: "请输入时间", trigger: "blur" }],
                Round: [{ required: true, message: "请输入回合", trigger: "blur" }],
                option: [{ required: true, message: "请输入", trigger: "blur" }],
                File: [{ required: true, message: "请上传图片", trigger: ["change", "blur"] }]
            },
            form: {
                MemoryTime: "",
                Round: "",
                Question: [
                    { Subject: "", Word: "", File: { url: "", Bucket: "", Name: "", FileName: "", FilePath: "", Extention: "", Type: 2 } }
                ]
            }
        });

        const addQuestion = () => {
            state.form.Question.push(
                { Subject: "", Word: "", File: { url: "", Bucket: "", Name: "", FileName: "", FilePath: "", Extention: "", Type: 2 } }
            );
        };
        const delQuestion = (index:number) => {
            state.form.Question.splice(index, 1);
        };

        const upload = async (file:any, index:number) => {
            const filePath = await cooOss(file, get(STORAGE_TYPES.OSS_PATHS)?.["ElementFile"]);
            console.log(filePath, "filePath");
            const fileInfo = await getOssUrl(filePath?.objectKey as string, get(STORAGE_TYPES.OSS_PATHS)?.["ElementFile"].Bucket);
            state.form.Question[index].File = {
                url: fileInfo,
                Bucket: "axsfile",
                FilePath: filePath?.fileExtension || "",
                FileName: filePath?.name || "",
                Name: filePath?.name || "",
                Extention: filePath?.fileExtension || "",
                Type: 2
            };
        };
        const uploadHttp = async (value: any, index:number) => {
            upload(value.file, index);
        };

        const formRef = ref();
        const handleComfirm = () => {
            formRef.value.validate((valid:boolean) => {
                if (valid) {
                    const list = state.form.Question.map((item: any, index: number) => {
                        item.sort = index + 1;
                        return item;
                    });
                    const data = {
                        pageID: props.slide?.id as string,
                        gameID: props.slide?.game?.id as string,
                        config: {
                            question: list,
                            MemoryTime: state.form.MemoryTime,
                            Round: state.form.Round
                        }
                    };
                    _wordSet(data);
                }
            });
        };

        const _wordSet = (data:any) => {
            wordSet(data).then((res:any) => {
                if (res.resultCode === 200) {
                    // ElMessage({ type: "success", message: "配置成功" });
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
            getTeacherPageGameConfig({ PageID: props.slide!.id }).then(async res => {
                if (res.resultCode === 200 && res.result.Config) {
                    const files = res.result.Config.Question || [];
                    for (let i = 0; i < files.length; i++) {
                        const fileInfo = await getOssUrl(`${files[i].File.FilePath}/${files[i].File.FileName}.${files[i].File.Extention}`, `${files[i].File.Bucket}`);
                        files[i].File.url = fileInfo;
                    }
                    state.form = {
                        MemoryTime: res.result.Config.MemoryTime,
                        Round: res.result.Config.Round,
                        Question: files
                    };
                }
            });
        });

        return {
            formRef,
            ...toRefs(state),
            addQuestion,
            delQuestion,
            uploadHttp,
            handleComfirm
        };
    }
});

</script>

<style scoped lang="scss">
.content-box{
    height: 680px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    overflow-y: auto;
}
.content{
    box-sizing: border-box;
    width: 390px;
    height: 320px;
    border: 1px solid #dcdfe6;
    padding: 24px;
    margin-bottom: 20px;
    margin-right: 20px;
    .first-row{
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        .text{
            color: #409eff;
            cursor: pointer;
        }
    }
}
.add-box{
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 20px;
    img{
        width: 25px;
        height: 25px;
        padding-bottom: 4px;
    }
    span{
        margin-left: 4px;
    }
}

.avatar-uploader{
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
        border: 1px solid #dcdfe6;
        font-size: 28px;
        color: #8c939d;
        width: 96px;
        height: 96px;
        line-height: 96px;
        text-align: center;
    }
}
</style>
