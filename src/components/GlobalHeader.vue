<template>
<nav class="navbar-dark bg-primary justify-content-between mb-4 px-4">
  <div class="w-75 mx-auto navbar">
    <div class="header_container">
      <router-link class="navbar-brand" to="/">毛熊码砖儿</router-link>
    </div>
    <ul v-if="!user.isLogin" class="list-inline mb-0">
      <li class="list-inline-item">
        <router-link to="/login" class="btn btn-outline-light my-2">登陆</router-link>
      </li>
      <li class="list-inline-item">
        <router-link to="/signup" class="btn btn-outline-light my-2">加入毛熊</router-link>
      </li>
    </ul>
    <ul v-else class="list-inline mb-0">
      <li class="list-inline-item">
        <dropdown :title="`你好 ${user.nickName}`">
          <dropdown-item closeAfterClick>
            <router-link to="/create" class="dropdown-item">新建文章</router-link>
          </dropdown-item>
          <dropdown-item closeAfterClick>
            <router-link :to="`/column/${user.column}`" class="dropdown-item">我的专栏</router-link>
          </dropdown-item>
          <dropdown-item closeAfterClick>
            <router-link to="/edit" class="dropdown-item">编辑资料</router-link>
          </dropdown-item>
          <dropdown-item closeAfterClick><a href="#" class="dropdown-item" @click="handleLogout">退出登陆</a></dropdown-item>
        </dropdown>
      </li>
    </ul>
  </div>
</nav>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType
} from 'vue'
import {
  useRouter
} from 'vue-router'
import Dropdown from './Dropdown.vue'
import DropdownItem from './DropdownItem.vue'
import store, {
  UserProps
} from '../store/store'
import createMessage from '../components/createMessage'
export default defineComponent({
  name: 'GlobalHeader',
  components: {
    Dropdown,
    DropdownItem
  },
  props: {
    user: {
      type: Object as PropType < UserProps > ,
      required: true
    }
  },
  setup() {
    const router = useRouter()
    const handleLogout = () => {
      store.commit('logout')
      createMessage('退出登录成功，2秒后跳转到首页', 'success', 2000)
      setTimeout(() => {
        router.push('/')
      }, 2000)
    }
    return {
      handleLogout
    }
  }
})
</script>

<style scoped>
.header_container * {
  font-size: 25px;
  font-weight: 700;
}
</style>
