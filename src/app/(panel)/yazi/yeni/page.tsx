import PostForm from "@/components/PostForm";

export const metadata = { title: "Yeni yazı" };

export default function NewPostPage() {
  return (
    <section>
      <h1 className="sr-only">Yeni yazı</h1>
      <PostForm />
    </section>
  );
}
