import { tourismApiClient } from "../api";
import { Coordinates } from "../hooks/use-user-location";
import {
  CategoryHttpResponse,
  NearbyPlacesHttpResponse,
  PlaceHttpResponse,
  PlacesPageHttpResponse,
} from "../interfaces/http/tourism-interface";

export const getCategories = async () => {
  const { data } = await tourismApiClient.get<CategoryHttpResponse[]>("/categorias");
  return data;
};

export const getPlacesByCategory = async (slug: string, limit: number, offset: number) => {
  const { data } = await tourismApiClient.get<PlacesPageHttpResponse>(
    `/categorias/${slug}/pontos`,
    { params: { limit, offset } }
  );
  return data;
};

export const getPlaceById = async (id: string) => {
  const { data } = await tourismApiClient.get<PlaceHttpResponse>(`/pontos/${id}`);
  return data;
};

export const getNearbyPlaces = async ({ latitude, longitude }: Coordinates, radiusKm: number, limit: number) => {
  const { data } = await tourismApiClient.get<NearbyPlacesHttpResponse>("/pontos/proximos", {
    params: { latitude, longitude, raio_km: radiusKm, limite: limit },
  });
  return data;
};
