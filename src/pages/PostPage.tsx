import {FormEvent, useState} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import type {Post, User, Comment} from '../types'
import {formatPostDetailDate, formatCommentDate} from '../utils/dateUtils'

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
    const [revealed, setRevealed] = useState(!post?.nsfw)

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

    const handleVote = (delta: number) => {
        onVote(post.id, delta)
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!commentText.trim() || !user) {
            return
        }
        onAddComment(post.id, commentText.trim())
        setCommentText('')
    }

    return (
        <section className="post-detail">
            <div className="post-detail-body">
                <h1>{post.title}</h1>
                <header className="post-detail-header">
                    <div>
                        <div className="post-detail-author">
                            <img src={post.author.avatar} alt={post.author.name} />
                            <span>{post.author.name}</span>
                        </div>
                        <p className="post-detail-date">
                            {formatPostDetailDate(post.publishedAt)}
                        </p>
                    </div>
                    <div className="rating-controls">
                        <button type="button" onClick={() => handleVote(1)} disabled={!canInteract}>
                            +
                        </button>
                        <span>{post.rating}</span>
                        <button type="button" onClick={() => handleVote(-1)} disabled={!canInteract}>
                            –
                        </button>
                    </div>
                </header>
                <div className="post-detail-content-wrapper">
                    <div className={`post-detail-content ${post.nsfw && !revealed ? 'nsfw-blurred' : ''}`}>
                        <div className="post-detail-media">
                            <img src={post.imageUrl} alt={post.title} />
                        </div>
                        <div className="post-detail-tags">
                            {post.tags.map((tag) => (
                                <span key={tag}>{tag}</span>
                            ))}
                        </div>
                        <p className="post-detail-summary">{post.summary}</p>
                        <div className="tagged-row highlight">
                            Отмечены на фото: {post.taggedUsers.join(', ')}
                        </div>
                    </div>
                    {post.nsfw && !revealed && (
                        <div className="nsfw-reveal-overlay">
                            <span>Может содержать NSFW</span>
                            <button type="button" onClick={() => setRevealed(true)}>
                                Показать содержимое
                            </button>
                        </div>
                    )}
                </div>
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
            </div>
        </section>
    )
}

