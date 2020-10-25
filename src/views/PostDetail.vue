<template>
<div class="post-detail-page w-690">
  <modal title="删除文章" content="确定要删除这篇文章吗？" @modal-on-close="modalIsVisible = false" @modal-on-confirm="hideAndDelete" :visible="modalIsVisible">
  </modal>
  <nav aria-label="breadcrumb" v-if="currentPost">
    <ol class="breadcrumb">
      <li class="breadcrumb-item">
        <router-link to="/">首页</router-link>
      </li>
      <li class="breadcrumb-item">
        <router-link :to="`/column/${currentPost.column}`">专栏首页</router-link>
      </li>
      <li class="breadcrumb-item active" aria-current="page">{{currentPost.title}}</li>
    </ol>
  </nav>
  <article class="mb-5 pb-3" v-if="currentPost">
    <img :src="currentImageUrl" alt="currentPost.title" class="rounded-lg img-fluid my-4" v-if="currentImageUrl">
    <h2 class="mb-4">{{currentPost.title}}</h2>
    <div class="user-profile-component border-top border-bottom py-3 mb-5 align-items-center row g-0">
      <div class="col">
        <user-profile :user="currentPost.author" v-if="typeof currentPost.author === 'object'"></user-profile>
      </div>
      <span class="text-muted col text-right font-italic">发表于：{{currentPost.createdAt}}</span>
    </div>
    <div v-html="currentHTML"></div>
    <div v-if="showEditArea" class="btn-group mt-5">
      <router-link type="button" class="btn btn-success" :to="{ name: 'create', query: {id: currentPost._id}}">编辑</router-link>
      <button type="button" class="btn btn-danger" @click="modalIsVisible = true">删除</button>
    </div>
  </article>
</div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  computed,
  ref
} from 'vue'
import MarkdownIt from 'markdown-it'
import {
  useStore
} from 'vuex'
import {
  useRoute,
  useRouter
} from 'vue-router'
import {
  GlobalDataProps,
  PostProps,
  ImageProps,
  UserProps,
  ResponseType
} from '../store/store'
import UserProfile from '../components/UserProfile.vue'
import Modal from '../components/Modal.vue'
import createMessage from '../components/createMessage'

export default defineComponent({
  name: 'post-detail',
  components: {
    UserProfile,
    Modal
  },
  setup() {
    const store = useStore < GlobalDataProps > ()
    const router = useRouter()
    const route = useRoute()
    const currentId = route.params.id
    const modalIsVisible = ref(false)
    const md = new MarkdownIt()
    onMounted(() => {
      store.dispatch('fetchPost', currentId)
    })
    const currentPost = computed < PostProps > (() => store.getters.getCurrentPost(currentId))
    const currentHTML = computed(() => {
      if (currentPost.value && currentPost.value.content) {
        const {
          isHTML,
          content
        } = currentPost.value
        return isHTML ? content : md.render(content)
      }
    })
    const currentImageUrl = computed(() => {
      if (currentPost.value && currentPost.value.image) {
        const {
          image
        } = currentPost.value
        return (image as ImageProps).url + '?x-oss-process=image/resize,w_850'
      } else {
        return null
      }
    })
    const showEditArea = computed(() => {
      if (currentPost.value && currentPost.value.author) {
        const postAuthor = currentPost.value.author as UserProps
        return postAuthor._id === store.state.user._id
      } else {
        return false
      }
    })
    const hideAndDelete = () => {
      modalIsVisible.value = false
      store.dispatch('deletePost', currentId).then((rawData: ResponseType < PostProps > ) => {
        console.log(rawData)
        createMessage('删除成功，2秒后跳转到专栏首页', 'success', 2000)
        setTimeout(() => {
          router.push({
            name: 'column',
            params: {
              id: rawData.data.column
            }
          })
        }, 2000)
      })
    }
    return {
      currentPost,
      currentHTML,
      currentImageUrl,
      showEditArea,
      modalIsVisible,
      hideAndDelete
    }
  }
})
</script>
