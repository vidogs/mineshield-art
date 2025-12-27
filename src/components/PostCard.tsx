import {useState, useMemo} from 'react'
import {Link} from 'react-router-dom'
import type {Post, User} from '../types'
import {formatPostDate, formatPostDetailDate} from '../utils/dateUtils'
import {ImageModal} from './ImageModal'

type PostCardProps = {
    post: Post
    user: User | null
    onVote: (id: string, delta: number) => void
    commentCount?: number
    isDetail?: boolean
}

export function PostCard({post, user, onVote, commentCount = 0, isDetail = false}: PostCardProps) {
    const [revealed, setRevealed] = useState(!post.nsfw)
    const [modalOpen, setModalOpen] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const images = useMemo(() => 
        post.content.blocks.filter((block): block is Extract<typeof block, {type: 'image'}> => 
            block.type === 'image'
        ), 
        [post.content.blocks]
    )

    const handleVote = (delta: number) => {
        if (user) {
            onVote(post.id, delta)
        }
    }

    const handleImageClick = (event: React.MouseEvent<HTMLImageElement>, index: number) => {
        event.stopPropagation()
        const imageIndex = post.content.blocks
            .slice(0, index + 1)
            .filter(block => block.type === 'image')
            .length - 1
        setCurrentImageIndex(imageIndex)
        setModalOpen(true)
    }

    const formattedDate = isDetail ? formatPostDetailDate(post.publishedAt) : formatPostDate(post.publishedAt)

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
                    <div className="post-header-controls">
                        <div className="rating-controls">
                            <button type="button" onClick={() => handleVote(1)} disabled={!user}>
                                +
                            </button>
                            <span>{post.rating}</span>
                            <button type="button" onClick={() => handleVote(-1)} disabled={!user}>
                                –
                            </button>
                        </div>
                        {!isDetail && commentCount > 0 && (
                            <Link to={`/posts/${post.id}`} className="comment-count-link">
                                <span>💬</span>
                                <span>{commentCount}</span>
                            </Link>
                        )}
                        {isDetail && commentCount > 0 && (
                            <span className="comment-count-static">
                                <span>💬</span>
                                <span>{commentCount}</span>
                            </span>
                        )}
                    </div>
                </header>
                {isDetail ? (
                    <h1>{post.title}</h1>
                ) : (
                    <Link to={`/posts/${post.id}`}>
                        <h2>{post.title}</h2>
                    </Link>
                )}
                <div className="post-content-wrapper">
                    <div className={`post-content ${post.nsfw && !revealed ? 'nsfw-blurred' : ''}`}>
                        {post.content.blocks.map((block, index) => {
                            if (block.type === 'image') {
                                return (
                                    <div key={index} className="post-image">
                                        <img 
                                            src={block.url} 
                                            alt={block.alt || post.title}
                                            onClick={(e) => handleImageClick(e, index)}
                                            style={{cursor: 'pointer'}}
                                        />
                                    </div>
                                )
                            } else {
                                return (
                                    <p key={index}>{block.content}</p>
                                )
                            }
                        })}
                        <div className="tag-row">
                            {post.tags.map((tag) => (
                                <Link key={tag} to={`/tags/${tag}`} className="tag-link">
                                    {tag}
                                </Link>
                            ))}
                        </div>
                        <div className={`tagged-row ${isDetail ? 'highlight' : ''}`}>
                            <span className="tagged-label">{isDetail ? 'Отмечены на фото:' : 'Отмечены:'}</span>
                            {post.taggedUsers.map((userHandle, index) => (
                                <span key={userHandle}>
                                    <Link to={`/users/${userHandle.replace('@', '')}`} className="tagged-user-link">
                                        {userHandle}
                                    </Link>
                                    {index < post.taggedUsers.length - 1 && ', '}
                                </span>
                            ))}
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
            {modalOpen && images.length > 0 && (
                <ImageModal
                    images={images}
                    currentIndex={currentImageIndex}
                    onClose={() => setModalOpen(false)}
                    onNavigate={setCurrentImageIndex}
                />
            )}
        </article>
    )
}

