
import { useSignInViewModel } from "../shared/viewmodels/sign-in/sign-in-view-model";
import { SignInViewUi } from "../shared/viewmodels/sign-in/sign-in-view-ui";
export default function SignIn() {
  const props = useSignInViewModel()
  return (
    <SignInViewUi {...props}/>
  );
}