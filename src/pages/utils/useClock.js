import { useCallback, useMemo, useState } from 'react'
import { useToast } from '../../components/Toast'

function nowParts() {
  const d = new Date()
  const date = d.toLocaleDateString('en-GB')
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return { date, time }
}

function computeHours(inTime, outTime, lunchStart, lunchEnd) {
  const toDate = (t) => {
    if (!t) return null
    const [h, m] = String(t).split(':').map(Number)
    const d = new Date()
    d.setHours(h || 0, m || 0, 0, 0)
    return d
  }
  const start = toDate(inTime)
  const end = toDate(outTime)
  if (!start || !end) return ''
  const ms = end - start
  let effective = ms
  const ls = toDate(lunchStart)
  const le = toDate(lunchEnd)
  if (ls && le) {
    effective -= (le - ls)
  }
  const hours = Math.max(0, effective) / (1000 * 60 * 60)
  return hours.toFixed(2)
}

function loadKey(key) {
  try {
    const v = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

function saveKey(key, rows) {
  localStorage.setItem(key, JSON.stringify(rows))
}

export function useClock({ storageKey, defaultEmp }) {
  const { show } = useToast()
  const [rows, setRows] = useState(() => loadKey(storageKey))

  const today = new Date().toLocaleDateString('en-GB')
  const todayEntry = useMemo(() => rows.find((r) => r.date === today && r.empId === defaultEmp?.empId), [rows, today, defaultEmp])
  const status = todayEntry?.status || 'Logged Out'

  const persist = useCallback((nextRows, notifyMsg, type = 'success') => {
    setRows(nextRows)
    saveKey(storageKey, nextRows)
    if (notifyMsg) show(notifyMsg, type)
  }, [show, storageKey])

  const clockIn = useCallback(() => {
    const { date, time } = nowParts()
    if (todayEntry && todayEntry.status !== 'Logged Out') {
      show('Already clocked in today', 'error')
      return
    }
    const entry = {
      id: Date.now().toString(36),
      empId: defaultEmp?.empId,
      empName: defaultEmp?.empName,
      empRole: defaultEmp?.empRole,
      date,
      in: time,
      lunchStart: '',
      lunchEnd: '',
      out: '',
      hours: '',
      status: 'Active',
    }
    const next = [entry, ...rows]
    persist(next, 'Clocked in')
  }, [rows, persist, defaultEmp, todayEntry])

  const startLunch = useCallback(() => {
    if (!todayEntry || todayEntry.status !== 'Active') {
      show('You must be Active to start lunch', 'error')
      return
    }
    const { time } = nowParts()
    const updated = { ...todayEntry, lunchStart: todayEntry.lunchStart || time, status: 'On Lunch' }
    const next = rows.map((r) => r.id === todayEntry.id ? updated : r)
    persist(next, 'Lunch started')
  }, [rows, persist, todayEntry, show])

  const endLunch = useCallback(() => {
    if (!todayEntry || todayEntry.status !== 'On Lunch') {
      show('You must be On Lunch to end lunch', 'error')
      return
    }
    const { time } = nowParts()
    const updated = { ...todayEntry, lunchEnd: todayEntry.lunchEnd || time, status: 'Active' }
    const next = rows.map((r) => r.id === todayEntry.id ? updated : r)
    persist(next, 'Lunch ended')
  }, [rows, persist, todayEntry, show])

  const clockOut = useCallback(() => {
    if (!todayEntry || (todayEntry.status !== 'Active' && todayEntry.status !== 'On Lunch')) {
      show('You must be Active/On Lunch to clock out', 'error')
      return
    }
    const { time } = nowParts()
    const hours = computeHours(todayEntry.in, time, todayEntry.lunchStart, todayEntry.lunchEnd)
    const updated = { ...todayEntry, out: todayEntry.out || time, hours, status: 'Logged Out' }
    const next = rows.map((r) => r.id === todayEntry.id ? updated : r)
    persist(next, 'Clocked out')
  }, [rows, persist, todayEntry, show])

  const exportCsv = useCallback(() => {
    if (!rows.length) return
    const headers = ['EmpId,EmpName,Role,Date,Clock In,Lunch Start,Lunch End,Clock Out,Hours,Status']
    const csvRows = rows.map((r) => [r.empId || '', r.empName || '', r.empRole || '', r.date, r.in || '-', r.lunchStart || '-', r.lunchEnd || '-', r.out || '-', r.hours || '-', r.status || '-'].join(','))
    const csv = [...headers, ...csvRows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${storageKey}.csv`
    a.click()
    show('Exported CSV', 'success')
  }, [rows, show, storageKey])

  return {
    rows,
    status,
    todayEntry,
    actions: {
      clockIn,
      startLunch,
      endLunch,
      clockOut,
      exportCsv,
    }
  }
}
