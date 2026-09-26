import { usePlaceDetailViewModel } from "@/shared/viewmodels/place-detail/place-detail-view-model";
import { PlaceDetailViewUi } from "@/shared/viewmodels/place-detail/place-detail-view-ui";

export default function PlaceDetail() {
  const props = usePlaceDetailViewModel();
  return <PlaceDetailViewUi {...props} />;
}
