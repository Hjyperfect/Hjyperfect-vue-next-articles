import { createApp, nextTick } from 'vue'
import Modal from './Modal.vue'

interface ModalProps {
  content: string;
  title: string;
  visible: boolean;
}
const createMessage = (props: any, timeout = 2000) => {
  const modalInstance = createApp(Modal, props)
  const mountNode = document.createElement('div')
  document.body.appendChild(mountNode)
  modalInstance.mount(mountNode)
  nextTick(() => {
    if (modalInstance._props) {
      console.log(modalInstance._props)
      // modalInstance.visible = false
    }
  })
  // setTimeout(() => {
  //   messageInstance.unmount(mountNode)
  //   document.body.removeChild(mountNode)
  // }, timeout)
}

export default createMessage
