import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditVesselClient from "./EditVesselClient";

export default async function EditVesselPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const vessel = await prisma.vessel.findUnique({ where: { id: params.id } });
  if (!vessel) notFound();
  return <EditVesselClient vessel={vessel} />;
}
