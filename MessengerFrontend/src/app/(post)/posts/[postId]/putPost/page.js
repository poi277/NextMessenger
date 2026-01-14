import UpdatePost from '@/features/post/UpdatePost/UpdatePost';
import { getPostOne } from '@/lib/Posts';

export default async function PutPostPage({ params }) {
  const { postId } = await params;

  const post = await getPostOne(postId);

  if (!post?.success) {
    throw new Error(post.message);
  }
  return <UpdatePost post={post.data} />;
}
