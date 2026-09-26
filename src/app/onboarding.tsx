import { useOnboardingViewModel } from "@/shared/viewmodels/onboarding/onboarding-view-model";
import { OnboardingViewUi } from "@/shared/viewmodels/onboarding/onboarding-view-ui";

export default function Onboarding() {
  const props = useOnboardingViewModel();
  return <OnboardingViewUi {...props} />;
}
