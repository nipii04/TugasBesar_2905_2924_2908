import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditPortClient from "./EditPortClient";

export default async function EditPortPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const port = await prisma.port.findUnique({ where: { id: params.id } });
  if (!port) notFound();
  return <EditPortClient port={port} />;
}
