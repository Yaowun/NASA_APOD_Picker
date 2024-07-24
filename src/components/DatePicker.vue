<script setup lang="ts">
import { ref, watch } from 'vue'
import moment from 'moment';
import axios from 'axios';
import type { Picture } from '../types.ts';


const dateFormat = 'YYYY/MM/DD'
const dateFrom = ref(moment().subtract(7, 'days'))
const dateTo = ref(moment().subtract(1, 'days'))
const dateRange = ref({ 
    from: dateFrom.value.format(dateFormat), 
    to: dateTo.value.format(dateFormat)
})
const isDateRangeChanged = ref(true)
const isLoading = ref(false)

const availableDate = (date: string): boolean => {
    return moment(date, 'YYYY-MM-DD').isBefore(moment(), 'day')
}
const apodEndPoint = ref('https://api.nasa.gov/planetary/apod')
const pictures = ref<Picture[]>([]);

const emit = defineEmits<{
  (event: 'update:pictures', value: Picture[]): void;
}>();

watch (dateRange, (newDateRange) => {
    isDateRangeChanged.value = true;
    if (newDateRange) {
        dateFrom.value = typeof newDateRange === 'string' ? moment(newDateRange, dateFormat) : moment(newDateRange.from, dateFormat);
        dateTo.value = typeof newDateRange === 'string' ? moment(newDateRange, dateFormat) : moment(newDateRange.to, dateFormat);
        console.log(dateFrom.value.format('YYYY-MM-DD'), dateTo.value.format('YYYY-MM-DD'))
    }
});

function singleDateRequest(date: string) {
    apodEndPoint.value = `https://api.nasa.gov/planetary/apod?api_key=${import.meta.env.VITE_NASA_API_KEY}&date=${date}`;
}

function multipleDateRequest(start_date: string, end_date: string) {
    apodEndPoint.value = `https://api.nasa.gov/planetary/apod?api_key=${import.meta.env.VITE_NASA_API_KEY}&start_date=${start_date}&end_date=${end_date}`;
}

async function submit() {
    if (!isDateRangeChanged.value) {
        return
    }
    isLoading.value = true;
    isDateRangeChanged.value = false;

    if (dateFrom.value.isSame(dateTo.value)) {
        singleDateRequest(dateFrom.value.format('YYYY-MM-DD'))
        pictures.value = [(await axios.get<Picture>(apodEndPoint.value)).data];
    }
    else {
        multipleDateRequest(dateFrom.value.format('YYYY-MM-DD'), dateTo.value.format('YYYY-MM-DD'))
        pictures.value = (await axios.get<Picture[]>(apodEndPoint.value)).data;
    }

    isLoading.value = false;

    emit('update:pictures', pictures.value);
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
                    :disable="!isDateRangeChanged"
                    :loading="isLoading"
                />
            </div>
        </q-form>
    </div>
</template>