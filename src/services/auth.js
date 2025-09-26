const KEY = 'volksskatt_user'

export function login(email, password, role = 'admin') {
  // Mock: accept any non-empty credentials
  return new Promise((resolve) => {
    setTimeout(() => {
      if (email && password) {
        // 1) Try users_db first so created employees can log in with username/email + password
        try {
          const raw = localStorage.getItem('users_db')
          const users = raw ? JSON.parse(raw) : []
          if (Array.isArray(users) && users.length) {
            const needle = String(email).toLowerCase()
            const match = users.find(u => (
              (String(u.email || '').toLowerCase() === needle || String(u.username || '').toLowerCase() === needle)
              && String(u.password || '') === String(password)
            ))
            if (match) {
              const sessionUser = {
                email: match.email,
                username: match.username,
                fullName: match.fullName || match.username || match.email,
                role: match.role || 'employee',
              }
              localStorage.setItem(KEY, JSON.stringify(sessionUser))
              resolve(true)
              return
            }
          }
        } catch {}

        // 2) Fallback to mock for backward compatibility
        const roleName = role === 'admin' ? 'Platform Admin' : role === 'hr' ? 'HR User' : 'Employee'
        const mockUser = { email, fullName: roleName, role }
        localStorage.setItem(KEY, JSON.stringify(mockUser))
        resolve(true)
      } else {
        resolve(false)
      }
    }, 400)
  })
}

export function logout() {
  localStorage.removeItem(KEY)
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem(KEY))
}

export function getUser() {
  const raw = localStorage.getItem(KEY)
  try {
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
