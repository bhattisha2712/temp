"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ConfirmModal from "@/components/ConfirmModal";
import PasswordConfirmModal from "@/components/PasswordConfirmModal";

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
}

function RoleControl({ user, onUpdate }: { user: User; onUpdate: (userId: string, newRole: string) => void }) {
  const [updating, setUpdating] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingRole, setPendingRole] = useState<string>("");
  const { data: session } = useSession();
  
  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    
    // If demoting an admin, show confirmation modal
    if (user.role === "admin" && newRole === "user") {
      setPendingRole(newRole);
      setShowConfirmModal(true);
      // Reset select to current role
      e.target.value = user.role;
      return;
    }
    
    // For other role changes, proceed directly
    await updateRole(newRole);
  };
  
  const updateRole = async (newRole: string) => {
    setUpdating(true);
    
    try {
      const response = await fetch("/api/admin/users/role", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, newRole }),
      });
      
      if (response.ok) {
        onUpdate(user._id, newRole);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to update role");
      }
    } catch (error) {
      console.error("Failed to update role:", error);
      alert("Failed to update role");
    } finally {
      setUpdating(false);
    }
  };
  
  const handleConfirmDemotion = async () => {
    setShowConfirmModal(false);
    await updateRole(pendingRole);
  };
  
  return (
    <>
      <div>
        <select
          value={user.role}
          onChange={handleChange}
          disabled={updating}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        {user._id === session?.user.id && user.role === "admin" && (
          <span className="text-sm text-gray-500">You cannot demote yourself</span>
        )}
      </div>
      
      {showConfirmModal && (
        <ConfirmModal
          title="Demote Administrator"
          message={`Are you sure you want to remove ${user.name}'s administrator privileges? They will lose access to user management, audit logs, and other administrative functions.`}
          confirmText="Remove Admin Rights"
          cancelText="Cancel"
          confirmButtonColor="bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"
          loading={updating}
          onConfirm={handleConfirmDemotion}
          onCancel={() => !updating && setShowConfirmModal(false)}
        />
      )}
    </>
  );
}

function DeleteButton({ user, onDelete }: { user: User; onDelete: (userId: string) => void }) {
  const [deleting, setDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { data: session } = useSession();
  
  const handleInitialClick = () => {
    // For admin users, require password confirmation
    if (user.role === "admin") {
      setShowPasswordModal(true);
    } else {
      setShowConfirmModal(true);
    }
  };

  const handlePasswordConfirm = async (password: string) => {
    // In a real app, you would verify the password here
    // For now, we'll just proceed with the deletion
    setShowPasswordModal(false);
    await performDelete();
  };

  const handleDelete = async () => {
    setShowConfirmModal(false);
    await performDelete();
  };

  const performDelete = async () => {
    setDeleting(true);
    
    try {
      const response = await fetch("/api/admin/users/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id }),
      });
      
      if (response.ok) {
        onDelete(user._id);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to delete user");
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };
  
  return (
    <>
      <button
        onClick={handleInitialClick}
        disabled={deleting}
        className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {deleting ? (
          <>
            <div className="w-4 h-4 border-2 border-red-700 border-t-transparent rounded-full animate-spin mr-2"></div>
            Deleting...
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </>
        )}
      </button>
      
      {/* Regular confirmation modal for non-admin users */}
      {showConfirmModal && (
        <ConfirmModal
          title="Delete User Account"
          message={`Are you sure you want to permanently delete ${user.name}'s account? This action cannot be undone and will remove all of their data from the system.`}
          confirmText="Delete User"
          cancelText="Cancel"
          confirmButtonColor="bg-red-600 hover:bg-red-700 focus:ring-red-500"
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => !deleting && setShowConfirmModal(false)}
        />
      )}

      {/* Password confirmation modal for admin users */}
      {showPasswordModal && (
        <PasswordConfirmModal
          title="Delete Administrator Account"
          message={`You are about to delete ${user.name}'s administrator account. This is a high-privilege action that requires password confirmation.`}
          confirmText="Delete Admin"
          cancelText="Cancel"
          loading={deleting}
          onConfirm={handlePasswordConfirm}
          onCancel={() => !deleting && setShowPasswordModal(false)}
        />
      )}
    </>
  );
}

export default function AdminUserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setUsers(data.users))
      .catch(() => setError("Access denied or failed to load users."))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (userId: string) => {
    setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
  };

  const handleRoleUpdate = (userId: string, newRole: string) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">User Management</h1>
              <p className="text-gray-600">Loading users...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600 mt-2">Manage user accounts and permissions</p>
            </div>
            <div className="flex gap-3">
              <a
                href="/admin/audit"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Audit Logs
              </a>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {users.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500">There are no users in the system yet.</p>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">All Users</h2>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                    {users.length} user{users.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {user.name.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role === 'admin' ? (
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                            ) : (
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            )}
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <RoleControl user={user} onUpdate={handleRoleUpdate} />
                            <DeleteButton user={user} onDelete={handleDelete} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
