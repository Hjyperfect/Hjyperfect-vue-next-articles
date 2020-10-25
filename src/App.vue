<template>
<div class="container-fluid px-0 flex-shrink-0">
  <global-header :user="currentUser"></global-header>
  <loader v-if="isLoading"></loader>
  <router-view></router-view>
</div>
<footer class="text-center py-4 text-secondary bg-light mt-auto">
  <small>
    <ul class="list-inline mb-0">
      <li class="list-inline-item">© 慕课网（imooc.com）版权所有 | 津ICP备20000929号-1</li>
      <li class="list-inline-item"><a href="https://coding.imooc.com/class/449.html" target="_blank">购买课程</a></li>
      <li class="list-inline-item"><a href="http://docs.vikingship.xyz/" target="_blank">文档</a></li>
      <li class="list-inline-item"><a href="http://api.vikingship.xyz/" target="_blank">API 在线调试</a></li>
      <li class="list-inline-item"><a href="http://showcase.vikingship.xyz/" target="_blank">组件库演示</a></li>
    </ul>
  </small>
</footer>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  watch
} from 'vue'
import {
  useStore
} from 'vuex'
import 'bootstrap/dist/css/bootstrap.min.css'
import GlobalHeader from './components/GlobalHeader.vue'
import Loader from './components/Loader.vue'
import createMessage from './components/createMessage'

import {
  GlobalDataProps
} from './store/store'
export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader,
    Loader
  },
  setup() {
    const store = useStore < GlobalDataProps > ()
    const currentUser = computed(() => store.state.user)
    const isLoading = computed(() => store.state.loading)
    const error = computed(() => store.state.error)
    watch(() => error.value.status, () => {
      const {
        status,
        message
      } = error.value
      if (status && message) {
        createMessage(message, 'error')
      }
    })
    return {
      currentUser,
      isLoading,
      error
    }
  }
})
</script>

<style>

</style>
