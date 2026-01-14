import PostDetailPage from '@/features/post/PostDetail/PostDetailPage';
import { getPostAndComment } from '@/lib/Posts';

export default async function PostDetailsPage({ params }) {
  const { postId } = await params;

  const post = await getPostAndComment(postId);

  if (!post?.success) {
    throw new Error( post.message ||'게시글 조회 실패');
  }

  return (
    <main>
      <PostDetailPage post={post.data} />
    </main>
  );
}
