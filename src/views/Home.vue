<template>
<div class="home-page container-md">
  <section class="text-center container">
    <div class="row py-lg-5">
      <div class="col-lg-6 col-md-8 mx-auto">
        <img src="../assets/callout.svg" alt="callout" class="w-50" />
        <h2 class="font-weight-light">随心写作，自由表达</h2>
        <p>
          <a href="#" class="btn btn-primary my-2" @click.prevent="createOrLogin">开始写文章</a>
        </p>
      </div>
    </div>
  </section>
  <h4 class="font-weight-bold text-center mb-4">发现精彩</h4>
  <column-list :list="list"></column-list>
  <button class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25" @click="loadMorePage" v-if="!isLastPage">
    加载更多
  </button>
</div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  onMounted
} from 'vue'
import {
  useStore
} from 'vuex'
import {
  useRouter
} from 'vue-router'
import {
  GlobalDataProps
} from '../store/store'
import ColumnList from '../components/ColumnList.vue'
import {
  objToArr
} from '../utils/common'
import useLoadMore from '../hooks/useLoadMore'

export default defineComponent({
  name: 'Home',
  components: {
    ColumnList
  },
  setup() {
    const store = useStore < GlobalDataProps > ()
    const router = useRouter()
    const totalColumns = computed(() => store.state.columns.total || 0)
    const currentPage = computed(() => store.state.columns.currentPage || 0)
    onMounted(() => {
      store.dispatch('fetchColumns')
    })
    const list = computed(() => objToArr(store.state.columns.data))
    const {
      loadMorePage,
      isLastPage
    } = useLoadMore('fetchColumns', totalColumns, {
      currentPage: currentPage.value
    }, 6)

    const createOrLogin = () => {
      const isLogin = store.state.user.isLogin
      if (!isLogin) {
        router.push('/login')
      } else {
        router.push('/create')
      }
    }
    return {
      list,
      loadMorePage,
      isLastPage,
      totalColumns,
      createOrLogin
    }
  }
})
</script>
