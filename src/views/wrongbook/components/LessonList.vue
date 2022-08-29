<template>
    <div class="lessonlist">
        <h3>求倍数的实际应用</h3>
        <div class="wrongbook-list">
            <div class="list-item">
                <div class="item-index">1</div>
                <div class="item-title">
                    <el-tag>Tag 1</el-tag>
                    <div class="content">
                        <p class="title">先数一数，再照样子涂一涂</p>
                        <span class="desc">知识点：倍的认识</span>
                    </div>
                </div>
                <div class="item-middle">
                    <div class="frequency">
                        <p>出现频次</p>
                        <span> 1次 </span>
                    </div>
                    <div class="ratedata">
                        <el-progress type="circle" :percentage="25" />
                        <div class="content">
                            <p class="title">最近完成</p>
                            <span>90%</span>
                        </div>
                    </div>
                    <div class="ratedata">
                        <el-progress type="circle" :percentage="25" />
                        <div class="content">
                            <p class="title">最近完成</p>
                            <span>90%</span>
                        </div>
                    </div>
                </div>
                <div class="item-operate">
                    <div class="operate-btn">
                        <img src="" alt="" />
                        <span>讲解题目</span>
                    </div>
                    <div class="operate-btn">
                        <img src="" alt="" />
                        <span>查看同类题</span>
                    </div>
                    <div class="operate-btn">
                        <img src="" alt="" />
                        <span>题目详情</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup></script>
<style lang="scss" scoped>
.lessonlist {
    background-color: #fff;
    padding: 16px;
}
</style>
