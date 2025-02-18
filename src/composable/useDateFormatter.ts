import moment from 'moment';
import { DateTimeFormat } from '../enum/DateTimeFormat';

export function useDateFormatter() {
    const momentToQDate = (date: moment.Moment) => {
        return date.format(DateTimeFormat.qDate);
    };

    const qDateToMoment = (date: string) => {
        return moment(date, DateTimeFormat.momentDate);
    };

    return { momentToQDate, qDateToMoment };
}