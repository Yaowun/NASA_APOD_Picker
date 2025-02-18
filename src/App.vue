<script setup lang="ts">
import { ref } from 'vue';
import type { Picture } from './services/Apod/models/Picture.ts';
import Header from './components/Header.vue'
import DatePicker from './components/DatePicker.vue'
import Gallery from './components/Gallery.vue'

const pictures = ref<Picture[]>([]);

function updatePictures(value: Picture[]) {
  pictures.value = value;
}
</script>

<template>
  <Header />
  <DatePicker @update:pictures="updatePictures" />
  <Gallery :pictures="pictures" />
</template>

<style scoped>
</style>
