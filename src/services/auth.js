const KEY = 'volksskatt_user'

export function login(email, password) {
  // Mock: accept any non-empty credentials
  return new Promise((resolve) => {
    setTimeout(() => {
      if (email && password) {
        const user = { email, fullName: 'Platform Admin', role: 'admin' }
        localStorage.setItem(KEY, JSON.stringify(user))
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
