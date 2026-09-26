import { useQuery } from "@tanstack/react-query"
import { getCities } from "@/shared/services/common.service"

export const useCitiesQuery = () => {
  return useQuery({
    queryKey: ["cities"],
    queryFn: getCities,
  })
}
