import './App.css'
import {BrowserRouter, Routes, Route, Link, useParams, useNavigate} from 'react-router-dom'
import {FormEvent, useMemo, useState} from 'react'

type User = {
    id: string
    name: string
    avatar: string
    handle: string
}

type Post = {
    id: string
    title: string
    imageUrl: string
    summary: string
    author: User
    publishedAt: string
    tags: string[]
    taggedUsers: string[]
    rating: number
    nsfw: boolean
}

type Comment = {
    id: string
    author: User
    content: string
    publishedAt: string
}

const mockAuthor: User = {
    id: 'auth-1',
    name: 'Айрис',
    handle: '@irisvibes',
    avatar:
        'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=256&q=80',
}

const mockViewer: User = {
    id: 'viewer',
    name: 'Вен',
    handle: '@vencraft',
    avatar:
        'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=256&q=80',
}

const initialPosts: Post[] = [
    {
        id: 'post-1',
        title: 'Лунная охота',
        summary: 'Городские огни и заброшенная станция метро в оттенках магии.',
        author: mockAuthor,
        imageUrl:
            'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
        publishedAt: '2025-12-20T20:45:00Z',
        tags: ['digital', 'night', 'city'],
        taggedUsers: ['@nomad', '@pixelMuse'],
        rating: 128,
        nsfw: false,
    },
    {
        id: 'post-2',
        title: 'Шепот волн',
        summary: 'Сказочные отражения в воде. Отметила друзей за идея во время лайва.',
        author: mockAuthor,
        imageUrl:
            'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
        publishedAt: '2025-12-22T17:10:00Z',
        tags: ['sea', 'composition', 'live'],
        taggedUsers: ['@oceanic', '@wildwind'],
        rating: 214,
        nsfw: false,
    },
    {
        id: 'post-3',
        title: 'Сквозь красную дымку',
        summary: 'Экспериментальный рассказ о градиентах и тайнах ночного города.',
        author: mockAuthor,
        imageUrl:
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
        publishedAt: '2025-12-25T09:05:00Z',
        tags: ['synthwave', 'nsfw', 'experimental'],
        taggedUsers: ['@neonBloom'],
        rating: 98,
        nsfw: true,
    },
]

const initialComments: Record<string, Comment[]> = {
    'post-1': [
        {
            id: 'c1',
            author: {
                id: 'viewer',
                name: 'Вен',
                handle: '@vencraft',
                avatar:
                    'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=256&q=80',
            },
            content: 'Красивая работа, особенно композиция с линией горизонта.',
            publishedAt: '2025-12-20T21:12:00Z',
        },
    ],
    'post-2': [
        {
            id: 'c2',
            author: {
                id: 'user-2',
                name: 'Дарья',
                handle: '@dariadot',
                avatar:
                    'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=256&q=80',
            },
            content: 'Текстура воды просто гипнотизирует.',
            publishedAt: '2025-12-22T18:38:00Z',
        },
    ],
}

function App() {
    const [posts, setPosts] = useState(initialPosts)
    const [comments, setComments] = useState(initialComments)
    const [user, setUser] = useState<User | null>(null)

    const trendingTags = useMemo(() => {
        const count: Record<string, number> = {}
        posts.forEach((post) => {
            post.tags.forEach((tag) => {
                count[tag] = (count[tag] ?? 0) + 1
            })
        })
        return Object.entries(count)
            .sort(([, a], [, b]) => b - a)
            .map(([tag, value]) => `${tag} · ${value}`)
    }, [posts])

    const handleVote = (postId: string, delta: number) => {
        setPosts((prev) =>
            prev.map((post) => (post.id === postId ? {...post, rating: post.rating + delta} : post)),
        )
    }

    const handleAddComment = (postId: string, message: string) => {
        const currentUser = user
        if (!currentUser) {
            return
        }
        setComments((prev) => {
            const next = prev[postId] ? [...prev[postId]] : []
            next.unshift({
                id: `${postId}-${Date.now()}`,
                author: currentUser,
                content: message,
                publishedAt: new Date().toISOString(),
            })
            return {
                ...prev,
                [postId]: next,
            }
        })
    }

    const handleLogin = () => setUser(mockViewer)
    const handleLogout = () => setUser(null)

    return (
        <BrowserRouter>
            <div className="app-shell">
                <Header user={user} onLogin={handleLogin} onLogout={handleLogout} />
                <main className="app-content">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <FeedPage
                                    posts={posts}
                                    user={user}
                                    onVote={handleVote}
                                    trendingTags={trendingTags}
                                />
                            }
                        />
                        <Route
                            path="/posts/:postId"
                            element={
                                <PostPage
                                    posts={posts}
                                    user={user}
                                    onVote={handleVote}
                                    comments={comments}
                                    onAddComment={handleAddComment}
                                />
                            }
                        />
                        <Route
                            path="*"
                            element={
                                <FeedPage
                                    posts={posts}
                                    user={user}
                                    onVote={handleVote}
                                    trendingTags={trendingTags}
                                />
                            }
                        />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    )
}

