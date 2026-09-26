import { useHomeViewModel } from "@/shared/viewmodels/home/home-view-model";
import { HomeViewUi } from "@/shared/viewmodels/home/home-view-ui";

export default function Home() {
  const props = useHomeViewModel();
  return <HomeViewUi {...props} />;
}
