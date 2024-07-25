<script setup lang="ts">
import { ref, defineProps, onMounted, onUnmounted } from 'vue'
import type { Picture } from '../types/types.ts';

const props = defineProps<{
    picture: Picture;
    index: number;
}>();

const windowWidth = ref(window.innerWidth);
const windowHeight = ref(window.innerHeight);
const windowAspectRatio = ref(0);
const imageAspectRatio = ref(0);
const imageStyle = ref('');
const pictureSize = ref('');
const showPictureInfo = ref(false);
const showPictureDetail = ref(false);

const updateWindowSize = () => {
    windowWidth.value = window.innerWidth;
    windowHeight.value = window.innerHeight;
    windowAspectRatio.value = windowWidth.value / windowHeight.value;
    pictureSize.value = getPictureSize(windowWidth.value);
    if (imageAspectRatio.value > windowAspectRatio.value) {
        imageStyle.value = `width: 90vw; height: ${90 * windowAspectRatio.value / imageAspectRatio.value}vh; overflow: hidden;`;
    } else {
        imageStyle.value = `width: ${90 / windowAspectRatio.value * imageAspectRatio.value}vw; height: 90vh; overflow: hidden;`;
    }
};

const getImageSize = (url: string) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
        imageAspectRatio.value = img.naturalWidth / img.naturalHeight;
        updateWindowSize();
    };
    img.onerror = (error) => {
        console.error('Failed to load image', error);
    };
};

onMounted(() => {
    getImageSize(resolveMediaUrl(props.picture));
    window.addEventListener('resize', updateWindowSize);
});

onUnmounted(() => {
    window.removeEventListener('resize', updateWindowSize);
});

function getPictureSize(windowWidth: number) {
    if (windowWidth < 450) {
        return '100%'
    }
    return '400px'
}

function resolveMediaUrl(picture: Picture) {
    if (picture.media_type === 'video') {
        return picture.thumbnail_url;
    }
    return picture.url;
}
</script>
<template>
    <q-card 
        class="q-ma-md"
        :style="`width: ${pictureSize}; height: ${pictureSize}; cursor: pointer`"
        @mouseover="showPictureInfo = true"
        @mouseleave="showPictureInfo = false"
        @click="showPictureDetail = true;"
    >
        <q-img
            style="width: 100%; height: 100%;"
            :key="props.index"
            :src="resolveMediaUrl(props.picture)"
        >
            <div class="absolute-full text-subtitle1 text-center flex flex-center" v-show="showPictureInfo">
                {{ props.picture.title }}
            </div>
        </q-img>
    </q-card>
    <q-dialog 
        v-model="showPictureDetail" 
        maximized
        backdrop-filter="contrast(15%)"
    >
      <q-card :style="imageStyle">
        <q-img
            :src="resolveMediaUrl(props.picture)"
            style="width: 100%; height: 100%;"
        />
      </q-card>
    </q-dialog>
</template>