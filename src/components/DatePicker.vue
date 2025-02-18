<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Picture } from '../services/Apod/models/Picture.ts';
import moment from 'moment';
import { ApodService } from '../services/Apod/ApodService.ts';
import { useDateFormatter } from '../composable/useDateFormatter.ts';

const { momentToQDate, qDateToMoment } = useDateFormatter();

const emit = defineEmits<{
  (event: 'update:pictures', value: Picture[]): void;
}>();

const dateFrom = ref(moment().subtract(7, 'days'))
const dateTo = ref(moment().subtract(1, 'days'))
const dateRange = ref({ 
    from: momentToQDate(dateFrom.value), 
    to: momentToQDate(dateTo.value)
})

const isLoading = ref(false)
const isDateRangeEmpty = ref(false)
const isDateRangeChanged = ref(true)

const availableDate = (date: string): boolean => {
    return qDateToMoment(date).isBefore(moment(), 'day')
}
const pictures = ref<Picture[]>([]);

watch (dateRange, (newDateRange) => {
    isDateRangeChanged.value = true;
    if (!newDateRange) {
        isDateRangeEmpty.value = true;
        return
    }
    isDateRangeEmpty.value = false;

    dateFrom.value = typeof newDateRange === 'string' ? qDateToMoment(newDateRange) : qDateToMoment(newDateRange.from);
    dateTo.value = typeof newDateRange === 'string' ? qDateToMoment(newDateRange) : qDateToMoment(newDateRange.to);
});

const submit = async () => {
    if (!isDateRangeChanged.value || isDateRangeEmpty.value) {
        return
    }

    isLoading.value = true;
    isDateRangeChanged.value = false;

    ApodService.getPicture(dateFrom.value.format('YYYY-MM-DD'), dateTo.value.format('YYYY-MM-DD')).then((response) => {
        pictures.value = response;
    });

    isLoading.value = false;

    emit('update:pictures', pictures.value);
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
                        <div v-else class="self-center full-width no-outline" tabindex="0">{{ momentToQDate(dateFrom) }} - {{ momentToQDate(dateTo) }}</div>
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