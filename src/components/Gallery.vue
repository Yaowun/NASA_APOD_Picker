<script setup lang="ts">
import { ref, defineProps } from 'vue'

const slide = ref(0)
const props = defineProps<{
    pictureUrls: string[];
}>();
</script>

<template>
    <div class="q-pa-md">
        <q-carousel
            swipeable
            animated
            v-model="slide"
            thumbnails
            infinite
        >
            <q-carousel-slide
                v-for="(url, index) in props.pictureUrls"
                :key="index"
                :name="index"
                :img-src="url"
            />
        </q-carousel>
    </div>
</template>