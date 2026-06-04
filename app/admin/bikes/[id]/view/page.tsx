import { BikeAdminDetail } from "@/components/admin/bikes/bike-admin-detail";

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata = {
  title: "View Bike",
};

export default async function AdminBikeViewPage({ params }: Props) {
  const { id } = await params;
  return (
    <div className="px-5 py-6 md:px-8">
      <BikeAdminDetail bikeId={id} />
    </div>
  );
}
