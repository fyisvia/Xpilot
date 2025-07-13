<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" @click.self="close">
    <div class="bg-base-100 p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
      <h2 class="text-2xl font-bold mb-4">通知：</h2>
      <br>
      <p class="mb-6">原域名xpilot.top已更换为mj.fyisvia.com</p>
      <p class="mb-6">请在浏览器地址栏输入新域名访问。</p>
      <p class="mb-6">原域名将在一段时间后停止维护。</p>
      <div class="flex justify-end">
        <button @click="close" class="btn btn-primary">好的</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};
</script>