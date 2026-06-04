import { BikeManager } from "@/components/admin/bikes/bike-manager";

export const metadata = {
  title: "Admin Bikes",
};

export default function AdminBikesPage() {
  return <BikeManager view="list" />;
}
