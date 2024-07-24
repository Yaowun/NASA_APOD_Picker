<script setup lang="ts">
import { ref, defineProps } from 'vue'
import type { Picture } from '../types/types.ts';

const slide = ref(0)
const props = defineProps<{
    pictures: Picture[];
}>();

function resolveMediaUrl(picture: Picture) {
    if (picture.media_type === 'video') {
        return picture.thumbnail_url;
    }
    return picture.url;
}
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
                v-for="(picture, index) in props.pictures"
                :key="index"
                :name="index"
                :img-src="resolveMediaUrl(picture)"
            />
        </q-carousel>
    </div>
</template>