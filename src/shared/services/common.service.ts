import { ecoAmazoniaApiClient } from "../api";
import { CityHttpResponse, SecretariatHttpResponse } from "../interfaces/http/common-interface";

export const getCities = async () => {
  const { data } = await ecoAmazoniaApiClient.get<CityHttpResponse[]>("");
  return data;
};

export const getSecretariats = async () => {
  const { data } = await ecoAmazoniaApiClient.get<SecretariatHttpResponse[]>("");
  return data;
};
