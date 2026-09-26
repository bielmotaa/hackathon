import { usePlacesViewModel } from "@/shared/viewmodels/places/places-view-model";
import { PlacesViewUi } from "@/shared/viewmodels/places/places-view-ui";

export default function Places() {
  const props = usePlacesViewModel();
  return <PlacesViewUi {...props} />;
}
