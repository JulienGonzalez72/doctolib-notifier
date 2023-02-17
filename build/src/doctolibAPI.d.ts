import { AxiosInstance } from 'axios';
import { Availabilities } from './types';
export default class DoctolibAPI {
    axios: AxiosInstance;
    constructor();
    connect(): Promise<void>;
    getAvailabilities(startDate: Date, motiveId: number, agendaId: number): Promise<Availabilities>;
    getProfile(firstName: string, lastName: string): Promise<unknown>;
    private get;
    private formatDate;
}
