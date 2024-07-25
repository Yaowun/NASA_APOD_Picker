<script setup lang="ts">
import { defineProps } from 'vue'
import type { Picture } from '../types/types.ts';
import Image from './Image.vue'

const props = defineProps<{
    pictures: Picture[];
}>();
</script>

<template>
    <div class="row q-pa-md">
        <Image 
            v-for="(picture, index) in props.pictures"
            :picture="picture"
            :index="index"
        />
    </div>
</template>