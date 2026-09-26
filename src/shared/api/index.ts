import axios, {AxiosInstance} from 'axios'
import { useUserStore } from '../store/user/user-store'

const baseURL = ""
export class AppDefesaAcaoApiClient {
    
    private instace: AxiosInstance;
    private IsRefreshing = false;

    constructor(){
        this.instace = axios.create({
            baseURL,
        });

        this.instace.interceptors.request.use((config) => {
            const token = useUserStore.getState().token

            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }

            return config
        })
    }

    getInstance(){
        return this.instace
    }
}

export const ecoAmazoniaApiClient = new AppDefesaAcaoApiClient().getInstance(); 