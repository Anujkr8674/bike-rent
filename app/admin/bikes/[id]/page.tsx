import { BikeManager } from "@/components/admin/bikes/bike-manager";

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata = {
  title: "Edit Bike",
};

export default async function AdminBikeEditPage({ params }: Props) {
  const { id } = await params;
  return <BikeManager view="form" bikeId={id} />;
}
