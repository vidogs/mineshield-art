import {FormEvent, useState} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import type {Post, User, Comment} from '../types'
import {formatCommentDate} from '../utils/dateUtils'
import {PostCard} from '../components/PostCard'

type PostPageProps = {
    posts: Post[]
    user: User | null
    onVote: (id: string, delta: number) => void
    comments: Record<string, Comment[]>
    onAddComment: (id: string, message: string) => void
}

export function PostPage({posts, user, onVote, comments, onAddComment}: PostPageProps) {
    const {postId} = useParams<{postId: string}>()
    const navigate = useNavigate()
    const post = posts.find((item) => item.id === postId)

    const [commentText, setCommentText] = useState('')

    if (!post) {
        return (
            <section className="post-detail empty-state">
                <p>Пост не найден.</p>
                <button type="button" onClick={() => navigate('/')}>
                    Вернуться на главную
                </button>
            </section>
        )
    }

    const postComments = comments[post.id] ?? []
    const canInteract = Boolean(user)

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!commentText.trim() || !user) {
            return
        }
        onAddComment(post.id, commentText.trim())
        setCommentText('')
    }

    return (
        <>
            <PostCard 
                post={post} 
                user={user} 
                onVote={onVote}
                commentCount={postComments.length}
                isDetail={true}
            />
            <div className="comments-section">
                <div className="comments-header">
                    <h3>Комментарии</h3>
                    <span>{postComments.length} обсуждение</span>
                </div>
                <form className="comment-form" onSubmit={handleSubmit}>
                    <textarea
                        value={commentText}
                        onChange={(event) => setCommentText(event.target.value)}
                        placeholder={canInteract ? 'Оставить комментарий...' : 'Войдите, чтобы оставить комментарий'}
                        disabled={!canInteract}
                    />
                    <button type="submit" disabled={!canInteract || !commentText.trim()}>
                        Опубликовать
                    </button>
                </form>
                <div className="comment-list">
                    {postComments.map((comment) => (
                        <article key={comment.id} className="comment-card">
                            <img src={comment.author.avatar} alt={comment.author.name} />
                            <div>
                                <p>
                                    <strong>{comment.author.name}</strong>
                                    <small>
                                        {formatCommentDate(comment.publishedAt)}
                                    </small>
                                </p>
                                <p>{comment.content}</p>
                            </div>
                        </article>
                    ))}
                    {!postComments.length && <p className="muted">Пока нет комментариев.</p>}
                </div>
            </div>
        </>
    )
}

