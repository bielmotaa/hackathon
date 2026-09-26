import { useMutation } from "@tanstack/react-query"
import { RegisterHttpParams } from "@/shared/interfaces/http/sign-in-interface";
import { register } from "@/shared/services/auths.service";

export const useRegisterMutation = () => {
    const mutation = useMutation({
      mutationFn: (userData: RegisterHttpParams) => register(userData),
      onSuccess: (response) => {
        console.log(response)
      },
      onError: (error) => {
        console.log(error)
      },
    })
  
    return mutation
  }