# teacher_electron_web_ts

## 目录结构

electron：[electron主进程代码](#electron主进程代码)

node_extend\xunfei：科大讯飞录音笔代码

src\api：一些后台接口

src\assets：静态资源，比如图片

src\childWindow：electron版子窗口

src\components：公共组件

src\config：全局配置

src\hooks：[vue的公共hooks方法](#vue的公共hooks方法)

src\router：页面router配置

src\store：[vuex全局状态管理](#vuex全局状态管理)

src\styles：样式表

src\types：一些模块的类型配置

src\utils： [公共方法](#公共方法)

src\views：[主界面代码](#主界面代码结构)

### electron主进程代码

autoUpdater：程序更新代码，使用的是electron-updater库

background.ts：程序启动主入口，创建主窗口

createWindow.ts：创建子窗口的通用方法

downloadFile.ts：文件下载逻辑，使用的是Axios下载

parsePPT：编辑窗导入ppt，解析ppt的方法

preload：一些electron和node的api封装的公共方法，通过依赖注入到各个窗口里

singalr：跟手机教师端实时通信的，主要是图片投屏

suspension：悬浮球、智课助手和一些工具窗口的创建方法，工具有黑板、答题器、投影、知识图谱、计时器、点名和教具窗口

### electron版子窗口

answerMachine：答题器

blackboard：黑板

projection：投影

rollCall：点名

suspension：悬浮球

timer：计时器

unfoldSuspension：智课助手

### 公共组件

avatar：学生头像组件

brush：使用canvas实现的画板，支持橡皮擦

calendar：课表组件

collapseTransition：折叠展开时的动画组件，目前有备课中CourseList组件和黑板中的历史记录用到了

dialog：弹框组件，目前只有清理缓存组件用到了，后续可以继续拓展

enlarge：图片、视频、音频预览组件

feedback：问题反馈

fileType：各种不同文件类型的图标

loading：全局加载loading

lookQuestion：查看书册题目组件

lookVideo：查看书册视频组件

navBar：导航栏组件

projection：手机教师端图片投屏弹框

suspension：悬浮球界面和智课助手界面

videoProjection：手机教师端直播投屏，通信用的是mqtt，直播用的是trtc-electron-sdk，腾讯实时音视频（文档地址https://cloud.tencent.com/document/product/647/38552），本地调试要使用64位的，默认下载的是64位，打包的时候要换成32位（https://cloud.tencent.com/document/product/647/62562#windows-32-.E7.B3.BB.E7.BB.9F.E8.BF.90.E8.A1.8C.E6.8A.A5.E9.94.99-.3Cdx-inline-code-holder.3E.3C.2Fdx-inline-code-holder.3E.EF.BC.8C-.E6.8F.90.E7.A4.BA.E9.9C.80.E8.A6.81-32-.E4.BD.8D.E7.9A.84-trtc_electron_sdk.node.3F）

voiceRecognition：语音奖惩界面，index开始说话、识别、识别错误界面，noMicrophone没有麦克风提示，voiceResult奖惩结果界面

windowList：数智课堂中窗的列表

### vue的公共hooks方法

useBag：翻转课堂中课包数据的处理

useCountDown：倒计时处理方法

useDrag：拖拽的处理方法

useHome：处理窗下每个页的数据

useImportPPT：导入ppt的处理逻辑

useLogin：登录相关的逻辑

useMaximizeWindow：程序最大化方法

useMinimizeWindow：程序最小化方法

useOpenWindow：点击窗的方法

useOutLogin：注销登录的方法

useSchedules：课表数据处理的方法

useSelectBookInfo：这个需要整改，逻辑比较乱

useStudentMachine：绑定答题器的方法

useSubjectPublisherBookList：获取科目书册数据的方法

useSwiper：![image-20220419171122465](.\doc\image-20220419171122465.png)左右切换的方法

useTagList：获取标签列表的方法

useTime：处理日期、星期的方法

useTransform：图片移动、放大、旋转的方法

useUploadFile：文件上传到oss的方法

useUserInfo：查询用户详情

useViewHomeworkFile：预览一些文件的方法

useWindowInfo：处理数智课堂窗的数据

### vuex全局状态管理

common：全局的一些状态

myStudent：班级管理页面的状态

preparation：备课页面的状态

userInfo：存放用户信息

### 公共方法

checkDiskSpace：检查用户c盘空间是否够，不够的话给用户提示

voiceRecognition：语音识别

common：打点的方法

crypto：加解密的方法

database：数据存入indexdb方法

dataParse：窗的数据处理

dataParsePage：处理页的数据

dealMainEvent：处理主进程发来的通知

file：缓存课件中图片、视频、音频之类文件

flexible：适配不同窗口、屏幕大小

fullscreen：进入全屏、退出全屏的方法

index：一些公共的方法

mitt：封装mitt通信的

oss：oss的封装，如文件上传、获取文件链接

request：axios请求的封装

savePageDataParse：页的保存数据处理

storage：本地存储方法的封装

web：electron版有的全局属性，而web上没有的，在这里赋个空值，这样使用的时候就不需要判断是否是electron，且代码不会报错

### 主界面代码结构

1. [assessmentCenter（测评中心）](#assessmentCenter)
2. [assignHomework（布置作业）](#布置作业)
3. [attendClass（上课）](#上课)
4. [checkHomework（查阅作业）](#查阅作业)
5. [classManage（班级管理）](#班级管理)
6. [courseTime（课后延时）](#课后延时)
7. [home（首页）](#首页)
8. [homework（作业列表）](#作业列表)
9. [labelManage（管理标签）](#管理标签)
10. [login（登录）](#登录)
11. [preparation（备课）](#备课)
12. [preparationGroup（集体备课）](#集体备课)
13. [record（学习记录）](#学习记录)
14. [reportCenter（报表中心）](#报表中心)

> #### 测评中心

使用iframe嵌套的其他网页，electron版本使用的webview

> #### 布置作业

在作业页面跳转的，路由上带了科目id和科目名称，作业分为自定义作业、在线作业、教辅作业

- 布置对象

  班级选择弹框：ClassDialog.vue，班级列表：AssignObject.vue

- 自定义作业

  作业布置弹框：CommonHomeworkDialog，作业展示：CommonHomeworkItem

- 在线作业

  作业布置弹框：systemHomeworkDialog，作业展示：CommonHomeworkItem

- 教辅作业

  作业布置弹框：TeachHomeworkDialog，作业展示：TeachHomeworkItem

  ![image-20220414153714898](.\doc\image-20220414152636751.png)

  SelectLabel.vue，每份作业可以选择学生，学生选择弹框：SelectStudent.vue

> #### 上课

用的备课中的组件，显示排的课时下，翻转课堂和数智课堂的所有内容，只能看，不能操作

> #### 查阅作业

显示学生完成作业的具体情况，自定义作业对应commonHomework，在线作业中的视频作业对应videoHomework，在线作业、教辅作业对应systemHomework

commonHomework：展示未完成学生列表（NulliparousStudents）和已完成学生列表，已完成学生会显示学生上传的图片、视频、音频文件，并可以预览（DoHomeworkStudent、Enlarge）

videoHomework：显示每位同学查看视频的进度

systemHomework：左侧显示每道题目的正确率列表（Chart.vue），右侧显示当前选中题目的完成情况，分为待批阅、答错学生、答对学生、未做学生（ReviewHomework），其中待批阅、答错学生、答对学生显示上传的题目答案（Review），其中又分为教辅作业（TeacherAnswer）和在线作业，在线作业分为听力题（SpeechAudio）、选择题（AnswerChoiceValue）和问答题（Answer），其中教辅作业（TeacherAnswerImg）、选择题（QuestionChoiceList）和问答题（Answer）可以预览

> #### 班级管理

分头部（head）和主要内容，左边为班级列表（GradeList）、右边为学生列表（StudentList）。

head有管理标签（直接跳到管理标签页面）、添加学生（打开添加学生弹框addStudent）、批量导入答题器（目前是屏蔽的，bulkImportDialog.vue）。

班级列表可以查看和编辑班级信息、创建班级（addOrEditClass），班级详情、创建班级弹框中可以添加老师（AddTeacher）

学生列表展示当前选中班级的所有学生，可以查看学生的学习记录（跳到学生记录页面）、个人信息弹框（studentDetail）

> #### 课后延时

使用iframe嵌套其他网页

> #### 首页

登录成功后跳转的页面

> #### 作业列表

根据选择的科目、日期、班级展示对应的作业列表（homeworkItem）

> #### 管理标签

展示班级管理选中班级的学生标签分类，分为未标记、level A、levelB、levelC，学科选择全部学科时，展示所有学生，全部学科的标签（AllStudentList），选择单个学科，只展示当前学科的所有标签下的学生列表（StudentList）

> #### 登录

登录方式分为密码登录和验证码登录

> #### 备课

分为头部（Head）和主要内容，左侧为课时树（CourseList），右侧为数智课堂（IntelligenceClassroom）、翻转课堂（ScheduleManagement）、课表（ClassArrangement）。

head：有科目级联选择器，当在数智课堂时，会显示当前课时下窗的列表（window-list）和显示编辑课件按钮（对当前选择的窗进行编辑的页面），点击去排课，右侧会显示课表内容

数智课堂：左侧显示卡列表（CardList），中间为课件的内容（PageList），右侧为教学建议，（Remark），底部是工具栏（Tools）。PageList中间是课件内容（ScreenView），使用的是wincard，下面是页列表（*PageItem*）。一进入到数智课堂，就会请求当前窗下所有页中的课件内容，并存到IndexedDB，获取页的内容时，先从IndexedDB中查，有的话更新到界面，之后在请求服务器内容更新到界面，如IndexedDB没有的话，直接请求服务器。

翻转课堂：分为课包内容（ClassContent）、题库（questionBank），题库中分为系统题库（BagChapter）、精品素材（Material）。

课表：可以把左侧的课时拖到课表中（有排课），对排过的课添加上课内容，点击会跳到上课页面。拖拽逻辑useDrag。

课件编辑（edit）：左侧为卡、页树，右侧为wincard插件PPTEditor组件

> #### 集体备课

> #### 学习记录

展示学生各个学科的记录，使用echarts绘制的图表

> #### 报表中心

使用iframe嵌套其他网页

### 桌面端打包

预发布包打包命令是electron:build:staging，正式包命令是electron:build，预发布包和正式包可以同时安装在同一台电脑上，要安装路径不一致，但是只能打开一个。

注意事项：打包的时候要确保腾讯音视频的sdk是32位，确认方法：64位的包会比32位的包大将近2M。



### 其他

.env.development、.env.production、.env.staging为各个环境的配置文件，主要为服务器地址配置，development为本地调试，production正式环境，staging预发布环境。

开发分支：voice为语音识别奖惩需求、preparation为备课融合需求


npm install --global --production windows-build-tools
