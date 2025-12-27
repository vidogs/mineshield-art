export type User = {
    id: string
    name: string
    avatar: string
    handle: string
}

export type Post = {
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

export type Comment = {
    id: string
    author: User
    content: string
    publishedAt: string
}

