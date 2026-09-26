import { useMapViewModel } from "@/shared/viewmodels/map/map-view-model";
import { MapViewUi } from "@/shared/viewmodels/map/map-view-ui";

export default function MapScreen() {
  const props = useMapViewModel();
  return <MapViewUi {...props} />;
}
