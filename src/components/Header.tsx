import {useState, useRef, useEffect} from 'react'
import {Link} from 'react-router-dom'
import type {User} from '../types'

type HeaderProps = {
    user: User | null
    onLogin: () => void
    onLogout: () => void
}

export function Header({user, onLogin, onLogout}: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false)
            }
        }

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isMenuOpen])

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
                        <button type="button" className="add-post-btn" onClick={() => {}}>
                            + Добавить пост
                        </button>
                        <div className="user-menu-wrapper" ref={menuRef}>
                            <button
                                type="button"
                                className="user-preview-btn"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <div className="user-preview">
                                    <img src={user.avatar} alt={user.handle} />
                                    <div>
                                        <strong>{user.handle}</strong>
                                    </div>
                                </div>
                            </button>
                            {isMenuOpen && (
                                <div className="user-dropdown">
                                    <Link to="/" onClick={() => setIsMenuOpen(false)}>
                                        Профиль
                                    </Link>
                                    <button type="button" onClick={() => {
                                        setIsMenuOpen(false)
                                        onLogout()
                                    }}>
                                        Выйти
                                    </button>
                                </div>
                            )}
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

