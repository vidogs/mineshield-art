import {useState} from 'react'
import {Link} from 'react-router-dom'
import type {Post, User} from '../types'
import {formatPostDate} from '../utils/dateUtils'

type PostCardProps = {
    post: Post
    user: User | null
    onVote: (id: string, delta: number) => void
}

export function PostCard({post, user, onVote}: PostCardProps) {
    const [revealed, setRevealed] = useState(!post.nsfw)

    const handleVote = (delta: number) => {
        if (user) {
            onVote(post.id, delta)
        }
    }

    const formattedDate = formatPostDate(post.publishedAt)

    return (
        <article className="post-card">
            <div className="post-card-body">
                <header>
                    <div className="post-author">
                        <img src={post.author.avatar} alt={post.author.name} />
                        <div>
                            <strong>{post.author.name}</strong>
                            <small>{formattedDate}</small>
                        </div>
                    </div>
                    <div className="rating-controls">
                        <button type="button" onClick={() => handleVote(1)} disabled={!user}>
                            +
                        </button>
                        <span>{post.rating}</span>
                        <button type="button" onClick={() => handleVote(-1)} disabled={!user}>
                            –
                        </button>
                    </div>
                </header>
                <Link to={`/posts/${post.id}`}>
                    <h2>{post.title}</h2>
                </Link>
                <div className="post-content-wrapper">
                    <div className={`post-content ${post.nsfw && !revealed ? 'nsfw-blurred' : ''}`}>
                        <div className="post-image">
                            <img src={post.imageUrl} alt={post.title} />
                        </div>
                        <p>{post.summary}</p>
                        <div className="tag-row">
                            {post.tags.map((tag) => (
                                <span key={tag}>{tag}</span>
                            ))}
                        </div>
                        <div className="tagged-row">
                            Отмечены: {post.taggedUsers.join(', ')}
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
            </div>
        </article>
    )
}

