import axios, {AxiosInstance} from 'axios'
import { useUserStore } from '../store/user/user-store'

const baseURL = ""

interface ApiClientOptions {
    baseURL?: string
    withAuth?: boolean
}

export class AppDefesaAcaoApiClient {
    
    private instace: AxiosInstance;
    private IsRefreshing = false;

    constructor({ baseURL: clientBaseURL = baseURL, withAuth = true }: ApiClientOptions = {}){
        this.instace = axios.create({
            baseURL: clientBaseURL,
        });

        if (!withAuth) return

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

// API do catálogo turístico: pública, sem token de sessão.
export const tourismApiClient = new AppDefesaAcaoApiClient({
    baseURL: process.env.EXPO_PUBLIC_TOURISM_API_URL,
    withAuth: false,
}).getInstance();