type HeaderProps = {
    user: User | null
    onLogin: () => void
    onLogout: () => void
}

function Header({user, onLogin, onLogout}: HeaderProps) {
    return (
        <header className="app-header">
            <div className="logo-row">
                <Link to="/" className="logo">
                    <span className="logo-mark">M</span>
                    <div>
                        <strong>Mineshield</strong>
                        <small>Арт-комьюнити</small>
                    </div>
                </Link>
                <nav>
                    <Link to="/">Главная</Link>
                    <Link to="/">Популярное</Link>
                </nav>
            </div>
            <div className="user-row">
                {user ? (
                    <>
                        <div className="user-preview">
                            <img src={user.avatar} alt={user.name} />
                            <div>
                                <strong>{user.name}</strong>
                                <small>{user.handle}</small>
                            </div>
                        </div>
                        <div className="header-actions">
                            <Link to="/">Профиль</Link>
                            <button type="button" onClick={onLogout}>
                                Выйти
                            </button>
                        </div>
                    </>
                ) : (
                    <button type="button" className="twitch-btn" onClick={onLogin}>
                        Войти через Twitch
                    </button>
                )}
            </div>
        </header>
    )
}

type FeedPageProps = {
    posts: Post[]
    user: User | null
    onVote: (id: string, delta: number) => void
    trendingTags: string[]
}

function FeedPage({posts, user, onVote, trendingTags}: FeedPageProps) {
    return (
        <div className="feed-grid">
            <section className="feed-list">
                {posts.map((post) => (
                    <PostCard key={post.id} post={post} user={user} onVote={onVote} />
                ))}
            </section>
            <aside className="feed-sidebar">
                <div className="sidebar-card">
                    <h3>Что в тренде</h3>
                    <ul>
                        {trendingTags.map((tag) => (
                            <li key={tag}>{tag}</li>
                        ))}
                    </ul>
                </div>
                <div className="sidebar-card">
                    <h3>Скоро</h3>
                    <p>Ждем авторов на вечернюю сессию арт-ширы — напиши нам в Discord</p>
                </div>
            </aside>
        </div>
    )
}

type PostCardProps = {
    post: Post
    user: User | null
    onVote: (id: string, delta: number) => void
}

function PostCard({post, user, onVote}: PostCardProps) {
    const [revealed, setRevealed] = useState(!post.nsfw)

    const handleVote = (delta: number) => {
        if (user) {
            onVote(post.id, delta)
        }
    }

    const formattedDate = new Date(post.publishedAt).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
    })

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

type PostPageProps = {
    posts: Post[]
    user: User | null
    onVote: (id: string, delta: number) => void
    comments: Record<string, Comment[]>
    onAddComment: (id: string, message: string) => void
}

function PostPage({posts, user, onVote, comments, onAddComment}: PostPageProps) {
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
                            {new Date(post.publishedAt).toLocaleDateString('ru-RU', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })}
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
                                            {new Date(comment.publishedAt).toLocaleString('ru-RU', {
                                                day: 'numeric',
                                                month: 'short',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
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

export default App
