import { useSignUpViewModel } from "../shared/viewmodels/sign-up/sign-up-view-model";
import { SignUpViewUi } from "../shared/viewmodels/sign-up/sign-up-view-ui";
export default function SignUp() {
  const props = useSignUpViewModel()
  return (
    <SignUpViewUi {...props}/>
  );
}
