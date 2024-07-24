<script setup lang="ts">
import { ref, defineProps } from 'vue'
import type { Picture } from '../types.ts';

const slide = ref(0)
const props = defineProps<{
    pictures: Picture[];
}>();

function resolveMediaUrl(url: string, mediaType: 'image' | 'video') {
    if (mediaType === 'video') {
        const match = url.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
        if (match && match[1]) {
            return `http://i3.ytimg.com/vi/${match[1]}/hqdefault.jpg`;
        }
    }
    return url;
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
                :img-src="resolveMediaUrl(picture.url, picture.media_type)"
            />
        </q-carousel>
    </div>
</template>