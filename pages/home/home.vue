<template>
  <!-- 轮播图 -->
  <view>
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <!-- 循环渲染轮播图的 item 项 -->
      <swiper-item v-for="(item, i) in swiperList" :key="i">
        <navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
          <!-- 动态绑定图片的 src 属性 -->
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>

    <!-- 导航 -->
    <view class="nav-list">
      <view class="nav-item" v-for="(item, i) in navList" :key="i" @click="navClickHandler(item)">
        <image class="nav-img" :src="item.image_src"></image>
      </view>
    </view>

    <!-- 楼层区域 -->
    <view class="floor-list">
      <!-- 楼层 item 项 -->
      <view class="floor-item" v-for="(item, i) in floorList" :key="i">
        <!-- 楼层标题 -->
        <image :src="item.floor_title.image_src" class="floor-title"></image>

        <!-- 楼层图片区域 -->
        <view class="floor-img-box">
          <!-- 左侧大图片的盒子 -->
          <navigator class="left-img-box" :url="item.product_list[0].url">
            <image
              :src="item.product_list[0].image_src"
              :style="{ width: item.product_list[0].image_width + 'rpx' }"
              mode="widthFix"
            ></image>
          </navigator>
          <!-- 右侧 4 个小图片的盒子 -->
          <view class="right-img-box">
            <navigator
              class="right-img-item"
              v-for="(item2, i2) in item.product_list"
              :key="i2"
              v-if="i2 !== 0"
              :url="item2.url"
            >
              <image :src="item2.image_src" mode="widthFix" :style="{ width: item2.image_width + 'rpx' }"></image>
            </navigator>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
// import logShim from 'npm/lib/utils/log-shim'
export default {
  data() {
    return {
      // '/api/public/v1/home/floordata'
      // 轮播图
      swiperList: [],
      // 分类
      navList: [],
      // 楼层的数据列表
      floorList: []
    }
  },
  onLoad() {
    // 获取轮播图
    this.getSwiperList()
    // 获取分类
    this.getNavList()
    // 楼层图片
    this.getFloorList()
  },
  methods: {
    // 获取轮播图
    async getSwiperList() {
      const res = await uni.$gets('/home/swiperdata')
      this.swiperList = res.message
    },
    // 获取分类
    async getNavList() {
      const res = await uni.$gets('/home/catitems')
      this.navList = res.message
    },
    // 点击分类图片
    navClickHandler(item) {
      if (item.name === '分类') {
        uni.switchTab({
          url: '/pages/cate/cate'
        })
      }
    },
    // 楼层图片
    async getFloorList() {
      // product_list navigator_url
      const res = await uni.$gets('/home/floordata')
      console.log(res, 'loucengtupian')
      // 循环出 url
      res.message.forEach(floor => {
        floor.product_list.forEach(prod => {
          prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
          console.log(prod.url)
        })
      })
      this.floorList = res.message
    }
  }
}
</script>

<style lang="scss">
swiper {
  height: 330rpx;

  .swiper-item,
  image {
    width: 100%;
    height: 100%;
  }
}

.nav-list {
  display: flex;
  justify-content: space-around;
  margin: 15rpx 0;

  .nav-img {
    width: 128rpx;
    height: 140rpx;
  }
}
.floor-title {
  height: 60rpx;
  width: 100%;
  display: flex;
}
.right-img-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.floor-img-box {
  display: flex;
  padding-left: 10rpx;
}
</style>
