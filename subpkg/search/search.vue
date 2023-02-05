<template>
  <view class="search-box">
    <!-- 使用 uni-ui 提供的搜索组件 -->
    <uni-search-bar @input="input" :radius="100" cancelButton="none"></uni-search-bar>
    <!-- 联想词 -->
    <view class="sugg-list" v-for="(item, i) in searchResults" :key="i">
      <view class="sugg-item" @click="gotoDetail(item.goods_id)">
        <view class="goods-name">{{ item.goods_name }}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>
    <view class="history-box" v-if="searchResults.length == 0">
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="delTag"></uni-icons>
      </view>
      <view class="history-list"><uni-tag :text="item" v-for="(item, i) in historys" :key="i"></uni-tag></view>
    </view>
  </view>
</template>

<script>
export default {
  // 去重 ， 反转
  data() {
    return {
      // 去重 往前添加 持久化 删除
      // 延时器的 timerId
      timer: null,
      // 搜索关键词
      kw: '',
      // 搜索结果列表
      searchResults: [],
      // 历史记录
      historyList: []
    }
  },
  computed: {
    // 记录反转 记录去重
    historys() {
      return Array.from(new Set([...this.historyList.reverse()]))
    }
  },
  methods: {
    // 联想词获取
    input(i) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.kw = i
        console.log(i, '获取关键词')
        this.getSearchList()
        this.saveSearchHistory()
      }, 500)
    },
    // 设置联想词
    async getSearchList() {
      if (this.kw == '') return (this.searchResults = [])
      const res = await uni.$gets('/goods/qsearch?query=' + this.kw)
      this.searchResults = res.message
    },
    // 点击跳转
    gotoDetail(res) {
      uni.navigateTo({
        url: '/subpkg/goods_detail/goods_detail?goods_id=' + res
      })
    },
    // 保存关键词
    saveSearchHistory() {
      this.historyList.push(this.kw)
      uni.setStorageSync('kw', JSON.stringify(this.historyList))
    },
    // 删除 所有历史记录 tag
    delTag() {
      this.historyList = []
    }
  },
  onLoad() {}
}
</script>

<style lang="scss">
.search-box {
  position: sticky;
  top: 0;
  z-index: 999;
}
.sugg-list {
  padding: 0 5px;

  .sugg-item {
    font-size: 12px;
    padding: 13px 0;
    border-bottom: 1px solid #efefef;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .goods-name {
      // 文字不允许换行（单行文本）
      white-space: nowrap;
      // 溢出部分隐藏
      overflow: hidden;
      // 文本溢出后，使用 ... 代替
      text-overflow: ellipsis;
      margin-right: 3px;
    }
  }
}
.history-box {
  padding: 0 5px;

  .history-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    font-size: 13px;
    border-bottom: 1px solid #efefef;
  }

  .history-list {
    display: flex;
    flex-wrap: wrap;

    .uni-tag {
      margin-top: 5px;
      margin-right: 5px;
    }
  }
}
</style>
