export const formatPostDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
    })
}

export const formatPostDetailDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })
}

export const formatCommentDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    })
}

