// Same localStorage keys as the original static prototype,
// so existing drafts and requests carry over.
const REQUESTS = 'uc_sarf_requests'
const DRAFT = 'uc_sarf_draft'

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export const loadRequests = () => read(REQUESTS, [])
export const saveRequest = (request) => write(REQUESTS, [...loadRequests(), request])
export const loadDraft = () => read(DRAFT, null)
export const saveDraft = (data) => write(DRAFT, data)
export const clearDraft = () => {
  try { localStorage.removeItem(DRAFT) } catch { /* ignore */ }
}
