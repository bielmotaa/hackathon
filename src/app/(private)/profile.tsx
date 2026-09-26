import { useProfileViewModel } from "@/shared/viewmodels/profile/profile-view-model";
import { ProfileViewUi } from "@/shared/viewmodels/profile/profile-view-ui";

export default function Profile() {
  const props = useProfileViewModel();
  return <ProfileViewUi {...props} />;
}
