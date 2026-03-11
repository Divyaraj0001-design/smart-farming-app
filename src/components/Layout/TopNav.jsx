import { Bell, Search, Settings, Menu, LayoutDashboard, Sprout, Bug, Droplets, CloudRain, TrendingUp, ClipboardList, Shield } from 'lucide-react'
import { useLocation, Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

export default function TopNav({ toggleSidebar }) {
    const location = useLocation()
    const [user, setUser] = useState({ name: 'User' })
    const [searchQuery, setSearchQuery] = useState('')
    const [showSearch, setShowSearch] = useState(false)
    const searchRef = useRef(null)

    useEffect(() => {
        const storedUser = localStorage.getItem('agromind_user')
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
    }, [])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearch(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const pageTitles = {
        '/app/dashboard': { title: 'Dashboard', subtitle: `Good morning, ${user.name.split(' ')[0]} 👋` },
        '/app/crop-advisor': { title: 'AI Crop Advisor', subtitle: 'Get personalized AI recommendations for your fields' },
        '/app/disease-detection': { title: 'Disease Detection', subtitle: 'Upload plant photos for instant AI diagnosis' },
        '/app/irrigation': { title: 'Irrigation Planner', subtitle: 'Smart water management and scheduling' },
        '/app/weather': { title: 'Weather Intelligence', subtitle: 'Hyperlocal forecasts and farming alerts' },
        '/app/market': { title: 'Market Insights', subtitle: 'Track crop prices and trends' },
        '/app/records': { title: 'Farm Records', subtitle: 'Manage your farm data and logs' },
        '/app/admin': { title: 'Admin Panel', subtitle: 'System overview and user management' }
    }

    const current = pageTitles[location.pathname] || { title: 'AgroMind', subtitle: 'Smart Farming Platform' }

    const searchItems = [
        { title: 'Dashboard', titleDesc: 'Overview', path: '/app/dashboard', icon: LayoutDashboard },
        { title: 'Crop Advisor', titleDesc: 'AI recommendations', path: '/app/crop-advisor', icon: Sprout },
        { title: 'Disease Detection', titleDesc: 'Plant scanning', path: '/app/disease-detection', icon: Bug },
        { title: 'Irrigation Planner', titleDesc: 'Water management', path: '/app/irrigation', icon: Droplets },
        { title: 'Weather Intelligence', titleDesc: 'Local forecasts', path: '/app/weather', icon: CloudRain },
        { title: 'Market Insights', titleDesc: 'Crop prices', path: '/app/market', icon: TrendingUp },
        { title: 'Farm Records', titleDesc: 'Data logs', path: '/app/records', icon: ClipboardList },
        { title: 'Admin Panel', titleDesc: 'System configuration', path: '/app/admin', icon: Shield }
    ]

    const filteredSearch = searchItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.titleDesc.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <header className="topnav" style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(18, 24, 18, 0.7)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <button 
                    onClick={toggleSidebar}
                    className="mobile-only"
                    style={{
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)',
                    alignItems: 'center', justifyContent: 'center',
                    width: 40, height: 40, borderRadius: 12, color: '#fff', cursor: 'pointer'
                }}>
                    <Menu size={20} />
                </button>
                <div className="mobile-hidden">
                    <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>
                        {current.title}
                    </h1>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: '2px 0 0 0' }}>
                        {current.subtitle}
                    </p>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                {/* Search Bar */}
                <div ref={searchRef} style={{ position: 'relative' }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                        padding: '10px 16px', borderRadius: 12, width: '100%', maxWidth: 280
                    }}>
                        <Search size={18} color="rgba(255,255,255,0.4)" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowSearch(true);
                            }}
                            onFocus={() => setShowSearch(true)}
                            style={{
                                background: 'transparent', border: 'none', outline: 'none',
                                color: '#fff', fontSize: 14, width: '100%'
                            }}
                        />
                    </div>
                    {/* Search Dropdown */}
                    {showSearch && searchQuery.length > 0 && (
                        <div className="search-results">
                            {filteredSearch.length > 0 ? (
                                filteredSearch.map((item, idx) => (
                                    <Link key={idx} to={item.path} className="search-result-item" onClick={() => { setShowSearch(false); setSearchQuery(''); }}>
                                        <item.icon size={18} color="var(--accent-primary)" />
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{item.title}</div>
                                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.titleDesc}</div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div style={{ padding: '16px', fontSize: 14, color: 'var(--text-muted)', textAlign: 'center' }}>
                                    No results found for "{searchQuery}"
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                    <button className="mobile-hidden" style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'rgba(255,255,255,0.7)', cursor: 'pointer', position: 'relative'
                    }}>
                        <Bell size={20} />
                        <span style={{
                            position: 'absolute', top: 10, right: 10,
                            width: 8, height: 8, background: '#ef4444', borderRadius: '50%',
                            border: '2px solid rgba(18,24,18,1)'
                        }} />
                    </button>
                    <button className="mobile-hidden" style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'rgba(255,255,255,0.7)', cursor: 'pointer'
                    }}>
                        <Settings size={20} />
                    </button>

                    <button style={{
                        height: 44, padding: '0 16px 0 6px', borderRadius: 22,
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex', alignItems: 'center', gap: 10,
                        color: 'rgba(255,255,255,0.8)', cursor: 'pointer'
                    }}>
                        <div style={{
                            width: 32, height: 32, borderRadius: '50%', background: '#22c55e',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#000', fontWeight: 700, fontSize: 13
                        }}>
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="mobile-hidden" style={{ fontSize: 14, fontWeight: 500 }}>{user.name.split(' ')[0]} </span>
                    </button>
                </div>
            </div>
        </header>
    )
}
