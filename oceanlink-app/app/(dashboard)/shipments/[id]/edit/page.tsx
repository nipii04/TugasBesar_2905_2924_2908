import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditShipmentClient from "./EditShipmentClient";

export default async function EditShipmentPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const transaction = await prisma.transaction.findUnique({
    where: { id: params.id },
    include: { vessel: true },
  });

  if (!transaction) notFound();

  return <EditShipmentClient transaction={transaction} />;
}
