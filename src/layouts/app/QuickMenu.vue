<template>
  <div class="quick-menu b-l bg-white">
    <ul>
      <li v-for="item in 10">
        <img :src="'/assets/img/vectors/avatars/avatar'+item+'.svg'" alt="">
      </li>
    </ul>
  </div>
</template>
<style lang="scss">
.quick-menu{
  position: fixed;
  top:0;
  right: 0;
  bottom:0;
  width: 60px;
  z-index: 9999;
  ul{
    padding:0;
    margin:0;
    list-style: none;
    li{
      padding:10px;
    }
  }
}
</style>