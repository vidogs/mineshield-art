import type {Post} from '../types'

export const calculateTrendingTags = (posts: Post[]): string[] => {
    const count: Record<string, number> = {}
    posts.forEach((post) => {
        post.tags.forEach((tag) => {
            count[tag] = (count[tag] ?? 0) + 1
        })
    })
    return Object.entries(count)
        .sort(([, a], [, b]) => b - a)
        .map(([tag, value]) => `${tag} · ${value}`)
}

