import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {useMemo, useState} from 'react'
import type {User, Comment} from './types'
import {initialPosts, initialComments, mockViewer} from './data/mockData'
import {calculateTrendingTags} from './utils/postUtils'
import {Header} from './components/Header'
import {FeedPage} from './pages/FeedPage'
import {PostPage} from './pages/PostPage'

function App() {
    const [posts, setPosts] = useState(initialPosts)
    const [comments, setComments] = useState(initialComments)
    const [user, setUser] = useState<User | null>(null)

    const trendingTags = useMemo(() => calculateTrendingTags(posts), [posts])

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

export default App
