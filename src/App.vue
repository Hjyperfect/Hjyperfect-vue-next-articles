<template>
<div class="container-fluid px-0 flex-shrink-0 bg-light bg-gradient">
  <global-header :user="currentUser"></global-header>
  <loader v-if="isLoading"></loader>
  <router-view></router-view>
</div>
<footer class="text-center py-4 text-secondary bg-light mt-auto">
  <small>
    <ul class="list-inline mb-0">
      <li class="list-inline-item">©（个人）版权所有 | 希望有兴趣者共同进步与交流</li>
      <li class="list-inline-item">微信: 17864307858</li>
      <li class="list-inline-item">持续更新</li>
      <li class="list-inline-item">喜欢的点个星星</li>
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
