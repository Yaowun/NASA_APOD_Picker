<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Picture } from '../services/Apod/models/Picture.ts';
import moment from 'moment';
import { ApodService } from '../services/Apod/ApodService.ts';
import { useDateFormatter } from '../composable/useDateFormatter.ts';
import { DateTimeFormat } from '../enum/DateTimeFormat';
import { Notify } from 'quasar';
import axios from 'axios';

const { momentToDateUrl, dateUrlToMoment } = useDateFormatter();

const emit = defineEmits<{
  (event: 'update:pictures', value: Picture[]): void;
}>();

const dateFrom = ref(moment().subtract(7, 'days'))
const dateTo = ref(moment().subtract(1, 'days'))
const dateRange = ref({ 
    from: momentToDateUrl(dateFrom.value), 
    to: momentToDateUrl(dateTo.value)
})

const isLoading = ref(false)
const isDateRangeEmpty = ref(false)
const isDateRangeChanged = ref(true)

const availableDate = (date: string): boolean => {
    return dateUrlToMoment(date).isBefore(moment(), 'day')
}
const pictures = ref<Picture[]>([]);

watch (dateRange, (newDateRange) => {
    isDateRangeChanged.value = true;
    if (!newDateRange) {
        isDateRangeEmpty.value = true;
        return
    }
    isDateRangeEmpty.value = false;

    if (typeof newDateRange === 'string') {
        dateFrom.value = dateUrlToMoment(newDateRange)
        dateTo.value = dateUrlToMoment(newDateRange)
    } else {
        dateFrom.value = dateUrlToMoment(newDateRange.from)
        dateTo.value = dateUrlToMoment(newDateRange.to)
    }
});

const submit = async () => {
    if (!isDateRangeChanged.value || isDateRangeEmpty.value) {
        return
    }

    isLoading.value = true;
    isDateRangeChanged.value = false;

    try {
        await ApodService.getPicture(momentToDateUrl(dateFrom.value), momentToDateUrl(dateTo.value)).then((response) => {
            pictures.value = response;
            emit('update:pictures', pictures.value);
        });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response && error.response.status === 400) {
                Notify.create({
                    type: 'warning',
                    message: error.response.data.msg,
                    position: 'top',
                    timeout: 5000
                });
            }
        } else {
            Notify.create({
                type: 'negative',
                message: 'Unexpected error occurred, please try again later.',
                position: 'top',
                timeout: 5000
            });
        }
    } finally {
        isLoading.value = false;
    }
}
</script>

<template>
    <q-form 
        @submit="submit"
        class="row flex-center q-pa-md" 
        vertical-middle
    >
        <div class="q-mx-md">
            <q-date 
                v-model="dateRange"
                :options="availableDate"
                :mask="DateTimeFormat.dateUrl"
                range
                minimal
            />
            <div class="row justify-between q-pt-sm">
                <q-field 
                    class="col-8" 
                    label="Date Range" 
                    stack-label
                >
                    <template v-slot:control>
                        <div v-if="isDateRangeEmpty" class="self-center full-width no-outline" tabindex="0"></div>
                        <div v-else class="self-center full-width no-outline" tabindex="0">{{ momentToDateUrl(dateFrom) }} - {{ momentToDateUrl(dateTo) }}</div>
                    </template>
                </q-field>
                <q-btn 
                    label="Submit"
                    type="submit" 
                    color="primary"
                    :disable="!isDateRangeChanged"
                    :loading="isLoading"
                />
            </div>
        </div>
    </q-form>
</template>