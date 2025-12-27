import {Link} from 'react-router-dom'
import type {User} from '../types'

type HeaderProps = {
    user: User | null
    onLogin: () => void
    onLogout: () => void
}

export function Header({user, onLogin, onLogout}: HeaderProps) {
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

