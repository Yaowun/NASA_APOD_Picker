import moment from 'moment';
import { DateTimeFormat } from '../enum/DateTimeFormat';

export function useDateFormatter() {
    const momentToDateUrl = (date: moment.Moment) => {
        return date.format(DateTimeFormat.dateUrl);
    };

    const dateUrlToMoment = (date: string) => {
        return moment(date, DateTimeFormat.dateUrl);
    };

    return { momentToDateUrl, dateUrlToMoment };
}