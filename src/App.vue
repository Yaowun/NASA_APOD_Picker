<script setup lang="ts">
import { ref } from 'vue';
import DatePicker from './components/DatePicker.vue'
import Gallery from './components/Gallery.vue'
import type { Picture } from './types.ts';

const pictures = ref<Picture[]>([]);

function updatePictures(value: Picture[]) {
  pictures.value = value;
}
</script>

<template>
  <DatePicker @update:pictures="updatePictures" />
  <Gallery :pictures="pictures" />
</template>

<style scoped>
</style>
