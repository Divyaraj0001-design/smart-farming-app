import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from './Sidebar'
import TopNav from './TopNav'
import Chatbot from '../chatbot/Chatbot'

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', position: 'relative' }}>
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    onClick={() => setSidebarOpen(false)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40 }}
                />
            )}
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            <div className="main-content" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <TopNav toggleSidebar={() => setSidebarOpen(true)} />
                <main className="layout-main-padding" style={{ flex: 1, padding: '24px 32px' }}>
                    <div style={{ maxWidth: 1400, margin: '0 auto', width: '100%', paddingBottom: 40 }}>
                        <Outlet />
                    </div>
                </main>
            </div>
            <Chatbot />
        </div>
    )
}
