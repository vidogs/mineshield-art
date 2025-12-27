import type {Post, User} from '../types'
import {PostCard} from '../components/PostCard'

type FeedPageProps = {
    posts: Post[]
    user: User | null
    onVote: (id: string, delta: number) => void
    trendingTags: string[]
}

export function FeedPage({posts, user, onVote, trendingTags}: FeedPageProps) {
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

