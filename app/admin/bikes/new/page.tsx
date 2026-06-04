import { BikeManager } from "@/components/admin/bikes/bike-manager";

export const metadata = {
  title: "Add Bike",
};

export default function AdminBikeNewPage() {
  return <BikeManager view="form" />;
}
