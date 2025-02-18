import axios from 'axios';
import { Picture } from './models/Picture';

const apodEndPoint = 'https://api.nasa.gov/planetary/apod';

export class ApodService {
    static async getPicture(start_date: string, end_date: string): Promise<Picture[]> {
        const params = new URLSearchParams();
        params.append('api_key', import.meta.env.VITE_NASA_API_KEY);
        params.append('start_date', start_date);
        params.append('end_date', end_date);
        params.append('thumbs', 'true');
        const url = `${apodEndPoint}?${params.toString()}`;
        const data = (await axios.get<Picture[]>(url)).data;
        return data;
    }
}