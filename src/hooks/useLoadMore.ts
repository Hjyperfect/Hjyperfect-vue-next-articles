import { ref, computed, ComputedRef } from 'vue'
import { useStore } from 'vuex'
interface LoadPrams {
  currentPage?: number;
  pageSize?: number;
  [key: string]: any;
}
const useLoadMore = (actionName: string, total: ComputedRef<number>, params: LoadPrams = {}, pageSize = 5) => {
  const store = useStore()
  // current page should equals 1, start from the second page
  const currentPage = ref((params && params.currentPage) || 1)
  const requestParams = computed(() => {
    return {
      ...params,
      currentPage: currentPage.value + 1
    }
  })
  // function to trigger load more
  const loadMorePage = () => {
    store.dispatch(actionName, requestParams.value).then(() => {
      currentPage.value++
    })
  }
  const isLastPage = computed(() => {
    return Math.ceil((total.value || 1) / pageSize) === currentPage.value
  })
  return {
    currentPage,
    loadMorePage,
    isLastPage
  }
}

export default useLoadMore
