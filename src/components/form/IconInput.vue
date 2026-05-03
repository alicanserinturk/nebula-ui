<template>
  <div class="app-form-icon-input">
    <el-popover
        placement="bottom"
        width="400"
        popper-class="el-popover-icon"
        trigger="click"
        v-model="visible">
      <div>
        <div style="height: 300px !important; overflow: auto">
          <ul class="icon-list">
            <template v-for="item in icons">
              <li :class="{'icon-list-active': item.icon === selectedIcon}" v-if="item.name.search('-outline')"
                  @click="selectIcon(item)">
                <span><ion-icon style="font-size:22px" :name="item.name"></ion-icon><span class="icon-name">{{ item.name }}</span></span>
              </li>
            </template>

          </ul>
        </div>
        <div class="py-3 px-3 b-t text-right">
          <button class="btn btn-primary btn-rounded" @click="send">Seç</button>
        </div>
      </div>
      <el-input v-if="value === ''" readonly slot="reference"></el-input>
      <el-input v-else readonly slot="reference" :value="selectedIcon">
        <div class="d-inline-block" style="padding:13px 10px 13px 8px;" slot="prefix"><ion-icon :name="selectedIcon"></ion-icon></div>
      </el-input>
    </el-popover>
  </div>
</template>
<script>
import Axios from "axios";
import Ionicons from "../../assets/data/ionicons.json";

export default {
  props: {
    value: {
      required: false,
      default: '',
    }
  },
  computed: {},
  created() {
  },
  methods: {
    selectIcon(item) {
      this.selectedIcon = item.name;
      this.selectedName = item.name;
    },
    send() {
      this.$emit('input', this.selectedIcon)
      this.visible = false;
    },
  },
  data() {
    return {
      visible: false,
      selectedIcon: this.value,
      selectedName: '',
      icons: Ionicons.icons
    }
  }
}
</script>
<style>
ul.icon-list {
  float: left;
  list-style: none;
  margin: 0;
  padding: 10px;
}

ul.icon-list li:nth-child(4n + 0) {
  border-right: 0;
}


ul.icon-list li {
  width: 25%;
  float: left;
  height: 90px;
  text-align: center;
  padding: 20px 15px 0 15px;
  /*border-bottom: 1px solid #F2F2F2;
  border-right: 1px solid #F2F2F2;*/
  cursor: pointer;
  border-radius: 10px;
}

ul.icon-list li .icon-name {
  text-transform: capitalize;
  font-size: 12px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  display: block;
  color: #777;
}

ul.icon-list li i {
  display: block;
  font-size: 18px;
  margin-bottom: 10px;
  color: #555;
}

ul.icon-list li:hover {

}

ul.icon-list li.icon-list-active:hover {
  background: #448BFF;
}

.ul.icon-list li:hover .icon-name {
  color: #448BFF !important;
}

.el-popover-icon {
  padding: 0 !important;
}

.icon-list-active i {
  color: #FFF !important;
}

.icon-list-active .icon-name {
  color: #FFF !important;
}

.icon-list-active {
  background: #448BFF;
}
</style>