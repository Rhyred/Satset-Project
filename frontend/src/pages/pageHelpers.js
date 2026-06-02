export function toArray(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.items)) return payload.items
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.content)) return payload.content
  return []
}

export function toRecord(payload) {
  if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
    return payload
  }

  return {}
}

export function pickValue(record, keys, fallback = '-') {
  for (const key of keys) {
    const value = record?.[key]
    if (value !== undefined && value !== null && value !== '') {
      return value
    }
  }

  return fallback
}

export function humanizeKey(key) {
  return String(key)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}
export function toArray(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.items)) return payload.items
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.content)) return payload.content
  return []
}

export function toObject(payload) {
  if (payload && typeof payload === 'object' && !Array.isArray(payload)) return payload
  return {}
}

export function pickValue(record, keys, fallback = '-') {
  for (const key of keys) {
    const value = record?.[key]
    if (value !== undefined && value !== null && value !== '') {
      return value
    }
  }

  return fallback
}

export function humanizeKey(key = '') {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/^./, (character) => character.toUpperCase())
}
