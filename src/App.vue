<script setup lang="ts">
import { ref } from 'vue';
import DatePicker from './components/DatePicker.vue'
import Gallery from './components/Gallery.vue'

const pictureUrls = ref<string[]>([]);

function updatePictureUrls(value: string[]) {
  pictureUrls.value = value;
}
</script>

<template>
  <DatePicker @update:pictureUrls="updatePictureUrls" />
  <Gallery :pictureUrls="pictureUrls" />
</template>

<style scoped>
</style>
