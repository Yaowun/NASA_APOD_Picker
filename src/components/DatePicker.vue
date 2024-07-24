<script setup lang="ts">
import { ref, watch } from 'vue'
import moment from 'moment';
import axios from 'axios';

const dateFormat = 'YYYY/MM/DD'
const dateFrom = ref(moment().subtract(3, 'days'))
const dateTo = ref(moment().subtract(1, 'days'))
const dateRange = ref({ 
    from: dateFrom.value.format(dateFormat), 
    to: dateTo.value.format(dateFormat)
})

const availableDate = (date: string): boolean => {
    return moment(date, 'YYYY-MM-DD').isBefore(moment(), 'day')
}

const pictureUrls = ref<string[]>([]);

const emit = defineEmits<{
  (event: 'update:pictureUrls', value: string[]): void;
}>();

watch (dateRange, (newDateRange) => {
    if (newDateRange) {
        dateFrom.value = typeof newDateRange === 'string' ? moment(newDateRange, dateFormat) : moment(newDateRange.from, dateFormat);
        dateTo.value = typeof newDateRange === 'string' ? moment(newDateRange, dateFormat) : moment(newDateRange.to, dateFormat);
        console.log(dateFrom.value.format('YYYY-MM-DD'), dateTo.value.format('YYYY-MM-DD'))
    }
});

function getPicture(date: string) {
    const apodEndPoint = `https://api.nasa.gov/planetary/apod?api_key=${import.meta.env.VITE_NASA_API_KEY}&date=${date}`;

    axios.get(apodEndPoint).then((response) => {
        response.data.url = response.data.media_type === 'video' ? `http://i3.ytimg.com/vi/${response.data.url.match(/\/embed\/([a-zA-Z0-9_-]{11})/)[1]}/hqdefault.jpg` : response.data.url;
        pictureUrls.value.push(response.data.url)
    });
}

function submit() {
    pictureUrls.value = <string[]>([]);
    const pickDate = dateFrom.value;
    console.log('pickDate', pickDate.format('YYYY-MM-DD'))
    console.log('dateTo', dateTo.value.format('YYYY-MM-DD'))
    while (pickDate.isSameOrBefore(dateTo.value)) {
        getPicture(pickDate.format('YYYY-MM-DD'))
        pickDate.add(1, 'days')
    }
    emit('update:pictureUrls', pictureUrls.value);
}
</script>

<template>
    <div class="q-pa-md">
        <q-form @submit="submit" class="q-gutter-md">
            <q-date 
                v-model="dateRange"
                :options="availableDate"
                range
                minimal
            />

            <div>
                <q-btn 
                    label="Submit" 
                    type="submit" 
                    color="primary"
                />
            </div>
        </q-form>
    </div>
</template>