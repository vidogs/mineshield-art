import {useEffect} from 'react'
import type {ContentBlock} from '../types'

type ImageModalProps = {
    images: ContentBlock[]
    currentIndex: number
    onClose: () => void
    onNavigate: (index: number) => void
}

export function ImageModal({images, currentIndex, onClose, onNavigate}: ImageModalProps) {
    const currentImage = images[currentIndex]

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose()
            } else if (event.key === 'ArrowLeft') {
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1
                onNavigate(prevIndex)
            } else if (event.key === 'ArrowRight') {
                const nextIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0
                onNavigate(nextIndex)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        document.body.style.overflow = 'hidden'

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = ''
        }
    }, [currentIndex, images.length, onClose, onNavigate])

    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        onClose()
    }

    const handlePrev = () => {
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1
        onNavigate(prevIndex)
    }

    const handleNext = () => {
        const nextIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0
        onNavigate(nextIndex)
    }

    if (!currentImage || currentImage.type !== 'image') {
        return null
    }

    return (
        <div className="image-modal-backdrop" onClick={handleBackdropClick}>
            <div className="image-modal-container">
                <button className="image-modal-close" onClick={onClose} aria-label="Закрыть">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                {images.length > 1 && (
                    <button 
                        className="image-modal-arrow image-modal-arrow-left" 
                        onClick={handlePrev}
                        aria-label="Предыдущее изображение"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                )}
                <div className="image-modal-content">
                    <img 
                        src={currentImage.url} 
                        alt={currentImage.alt || `Изображение ${currentIndex + 1}`}
                    />
                </div>
                {images.length > 1 && (
                    <button 
                        className="image-modal-arrow image-modal-arrow-right" 
                        onClick={handleNext}
                        aria-label="Следующее изображение"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                )}
                {images.length > 1 && (
                    <div className="image-modal-dots">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                className={`image-modal-dot ${index === currentIndex ? 'active' : ''}`}
                                onClick={() => onNavigate(index)}
                                aria-label={`Перейти к изображению ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

