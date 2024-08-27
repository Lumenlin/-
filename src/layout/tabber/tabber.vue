<template>
    <div class="tabber">
        <div class="tabber-left">
            <Breadcrumb></Breadcrumb>
        </div>
        <div class="tabber-right">
            <Setting></Setting>
        </div>
    </div>
</template>

<script setup lang="ts">
    // 引入左侧与右侧的内容
    import Breadcrumb from './breadcrumb/breadcrumb.vue'
    import Setting from './setting/setting.vue'
</script>
<script lang="ts">
    export default {
        name: 'Tabber',
    }
</script>

<style scoped lang="scss">
    .tabber {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        .tabber-left {
            display: flex;
            align-items: center;
            margin-left: 20px;
        }
        .tabber-right {
            display: flex;
            align-items: center;
        }
    }
</style>
