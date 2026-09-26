import { useQuery } from "@tanstack/react-query"
import { getSecretariats } from "@/shared/services/common.service"

export const useSecretariatsQuery = () => {
  return useQuery({
    queryKey: ["secretariats"],
    queryFn: getSecretariats,
  })
}
