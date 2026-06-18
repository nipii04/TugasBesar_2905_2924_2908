import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditRouteClient from "./EditRouteClient";

export default async function EditRoutePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const route = await prisma.route.findUnique({
    where: { id }
  });

  if (!route) {
    notFound();
  }

  return <EditRouteClient route={route} />;
}
