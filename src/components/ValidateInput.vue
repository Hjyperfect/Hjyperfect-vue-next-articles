<template>
  <div class="validate-input-container pb-3 position-relative">
    <input
      v-if="tag !== 'textarea'"
      class="form-control"
      :class="{'is-invalid': inputRef.error}"
      v-model="inputVal"
      @blur="validateInput"
      v-bind="$attrs"
    >
    <textarea
      v-else
      class="form-control"
      :class="{'is-invalid': inputRef.error}"
      v-model="inputVal"
      @blur="validateInput"
      v-bind="$attrs"
    >
    </textarea>
    <span v-if="inputRef.error" class="invalid-feedback position-absolute mt-1">{{inputRef.message}}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, PropType, onMounted, computed } from 'vue'
import { emitter } from './ValidateForm.vue'
const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
interface RuleProp {
  type: 'required' | 'email' | 'custom' | 'range';
  message?: string;
  validator?: () => boolean;
  min?: {length: number; message: string };
  max?: {length: number; message: string };
}
export type RulesProp = RuleProp[]
export type TagType = 'input' | 'textarea'
export default defineComponent({
  props: {
    rules: Array as PropType<RulesProp>,
    modelValue: String,
    tag: {
      type: String as PropType<TagType>,
      default: 'input'
    }
  },
  inheritAttrs: false,
  setup(props, context) {
    const inputVal = computed({
      get: () => props.modelValue || '',
      set: val => {
        context.emit('update:modelValue', val)
      }
    })
    const inputRef = reactive({
      error: false,
      message: ''
    })
    const validateInput = () => {
      if (props.rules) {
        const allPassed = props.rules.every(rule => {
          let passed = true
          inputRef.message = rule.message || ''
          const { value } = inputVal
          switch (rule.type) {
            case 'required':
              passed = (value.trim() !== '')
              break
            case 'email':
              passed = emailReg.test(value)
              break
            case 'range': {
              const { min, max } = rule
              if (min && value.trim().length < min.length) {
                passed = false
                inputRef.message = min.message
              }
              if (max && value.trim().length > max.length) {
                passed = false
                inputRef.message = max.message
              }
              break
            }
            case 'custom':
              passed = rule.validator ? rule.validator() : true
              break
            default:
              break
          }
          return passed
        })
        inputRef.error = !allPassed
        return allPassed
      }
      return true
    }
    onMounted(() => {
      emitter.emit('form-item-created', validateInput)
    })
    return {
      inputRef,
      validateInput,
      inputVal
    }
  }
})
</script>

<style>

.validate-input-container .error-message {
  bottom: -5px;
}
</style>
