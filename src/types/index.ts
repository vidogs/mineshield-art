export type User = {
    id: string
    name: string
    avatar: string
    handle: string
}

export type ContentBlock = 
    | { type: 'image'; url: string; alt?: string }
    | { type: 'text'; content: string }

export type Post = {
    id: string
    title: string
    content: {
        blocks: ContentBlock[]
    }
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

