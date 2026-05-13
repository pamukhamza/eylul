import PostForm from "@/components/PostForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const metadata = { title: "Yazıyı düzenle" };

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pid = Number(id);
  if (!Number.isInteger(pid) || pid <= 0) notFound();

  const post = await prisma.post.findFirst({
    where: { id: pid, deleted: false },
  });
  if (!post) notFound();

  return (
    <section>
      <h1 className="sr-only">Yazıyı düzenle</h1>
      <PostForm initial={{ id: post.id, title: post.title, content: post.content }} />
    </section>
  );
}
