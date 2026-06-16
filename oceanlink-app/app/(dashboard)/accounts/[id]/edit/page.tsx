import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditUserClient from "./EditUserClient";

export default async function EditUserPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await prisma.user.findUnique({ where: { id: params.id } });
  if (!user) notFound();
  return <EditUserClient user={user} />;
}
