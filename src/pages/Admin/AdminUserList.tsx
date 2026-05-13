import React, { useEffect, useState, useCallback } from 'react'
import {
  Users,
  Search,
  Shield,
  ShieldOff,
  Mail,
  Phone,
  Clock,
  Trash2,
  CheckCircle2,
  XCircle,
  UserPlus,
  Edit2,
  X,
  Eye,
  EyeOff
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { userApi } from '../../apis/userApi'
import type { UserResponseDto } from '../../types/user'
import { useToast } from '../../contexts/ToastContext'

const AdminUserList: React.FC = () => {
  const [users, setUsers] = useState<UserResponseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user'>('all')
  const { showToast } = useToast()

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [editingUser, setEditingUser] = useState<UserResponseDto | null>(null)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone_number: '',
    role: 0,
    is_active: true
  })

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const data = await userApi.getUsers()
      setUsers(data)
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error(error)
      const errorMsg = error.response?.data?.message || error.message
      showToast(`Failed to fetch users: ${errorMsg}`, 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleOpenModal = (user: UserResponseDto | null = null) => {
    setShowPassword(false)
    if (user) {
      setEditingUser(user)
      setFormData({
        username: user.username,
        email: user.email,
        password: '', // Don't show password on edit
        phone_number: user.phone_number || '',
        role: user.role,
        is_active: user.is_active
      })
    } else {
      setEditingUser(null)
      setFormData({
        username: '',
        email: '',
        password: '',
        phone_number: '',
        role: 0,
        is_active: true
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingUser) {
        // Update
        const updateData = { ...formData }
        if (!updateData.password) delete (updateData as any).password
        await userApi.adminUpdate(editingUser.user_id, updateData)
        showToast('User updated successfully')
      } else {
        // Create
        await userApi.adminCreate(formData)
        showToast('User created successfully')
      }
      setIsModalOpen(false)
      fetchUsers()
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message
      showToast(`Error: ${errorMsg}`, 'error')
    }
  }

  const handleUpdateStatus = async (id: number, isActive: boolean) => {
    try {
      await userApi.adminUpdate(id, { is_active: isActive })
      showToast(`User ${isActive ? 'activated' : 'deactivated'} successfully`, 'success')
      fetchUsers()
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error(error)
      showToast('Failed to update user status', 'error')
    }
  }

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('Are you sure you want to PERMANENTLY delete this user?')) return
    try {
      await userApi.adminDelete(id)
      showToast('User deleted permanently', 'success')
      fetchUsers()
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error(error)
      showToast('Failed to delete user', 'error')
    }
  }

  const filteredUsers = React.useMemo(() => {
    return users.filter(user => {
      const matchesSearch =
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesRole =
        filterRole === 'all' ||
        (filterRole === 'admin' ? user.role === 1 : user.role !== 1)

      return matchesSearch && matchesRole
    })
  }, [users, searchTerm, filterRole])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-oswald uppercase tracking-wider text-white flex items-center gap-3">
            <Users className="text-t1-red" size={32} />
            User Management
          </h1>
          <p className="text-gray-400 mt-1 font-oswald text-xs uppercase tracking-[0.2em]">Manage your community and staff</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-t1-red hover:bg-red-700 text-white px-6 py-3 rounded-xl font-oswald font-bold uppercase tracking-widest text-xs transition-colors shadow-lg shadow-t1-red/20"
        >
          <UserPlus size={18} />
          Add New User
        </button>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 h-12 flex items-center bg-white/[0.03] border border-white/5 rounded-xl px-4 gap-3 group focus-within:border-t1-red/50 transition-all">
          <Search className="text-gray-500 group-focus-within:text-t1-red transition-colors shrink-0" size={18} />
          <input
            autoComplete="off"
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent text-white focus:outline-none text-sm placeholder:text-gray-600"
          />
        </div>
        <div className="flex bg-white/[0.03] border border-white/5 rounded-xl p-1">
          {(['all', 'admin', 'user'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`flex-1 py-2 px-4 rounded-lg font-oswald text-[10px] uppercase tracking-[0.2em] transition-all ${
                filterRole === role
                  ? 'bg-t1-red text-white shadow-lg shadow-t1-red/20'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-5 font-oswald text-[10px] uppercase tracking-[0.3em] text-gray-500">User</th>
                <th className="px-6 py-5 font-oswald text-[10px] uppercase tracking-[0.3em] text-gray-500">Contact</th>
                <th className="px-6 py-5 font-oswald text-[10px] uppercase tracking-[0.3em] text-gray-500">Role</th>
                <th className="px-6 py-5 font-oswald text-[10px] uppercase tracking-[0.3em] text-gray-500">Status</th>
                <th className="px-6 py-5 font-oswald text-[10px] uppercase tracking-[0.3em] text-gray-500">Joined</th>
                <th className="px-6 py-5 font-oswald text-[10px] uppercase tracking-[0.3em] text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody key={filterRole} className="divide-y divide-white/5">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-8 bg-white/[0.01]"></td>
                  </tr>
                ))
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.user_id}
                    className="group hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-t1-red/20 to-t1-red/5 border border-white/10 flex items-center justify-center overflow-hidden cursor-pointer"
                        >
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-t1-red font-oswald text-lg">{user.username[0].toUpperCase()}</span>
                          )}
                        </motion.div>
                        <div>
                          <div className="text-white font-oswald text-sm uppercase tracking-wider group-hover:text-t1-red transition-colors">{user.username}</div>
                          <div className="text-gray-500 text-[10px] font-oswald uppercase tracking-widest mt-0.5">ID: #{user.user_id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-gray-400 text-xs">
                          <Mail size={12} className="text-t1-red/50" />
                          {user.email}
                        </div>
                        {user.phone_number && (
                          <div className="flex items-center gap-2 text-gray-500 text-[10px]">
                            <Phone size={10} />
                            {user.phone_number}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <motion.div
                        whileHover={{ y: -2 }}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
                          user.role === 1
                            ? 'bg-t1-red/10 border-t1-red/20 text-t1-red'
                            : 'bg-white/5 border-white/10 text-gray-400'
                        }`}
                      >
                        {user.role === 1 ? <Shield size={12} /> : <ShieldOff size={12} />}
                        <span className="font-oswald text-[10px] uppercase tracking-widest">
                          {user.role === 1 ? 'Admin' : 'Customer'}
                        </span>
                      </motion.div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'}`}
                        />
                        <span className={`font-oswald text-[10px] uppercase tracking-widest ${user.is_active ? 'text-green-500' : 'text-red-500'}`}>
                          {user.is_active ? 'Active' : 'Banned'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-gray-500 font-oswald text-[10px] uppercase tracking-widest">
                        <Clock size={12} />
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleOpenModal(user)}
                          className="p-2 bg-white/5 border border-white/10 text-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition-all"
                          title="Edit User"
                        >
                          <Edit2 size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleUpdateStatus(user.user_id, !user.is_active)}
                          title={user.is_active ? 'Ban User' : 'Unban User'}
                          className={`p-2 rounded-lg border transition-all ${
                            user.is_active
                              ? 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white'
                              : 'bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500 hover:text-white'
                          }`}
                        >
                          {user.is_active ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1, backgroundColor: '#e2012d' }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteUser(user.user_id)}
                          title="Delete Permanently"
                          className="p-2 bg-white/5 border border-white/10 text-gray-400 rounded-lg hover:border-t1-red hover:text-white transition-all"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-oswald uppercase tracking-[0.2em]">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#0f0f0f] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
                <h2 className="text-xl font-oswald uppercase tracking-widest text-white flex items-center gap-3">
                  {editingUser ? <Edit2 className="text-t1-red" size={20} /> : <UserPlus className="text-t1-red" size={20} />}
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-xl text-gray-500 hover:text-white transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-oswald uppercase tracking-[0.2em] text-gray-500 ml-1">Username</label>
                      <input
                        required
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-t1-red/50 focus:outline-none transition-all font-oswald text-sm"
                        placeholder="e.g. faker_god"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-oswald uppercase tracking-[0.2em] text-gray-500 ml-1">Email</label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-t1-red/50 focus:outline-none transition-all font-oswald text-sm"
                        placeholder="faker@t1.gg"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-oswald uppercase tracking-[0.2em] text-gray-500 ml-1">
                      {editingUser ? 'New Password (Leave blank to keep current)' : 'Password'}
                    </label>
                    <div className="relative group">
                      <input
                        required={!editingUser}
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white focus:border-t1-red/50 focus:outline-none transition-all font-oswald text-sm"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-oswald uppercase tracking-[0.2em] text-gray-500 ml-1">Phone Number</label>
                    <input
                      type="text"
                      value={formData.phone_number}
                      onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-t1-red/50 focus:outline-none transition-all font-oswald text-sm"
                      placeholder="+84 123 456 789"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-oswald uppercase tracking-[0.2em] text-gray-500 ml-1">Role</label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: Number(e.target.value) })}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-t1-red/50 focus:outline-none transition-all font-oswald text-sm appearance-none"
                      >
                        <option value={0} className="bg-[#0f0f0f]">Customer</option>
                        <option value={1} className="bg-[#0f0f0f]">Administrator</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-oswald uppercase tracking-[0.2em] text-gray-500 ml-1">Account Status</label>
                      <select
                        value={formData.is_active ? 'true' : 'false'}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'true' })}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-t1-red/50 focus:outline-none transition-all font-oswald text-sm appearance-none"
                      >
                        <option value="true" className="bg-[#0f0f0f]">Active</option>
                        <option value="false" className="bg-[#0f0f0f]">Banned / Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 border border-white/10 rounded-xl font-oswald text-xs uppercase tracking-widest text-gray-400 hover:bg-white/5 hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-t1-red hover:bg-red-700 text-white rounded-xl font-oswald text-xs uppercase tracking-widest font-bold transition-all shadow-lg shadow-t1-red/20"
                  >
                    {editingUser ? 'Save Changes' : 'Create User'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminUserList
