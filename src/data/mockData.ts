import type {User, Post, Comment} from '../types'

export const mockAuthor: User = {
    id: 'auth-1',
    name: 'Айрис',
    handle: '@irisvibes',
    avatar:
        'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=256&q=80',
}

export const mockViewer: User = {
    id: 'viewer',
    name: 'Вен',
    handle: '@vencraft',
    avatar:
        'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=256&q=80',
}

export const initialPosts: Post[] = [
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

export const initialComments: Record<string, Comment[]> = {
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

