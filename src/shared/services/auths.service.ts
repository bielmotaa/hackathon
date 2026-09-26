import { ecoAmazoniaApiClient } from "../api";
import {
  RegisterHttpParams,
  SignInHttpParams,
  SignInHttpResponse,
  UserProfileHttpResponse,
} from "../interfaces/http/sign-in-interface";

export const register = async (userData: RegisterHttpParams) => {
  try {
    await ecoAmazoniaApiClient.post<void>("/app/user", userData);
  } catch (error) {
    console.error("Erro ao registrar:", error);
    throw error;
  }
};

export const signIn = async (credentials: SignInHttpParams) => {
  const response = await ecoAmazoniaApiClient.post<SignInHttpResponse>(
    "",
    credentials
  );
  return response.data;
};

export const getUserProfile = async (userId: string, applicationId: string) => {
  const response = await ecoAmazoniaApiClient.get<UserProfileHttpResponse>(
    `/user/${userId}/application/${applicationId}`
  );
  return response.data;
};