import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditGoodClient from "./EditGoodClient";

export default async function EditGoodPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const good = await prisma.good.findUnique({ where: { id: params.id } });
  if (!good) notFound();
  return <EditGoodClient good={good} />;
}
