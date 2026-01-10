import HomePageForm from "@/features/post/homepage/HomePageForm";
import { getPostsPage } from '@/lib/Posts';

export const revalidate = 0;

export default async function Page() {
  const res = await getPostsPage({ pageParam: 1 });

  if (!res?.success) {
    throw new Error(res.message);
  }

  return <HomePageForm initialPosts={res.data.posts} />;
}
