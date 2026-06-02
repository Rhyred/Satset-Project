import { Edit2, Plus, RefreshCcw, UserPlus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '../components/ui/Button.jsx'
import { Card } from '../components/ui/Card.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { LoadingScreen } from '../components/ui/LoadingScreen.jsx'
import { SectionHeader } from '../components/ui/SectionHeader.jsx'
import { StatusBadge } from '../components/ui/StatusBadge.jsx'
import { userService } from '../services/userService.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useToast } from '../hooks/useToast.js'
import { getErrorMessage } from '../services/api.js'
import { toArray } from './pageHelpers.js'

const initialForm = {
  nik: '',
  namaLengkap: '',
  username: '',
  email: '',
  password: '',
  noTelepon: '',
  alamat: '',
  role: 'USER',
}

export function UsersPage() {
  useDocumentTitle('Manajemen Pengguna')
  const { addToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [users, setUsers] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(initialForm)

  useEffect(() => {
    let active = true

    const loadUsers = async () => {
      try {
        const response = await userService.getUsers()
        if (active) setUsers(toArray(response))
      } catch (error) {
        if (active) {
          addToast({ tone: 'error', title: 'Gagal memuat pengguna', description: getErrorMessage(error) })
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadUsers()

    return () => {
      active = false
    }
  }, [addToast])

  const refreshUsers = async () => {
    try {
      const response = await userService.getUsers()
      setUsers(toArray(response))
    } catch (error) {
      addToast({ tone: 'error', title: 'Gagal memuat ulang pengguna', description: getErrorMessage(error) })
    }
  }

  const startEdit = (user) => {
    setEditingId(user.id)
    setForm({
      nik: user.nik || '',
      namaLengkap: user.namaLengkap || '',
      username: user.username || '',
      email: user.email || '',
      password: '',
      noTelepon: user.noTelepon || '',
      alamat: user.alamat || '',
      role: user.role || 'USER',
    })
  }

  const resetForm = () => {
    setEditingId(null)
    setForm(initialForm)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.namaLengkap || !form.email) {
      addToast({ tone: 'error', title: 'Data belum lengkap', description: 'Nama lengkap dan email wajib diisi.' })
      return
    }

    setSaving(true)

    try {
      const payload = editingId ? { ...form } : form

      if (!editingId && !payload.password) {
        addToast({ tone: 'error', title: 'Password wajib diisi' })
        return
      }

      if (editingId) {
        await userService.updateUser(editingId, payload)
        addToast({ tone: 'success', title: 'Pengguna diperbarui' })
      } else {
        await userService.createUser(payload)
        addToast({ tone: 'success', title: 'Pengguna ditambahkan' })
      }

      resetForm()
      await refreshUsers()
    } catch (error) {
      addToast({ tone: 'error', title: 'Gagal menyimpan pengguna', description: getErrorMessage(error) })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <LoadingScreen label="Memuat pengguna..." />
  }

  return (
    <div className="page-section">
      <SectionHeader
        eyebrow="Manajemen pengguna"
        title="Kelola akun warga"
        description="Tambah akun baru, perbarui profil, dan pantau role pengguna."
        actions={
          <Button variant="secondary" onClick={refreshUsers}>
            <RefreshCcw className="h-4 w-4" />
            Muat ulang
          </Button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300">
              {editingId ? <Edit2 className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
                {editingId ? 'Edit pengguna' : 'Tambah pengguna'}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {editingId ? `Memperbarui data pengguna #${editingId}` : 'Buat akun baru untuk petugas atau warga.'}
              </p>
            </div>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label">NIK</label>
                <input className="field-input" value={form.nik} onChange={(event) => setForm((current) => ({ ...current, nik: event.target.value }))} />
              </div>
              <div>
                <label className="field-label">Nama lengkap</label>
                <input className="field-input" value={form.namaLengkap} onChange={(event) => setForm((current) => ({ ...current, namaLengkap: event.target.value }))} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label">Username</label>
                <input className="field-input" value={form.username} onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))} />
              </div>
              <div>
                <label className="field-label">Email</label>
                <input type="email" className="field-input" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label">Password</label>
                <input type="password" className="field-input" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} />
              </div>
              <div>
                <label className="field-label">Role</label>
                <select className="field-input" value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}>
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label">No. Telepon</label>
                <input className="field-input" value={form.noTelepon} onChange={(event) => setForm((current) => ({ ...current, noTelepon: event.target.value }))} />
              </div>
              <div>
                <label className="field-label">Alamat</label>
                <input className="field-input" value={form.alamat} onChange={(event) => setForm((current) => ({ ...current, alamat: event.target.value }))} />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={saving}>
                <Plus className="h-4 w-4" />
                {saving ? 'Menyimpan...' : editingId ? 'Simpan perubahan' : 'Tambah user'}
              </Button>
              {editingId ? (
                <Button type="button" variant="secondary" onClick={resetForm}>
                  Batal edit
                </Button>
              ) : null}
            </div>
          </form>
        </Card>

        <Card className="p-6">
          <SectionHeader eyebrow="Daftar pengguna" title="Akun yang terdaftar" description="Klik edit untuk memuat data pengguna ke form." />

          <div className="mt-6 space-y-3">
            {users.length ? (
              users.map((user) => (
                <div key={user.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">{user.namaLengkap}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                      <p className="mt-1 text-xs text-slate-400">{user.username || '-'}</p>
                    </div>
                    <StatusBadge status={user.role} />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button type="button" variant="secondary" size="sm" onClick={() => startEdit(user)}>
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState title="Belum ada pengguna" description="Data pengguna akan muncul di panel ini." />
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}