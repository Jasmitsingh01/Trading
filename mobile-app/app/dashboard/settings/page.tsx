'use client'

import { useState, useEffect } from "react"
import { ChevronDown, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"

interface UserProfile {
  id: string
  fullname: string
  email: string
  phone?: string
  Address?: string
  city?: string
  state?: string
  country?: string
  pincode?: string
  isVerified: boolean
  isKYCCompleted: boolean
  kycStatus?: string
}

interface BankAccount {
  _id: string
  bankName: string
  accountHolderName: string
  accountNumber: string
  accountType: string
  ifscCode: string
  isPrimary: boolean
  isVerified: boolean
  verificationStatus: string
}

export default function Settings() {
  const router = useRouter()

  // user + form state
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [fullname, setFullname] = useState("")
  const [email, setEmail] = useState("")
  const [preferredCurrency, setPreferredCurrency] = useState("")

  // ui state
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // security toggles (pure UI – start from false)
  const [twoFactorAuth, setTwoFactorAuth] = useState(false)
  const [smsCode, setSmsCode] = useState(false)
  const [otherNotifications, setOtherNotifications] = useState(false)

  // bank state
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [loadingBanks, setLoadingBanks] = useState(false)

  // modals
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isAddBankModalOpen, setIsAddBankModalOpen] = useState(false)

  // password change
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [passwordLoading, setPasswordLoading] = useState(false)

  // add bank form
  const [newBank, setNewBank] = useState({
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    accountType: "savings",
    ifscCode: ""
  })
  const [bankLoading, setBankLoading] = useState(false)

  // fetch profile once
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await api.user.getProfile()
        if (response?.userProfile) {
          const u = response.userProfile as UserProfile
          setProfile(u)
          setFullname(u.fullname ?? "")
          setEmail(u.email ?? "")
          // if you store preferred currency on backend, read it here:
          // setPreferredCurrency(u.preferredCurrency ?? "")
        }
      } catch (err: any) {
        console.error("profile error", err)
        setError(err.message || "Failed to load profile")
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  // fetch bank accounts
  useEffect(() => {
    const loadBanks = async () => {
      try {
        setLoadingBanks(true)
        const res = await api.bank.getAccounts()
        if (res?.success && Array.isArray(res.data)) {
          setBankAccounts(res.data as BankAccount[])
        }
      } catch (err) {
        console.error("bank load error", err)
      } finally {
        setLoadingBanks(false)
      }
    }

    loadBanks()
  }, [])

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccessMessage(null)

      const trimmedName = fullname.trim()
      if (!trimmedName) {
        setError("Full name is required")
        return
      }

      await api.user.updateProfile({
        fullname: trimmedName,
        // preferredCurrency, // include when backend supports it
      })

      const res = await api.user.getProfile()
      if (res?.userProfile) {
        setProfile(res.userProfile)
        setFullname(res.userProfile.fullname ?? "")
        setEmail(res.userProfile.email ?? "")
      }

      setSuccessMessage("Profile updated successfully!")
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      console.error("update profile error", err)
      setError(err.message || "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    try {
      setPasswordError("")
      setPasswordLoading(true)

      if (!currentPassword || !newPassword || !confirmPassword) {
        setPasswordError("All fields are required")
        return
      }
      if (newPassword.length < 8) {
        setPasswordError("Password must be at least 8 characters")
        return
      }
      if (newPassword !== confirmPassword) {
        setPasswordError("New passwords do not match")
        return
      }

      const result = await api.password.changePassword(currentPassword, newPassword)
      if (!result?.success) {
        setPasswordError(result?.message || "Failed to change password")
        return
      }

      setIsPasswordModalOpen(false)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setSuccessMessage("Password changed successfully!")
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      console.error("password change error", err)
      setPasswordError(err.message || "Failed to change password")
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleAddBank = async () => {
    try {
      setBankLoading(true)

      const payload = {
        bankName: newBank.bankName.trim(),
        accountHolderName: newBank.accountHolderName.trim(),
        accountNumber: newBank.accountNumber.trim(),
        accountType: newBank.accountType,
        ifscCode: newBank.ifscCode.trim().toUpperCase()
      }

      if (!payload.bankName || !payload.accountHolderName || !payload.accountNumber || !payload.ifscCode) {
        alert("All required fields must be filled")
        return
      }
      if (payload.ifscCode.length !== 11) {
        alert("IFSC code must be 11 characters")
        return
      }

      const res = await api.bank.addAccount(payload)
      if (!res?.success) {
        alert(res?.message || "Failed to add bank account")
        return
      }

      const updated = await api.bank.getAccounts()
      if (updated?.success && Array.isArray(updated.data)) {
        setBankAccounts(updated.data as BankAccount[])
      }

      setIsAddBankModalOpen(false)
      setNewBank({
        bankName: "",
        accountHolderName: "",
        accountNumber: "",
        accountType: "savings",
        ifscCode: ""
      })
      setSuccessMessage("Bank account added successfully!")
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      console.error("add bank error", err)
      alert(err.message || "Failed to add bank account")
    } finally {
      setBankLoading(false)
    }
  }

  const handleRemoveBank = async (bankId: string) => {
    if (!confirm("Are you sure you want to remove this bank account?")) return
    try {
      await api.bank.deleteAccount(bankId)
      const updated = await api.bank.getAccounts()
      if (updated?.success && Array.isArray(updated.data)) {
        setBankAccounts(updated.data as BankAccount[])
      }
      setSuccessMessage("Bank account removed successfully!")
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      console.error("remove bank error", err)
      alert(err.message || "Failed to remove bank account")
    }
  }

  const handleSetPrimary = async (bankId: string) => {
    try {
      await api.bank.updateAccount(bankId, { isPrimary: true })
      const updated = await api.bank.getAccounts()
      if (updated?.success && Array.isArray(updated.data)) {
        setBankAccounts(updated.data as BankAccount[])
      }
      setSuccessMessage("Primary bank account updated!")
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      console.error("set primary error", err)
      alert(err.message || "Failed to update primary bank")
    }
  }

  const kycBadge = (() => {
    if (!profile) return null
    const status = profile.kycStatus || (profile.isKYCCompleted ? "approved" : "pending")
    const cfg: Record<string, { color: string; label: string }> = {
      pending: { color: "bg-amber-500/20 text-amber-400", label: "Pending" },
      submitted: { color: "bg-blue-500/20 text-blue-400", label: "Under Review" },
      approved: { color: "bg-emerald-500/20 text-emerald-400", label: "Verified" },
      rejected: { color: "bg-red-500/20 text-red-400", label: "Rejected" }
    }
    const c = cfg[status] ?? cfg.pending
    return (
      <span className={`px-2 py-1 ${c.color} rounded text-xs font-medium`}>
        {c.label}
      </span>
    )
  })()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 flex items-center justify-center">
        <div className="flex items-center gap-2 text-white">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading settings...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 text-white">
      <div className="max-w-[800px] mx-auto p-6">
        {/* header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <div className="flex items-center gap-2">
              <button
                className="px-4 py-1.5 text-sm font-medium text-slate-400 hover:text-white transition"
                onClick={() => router.back()}
              >
                Cancel
              </button>
              <Button
                className="bg-emerald-500 text-white hover:bg-emerald-500/90"
                onClick={handleSaveProfile}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : "Save"}
              </Button>
            </div>
          </div>
          <p className="text-sm text-slate-400">Quickly update your basic preferences</p>

          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-500/50 rounded flex items-center gap-2 text-emerald-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              {successMessage}
            </div>
          )}
        </div>

        {/* profile */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold mb-1 text-white">Profile</h2>
              <p className="text-xs text-slate-400">Basic details for your account</p>
            </div>
            <button
              className="text-sm text-emerald-400 hover:underline"
              onClick={() => router.push("/dashboard/profile")}
            >
              Details
            </button>
          </div>

          <div className="mb-4">
            <label className="text-xs text-slate-400 font-medium block mb-2">Full name</label>
            <Input
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder=""
              className="bg-white/5 border-white/10 text-white focus-visible:ring-emerald-500/50"
            />
          </div>

          <div className="mb-4">
            <label className="text-xs text-slate-400 font-medium block mb-2">Email</label>
            <Input
              type="email"
              value={email}
              onChange={() => { }}
              placeholder=""
              className="bg-white/5 border-white/10 text-white focus-visible:ring-emerald-500/50"
              disabled
            />
            <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
          </div>

          {profile?.phone && (
            <div className="mb-4">
              <label className="text-xs text-slate-400 font-medium block mb-2">Phone Number</label>
              <Input
                type="text"
                value={profile.phone}
                disabled
                className="bg-white/5 border-white/10 text-slate-500 cursor-not-allowed"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="text-xs text-slate-400 font-medium block mb-2">Preferred currency</label>
            <div className="relative">
              <select
                value={preferredCurrency}
                onChange={(e) => setPreferredCurrency(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white appearance-none focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
              >
                <option value="">Select currency</option>
                <option value="USD" className="bg-slate-900">USD</option>
                <option value="EUR" className="bg-slate-900">EUR</option>
                <option value="GBP" className="bg-slate-900">GBP</option>
                <option value="INR" className="bg-slate-900">INR</option>
                <option value="JPY" className="bg-slate-900">JPY</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* security */}
        <div className="mb-8">
          <div className="mb-4">
            <h2 className="text-base font-semibold mb-1 text-white">Security & alerts</h2>
            <p className="text-xs text-slate-400">Keep your account safe</p>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-slate-400 font-medium">Password</label>
              <button
                className="text-sm text-emerald-400 hover:underline"
                onClick={() => setIsPasswordModalOpen(true)}
              >
                Change
              </button>
            </div>
            <input
              type="password"
              value="••••••••••"
              disabled
              className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-slate-500 cursor-not-allowed"
            />
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-slate-400 font-medium">KYC Verification</label>
              {!profile?.isKYCCompleted && (
                <button
                  className="text-sm text-emerald-400 hover:underline"
                  onClick={() => router.push("/dashboard/verification")}
                >
                  Start Verification
                </button>
              )}
            </div>
            <div className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Status:</span>
                {kycBadge}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {profile?.isKYCCompleted
                  ? "Your account is fully verified"
                  : "Complete your KYC verification to unlock full trading features"}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <div>
                <div className="text-sm font-medium mb-1 text-white">Two-factor authentication</div>
                <div className="text-xs text-slate-400">Extra code when you log in</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={twoFactorAuth}
                  onChange={(e) => setTwoFactorAuth(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <div>
                <div className="text-sm font-medium mb-1 text-white">SMS code</div>
                <div className="text-xs text-slate-400">Extra code to authenticate log in</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsCode}
                  onChange={(e) => setSmsCode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <div className="text-sm font-medium mb-1 text-white">Other notifications</div>
                <div className="text-xs text-slate-400">Latest important updates</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={otherNotifications}
                  onChange={(e) => setOtherNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            You can: Adjust additional settings from the list settings on desktop
          </p>
        </div>

        {/* banks */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold mb-1 text-white">Bank accounts</h2>
              <p className="text-xs text-slate-400">Manage the accounts you use to deposit and withdraw</p>
            </div>
            <button
              className="text-sm text-emerald-400 hover:underline"
              onClick={() => router.push("/dashboard/wallet")}
            >
              Payments
            </button>
          </div>

          {loadingBanks ? (
            <div className="flex items-center justify-center py-8 text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Loading bank accounts...
            </div>
          ) : (
            <>
              {bankAccounts.length > 0 ? (
                bankAccounts.map((bank) => (
                  <div key={bank._id} className="bg-white/5 border border-white/10 rounded-lg p-4 mb-3">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-white">{bank.bankName}</span>
                          {bank.isPrimary && (
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-xs font-medium">
                              Primary
                            </span>
                          )}
                          {bank.isVerified && (
                            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                              Verified
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400">
                          {bank.accountType} • ****{bank.accountNumber.slice(-4)} • {bank.accountHolderName}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!bank.isPrimary && (
                          <button
                            className="text-sm text-emerald-400 hover:underline"
                            onClick={() => handleSetPrimary(bank._id)}
                          >
                            Set Primary
                          </button>
                        )}
                        <button
                          className="text-sm text-red-400 hover:underline"
                          onClick={() => handleRemoveBank(bank._id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <p className="text-sm">No bank accounts added yet</p>
                </div>
              )}

              <div
                className="border-2 border-dashed border-white/10 rounded-lg p-4 hover:border-white/20 transition cursor-pointer"
                onClick={() => setIsAddBankModalOpen(true)}
              >
                <div className="text-sm font-medium text-slate-300 mb-1">Add new bank</div>
                <div className="text-xs text-slate-500">
                  Account holder names, IFSC, account number
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-4">
                You can connect up to 5 bank accounts. Only verified accounts can be used for withdrawals.
              </p>
            </>
          )}
        </div>

        <div className="flex items-center justify-end pt-6 border-t border-white/10">
          <Button
            className="bg-emerald-500 text-white hover:bg-emerald-500/90"
            onClick={() => router.push("/dashboard/wallet")}
          >
            Manage bank accounts
          </Button>
        </div>
      </div>

      {/* password modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false)
          setPasswordError("")
          setCurrentPassword("")
          setNewPassword("")
          setConfirmPassword("")
        }}
        title="Change Password"
      >
        <div className="space-y-4">
          {passwordError && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded text-red-400 text-sm">
              {passwordError}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300">Current Password</label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder=""
              className="bg-slate-900 border-white/10 text-white"
              disabled={passwordLoading}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300">New Password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder=""
              className="bg-slate-900 border-white/10 text-white"
              disabled={passwordLoading}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300">Confirm New Password</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder=""
              className="bg-slate-900 border-white/10 text-white"
              disabled={passwordLoading}
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="ghost"
              onClick={() => {
                setIsPasswordModalOpen(false)
                setPasswordError("")
                setCurrentPassword("")
                setNewPassword("")
                setConfirmPassword("")
              }}
              disabled={passwordLoading}
            >
              Cancel
            </Button>
            <Button
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
              onClick={handleChangePassword}
              disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword}
            >
              {passwordLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : "Update Password"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* add bank modal */}
      <Modal
        isOpen={isAddBankModalOpen}
        onClose={() => {
          setIsAddBankModalOpen(false)
          setNewBank({
            bankName: "",
            accountHolderName: "",
            accountNumber: "",
            accountType: "savings",
            ifscCode: ""
          })
        }}
        title="Add Bank Account"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300">Bank Name *</label>
            <Input
              type="text"
              value={newBank.bankName}
              onChange={(e) => setNewBank({ ...newBank, bankName: e.target.value })}
              placeholder=""
              className="bg-slate-900 border-white/10 text-white"
              disabled={bankLoading}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300">Account Holder Name *</label>
            <Input
              type="text"
              value={newBank.accountHolderName}
              onChange={(e) => setNewBank({ ...newBank, accountHolderName: e.target.value })}
              placeholder=""
              className="bg-slate-900 border-white/10 text-white"
              disabled={bankLoading}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300">Account Number *</label>
            <Input
              type="text"
              value={newBank.accountNumber}
              onChange={(e) =>
                setNewBank({ ...newBank, accountNumber: e.target.value.replace(/\D/g, "") })
              }
              placeholder=""
              className="bg-slate-900 border-white/10 text-white"
              disabled={bankLoading}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300">Account Type</label>
            <select
              value={newBank.accountType}
              onChange={(e) => setNewBank({ ...newBank, accountType: e.target.value })}
              className="w-full bg-slate-900 border border-white/10 rounded px-3 py-2 text-sm text-white"
              disabled={bankLoading}
            >
              <option value="savings">Savings</option>
              <option value="current">Current</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300">IFSC Code *</label>
            <Input
              type="text"
              value={newBank.ifscCode}
              onChange={(e) =>
                setNewBank({ ...newBank, ifscCode: e.target.value.toUpperCase() })
              }
              placeholder=""
              maxLength={11}
              className="bg-slate-900 border-white/10 text-white"
              disabled={bankLoading}
            />
            <p className="text-xs text-slate-500">11 characters (e.g., HDFC0001234)</p>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="ghost"
              onClick={() => {
                setIsAddBankModalOpen(false)
                setNewBank({
                  bankName: "",
                  accountHolderName: "",
                  accountNumber: "",
                  accountType: "savings",
                  ifscCode: ""
                })
              }}
              disabled={bankLoading}
            >
              Cancel
            </Button>
            <Button
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
              onClick={handleAddBank}
              disabled={
                bankLoading ||
                !newBank.bankName ||
                !newBank.accountHolderName ||
                !newBank.accountNumber ||
                !newBank.ifscCode
              }
            >
              {bankLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : "Add Bank Account"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
