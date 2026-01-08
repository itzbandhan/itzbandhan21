import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'

export default function AdminPage() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check current session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="spinner"></div>
            </div>
        )
    }

    return user ? (
        <AdminDashboard user={user} onLogout={() => setUser(null)} />
    ) : (
        <AdminLogin onLogin={setUser} />
    )
}
