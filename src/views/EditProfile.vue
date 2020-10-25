<template>
<div class="update-profile-page w-690">
  <ul class="nav nav-tabs my-4">
    <li class="nav-item">
      <a href="#" :class="generateActiveClass('profile')" @click.prevent="switchTab('profile')">
        更新个人资料
      </a>
    </li>
    <li>
      <a href="#" :class="generateActiveClass('column')" @click.prevent="switchTab('column')">
        更新专栏信息
      </a>
    </li>
  </ul>
  <h4>编辑个人资料</h4>
  <uploader action="/upload" class="d-flex align-items-center justify-content-center bg-light text-secondary circle mx-auto my-3" :beforeUpload="commonUploadCheck" :uploaded="uploadedData" @file-uploaded="onFileUploaded">
    <template v-slot:uploaded="dataProps">
      <img :src="dataProps.uploadedData.data.url + '?x-oss-process=image/resize,m_fill,h_200,w_200'">
    </template>
    <h3>点击上传头像</h3>
  </uploader>
  <validate-form ref="formRef" @form-submit="onFormSubmit">
    <validate-input :rules="nameRules" placeholder="请输入名称" v-model="nameValue" type="text" />
    <validate-input :rules="descRules" placeholder="请输入简介信息" v-model="descValue" rows="5" tag="textarea" />
    <template #submit>
      <button class="btn btn-primary btn-large">提交修改</button>
    </template>
  </validate-form>
</div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  watch
} from 'vue'
import {
  useStore
} from 'vuex'
import {
  useRouter
} from 'vue-router'
import {
  GlobalDataProps,
  ResponseType,
  ImageProps
} from '../store/store'
import Uploader from '../components/Uploader.vue'
import ValidateInput, {
  RulesProp
} from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import createMessage from '../components/createMessage'
import {
  commonUploadCheck
} from '../utils/common'
type EditCategory = 'profile' | 'column' | 'init'
export default defineComponent({
  components: {
    Uploader,
    ValidateInput,
    ValidateForm
  },
  setup() {
    const store = useStore < GlobalDataProps > ()
    const router = useRouter()
    const currentCategory = ref < EditCategory > ('init')
    const generateActiveClass = (klass: EditCategory) => {
      return {
        active: currentCategory.value === klass,
        'nav-link': true
      }
    }

    const userStore = computed(() => {
      return store.state.user
    })
    const uploadedData = ref()
    const currentColumn = computed(() => {
      return store.getters.getColumnById(userStore.value.column)
    })
    watch(currentCategory, () => {
      if (currentCategory.value === 'profile') {
        if (userStore.value && userStore.value.avatar) {
          const {
            avatar
          } = userStore.value
          uploadedData.value = {
            data: avatar
          }
        }
      } else {
        if (currentColumn.value && currentColumn.value.avatar) {
          const {
            avatar
          } = currentColumn.value
          uploadedData.value = {
            data: avatar
          }
        } else {
          uploadedData.value = null
        }
      }
    })
    const nameValue = ref(userStore.value && userStore.value.nickName)
    const descValue = ref(userStore.value && userStore.value.description)
    const switchTab = (which: EditCategory) => {
      currentCategory.value = which
      if (which === 'column' && currentColumn.value) {
        const {
          title,
          description
        } = currentColumn.value
        nameValue.value = title
        descValue.value = description
      } else {
        const {
          nickName,
          description
        } = userStore.value
        nameValue.value = nickName
        descValue.value = description
      }
    }
    onMounted(() => {
      currentCategory.value = 'profile'
      const cid = userStore.value.column
      if (cid) {
        store.dispatch('fetchColumn', cid)
      }
    })
    let imageId = ''
    const nameRules: RulesProp = [{
      type: 'required',
      message: '文章标题不能为空'
    }]
    const descRules: RulesProp = [{
      type: 'required',
      message: '文章详情不能为空'
    }]
    const onFileUploaded = (rawData: ResponseType < ImageProps > ) => {
      if (rawData.data._id) {
        imageId = rawData.data._id
      }
    }
    const onFormSubmit = (result: boolean) => {
      if (result) {
        let payload: any = {}
        if (currentCategory.value === 'profile') {
          payload = {
            _id: userStore.value._id,
            nickName: nameValue.value,
            description: descValue.value
          }
        } else {
          payload = {
            _id: currentColumn.value._id,
            title: nameValue.value,
            description: descValue.value
          }
        }
        if (imageId) {
          payload.avatar = imageId
        }
        const actionName = currentCategory.value === 'profile' ? 'updateUser' : 'updateColumn'
        const sendData = currentCategory.value === 'profile' ? {
          id: userStore.value._id,
          payload
        } : {
          id: currentColumn.value._id,
          payload
        }
        store.dispatch(actionName, sendData).then(() => {
          createMessage('修改成功，2秒后跳转到首页', 'success', 2000)
          setTimeout(() => {
            router.push('/')
          }, 2000)
        })
      }
    }
    return {
      nameRules,
      descRules,
      nameValue,
      descValue,
      onFileUploaded,
      commonUploadCheck,
      onFormSubmit,
      generateActiveClass,
      switchTab,
      uploadedData
    }
  }
})
</script>

<style>
.circle {
  width: 200px;
  height: 200px;
  border-radius: 200px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid #efefef;
}
</style>
