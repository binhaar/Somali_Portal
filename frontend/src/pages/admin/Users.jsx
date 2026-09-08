import { useEffect, useState } from "react";
import api from "../../services/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState("");

  // =========================================================
  // FETCH USERS
  // =========================================================

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      let response;

      // Search users
      if (search.trim()) {
        response = await api.get(
          `/admin/users/search?q=${encodeURIComponent(
            search.trim()
          )}&page=${page}&limit=10`
        );
      }

      // Get all users
      else {
        response = await api.get(
          `/admin/users?page=${page}&limit=10`
        );
      }

      console.log("USERS RESPONSE:", response.data);

      const data = response.data;

      // =====================================================
      // SUPPORT DIFFERENT RESPONSE STRUCTURES
      // =====================================================

      let usersData = [];

      if (Array.isArray(data)) {
        usersData = data;
      } else if (Array.isArray(data.users)) {
        usersData = data.users;
      } else if (Array.isArray(data.data)) {
        usersData = data.data;
      } else if (Array.isArray(data.data?.users)) {
        usersData = data.data.users;
      }

      setUsers(usersData);

      // =====================================================
      // PAGINATION
      // =====================================================

      const paginationData =
        data.pagination ||
        data.data?.pagination ||
        {};

      setPagination({
        page: paginationData.page || page,

        pages:
          paginationData.pages ||
          paginationData.totalPages ||
          1,

        total:
          paginationData.total ||
          paginationData.totalUsers ||
          usersData.length,
      });
    } catch (err) {
      console.error("Fetch users error:", err);

      setUsers([]);

      setError(
        err.response?.data?.message ||
          "Unable to load users. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD USERS
  // =========================================================

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  // =========================================================
  // SEARCH
  // =========================================================

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // =========================================================
  // TOGGLE USER STATUS
  // =========================================================

  const handleToggleStatus = async (user) => {
    if (!user?._id) return;

    try {
      setActionLoading(user._id);

      await api.patch(
        `/admin/users/${user._id}/toggle`
      );

      await fetchUsers();
    } catch (err) {
      console.error("Toggle user status error:", err);

      alert(
        err.response?.data?.message ||
          "Unable to change user status."
      );
    } finally {
      setActionLoading("");
    }
  };

  // =========================================================
  // DELETE USER
  // =========================================================

  const handleDeleteUser = async (user) => {
    if (!user?._id) return;

    if (user.role === "ADMIN") {
      alert("Admin users cannot be deleted.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${
        user.firstName || user.username
      }?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(user._id);

      await api.delete(
        `/admin/users/${user._id}`
      );

      if (selectedUser?._id === user._id) {
        setSelectedUser(null);
      }

      await fetchUsers();
    } catch (err) {
      console.error("Delete user error:", err);

      alert(
        err.response?.data?.message ||
          "Unable to delete user."
      );
    } finally {
      setActionLoading("");
    }
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "—";

    try {
      return new Date(date).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      );
    } catch {
      return "—";
    }
  };

  // =========================================================
  // GET INITIALS
  // =========================================================

  const getInitials = (user) => {
    const first =
      user?.firstName?.charAt(0) || "";

    const last =
      user?.lastName?.charAt(0) || "";

    return (
      `${first}${last}`.toUpperCase() ||
      user?.username?.charAt(0)?.toUpperCase() ||
      "U"
    );
  };

  // =========================================================
  // ROLE BADGE
  // =========================================================

  const getRoleBadge = (role) => {
    if (role === "ADMIN") {
      return (
        <span className="inline-flex items-center rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 ring-1 ring-purple-200">
          Admin
        </span>
      );
    }

    if (role === "VISITOR") {
      return (
        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
          Visitor
        </span>
      );
    }

    return (
      <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
        Citizen
      </span>
    );
  };

  // =========================================================
  // STATUS BADGE
  // =========================================================

  const getStatusBadge = (isActive) => {
    if (isActive) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Active
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-200">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        Inactive
      </span>
    );
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading && users.length === 0) {
    return (
      <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
            <div className="mt-3 h-4 w-72 animate-pulse rounded bg-slate-200" />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-12 animate-pulse rounded-xl bg-slate-100" />

            <div className="mt-6 space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-4a4 4 0 100-8 4 4 0 000 8zm5 2a3 3 0 100-6"
                  />
                </svg>
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Users
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Manage citizens, visitors and administrators
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={fetchUsers}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              className={`h-4 w-4 ${
                loading ? "animate-spin" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>

            Refresh
          </button>
        </div>

        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            <svg
              className="mt-0.5 h-5 w-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4a2 2 0 00-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
              />
            </svg>

            <div className="flex-1">
              <p className="font-semibold">
                Unable to load users
              </p>

              <p className="mt-1 text-sm">
                {error}
              </p>
            </div>

            <button
              onClick={fetchUsers}
              className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200"
            >
              Retry
            </button>
          </div>
        )}

        {/* ================================================= */}
        {/* USERS CARD */}
        {/* ================================================= */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* SEARCH BAR */}

          <div className="border-b border-slate-200 p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div className="relative w-full lg:max-w-md">
                <svg
                  className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35m2.35-5.65a8 8 0 11-16 0 8 8 0 0116 0z"
                  />
                </svg>

                <input
                  type="text"
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search users..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                />
              </div>

              <div className="text-sm text-slate-500">
                <span className="font-semibold text-slate-900">
                  {pagination.total}
                </span>{" "}
                users found
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* TABLE */}
          {/* ================================================= */}

          {users.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80">
                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                        User
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                        Account
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                        Contact
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                        Role
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {users.map((user) => (
                      <tr
                        key={user._id}
                        className="transition hover:bg-slate-50/70"
                      >
                        {/* USER */}

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
                              {getInitials(user)}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-semibold text-slate-900">
                                {user.firstName}{" "}
                                {user.lastName}
                              </p>

                              <p className="truncate text-xs text-slate-500">
                                @{user.username}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* ACCOUNT */}

                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-slate-800">
                            {user.accountType || "—"}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Joined{" "}
                            {formatDate(
                              user.createdAt
                            )}
                          </p>
                        </td>

                        {/* CONTACT */}

                        <td className="px-5 py-4">
                          <p className="max-w-[220px] truncate text-sm text-slate-700">
                            {user.email || "—"}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {user.phone || "No phone"}
                          </p>
                        </td>

                        {/* ROLE */}

                        <td className="px-5 py-4">
                          {getRoleBadge(user.role)}
                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">
                          {getStatusBadge(
                            user.isActive
                          )}
                        </td>

                        {/* ACTIONS */}

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">

                            {/* VIEW */}

                            <button
                              onClick={() =>
                                setSelectedUser(user)
                              }
                              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                            >
                              View
                            </button>

                            {/* TOGGLE */}

                            <button
                              onClick={() =>
                                handleToggleStatus(
                                  user
                                )
                              }
                              disabled={
                                actionLoading ===
                                user._id
                              }
                              className={`rounded-lg px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                user.isActive
                                  ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              }`}
                            >
                              {actionLoading ===
                              user._id
                                ? "..."
                                : user.isActive
                                ? "Deactivate"
                                : "Activate"}
                            </button>

                            {/* DELETE */}

                            {user.role !== "ADMIN" && (
                              <button
                                onClick={() =>
                                  handleDeleteUser(
                                    user
                                  )
                                }
                                disabled={
                                  actionLoading ===
                                  user._id
                                }
                                className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ================================================= */}
              {/* PAGINATION */}
              {/* ================================================= */}

              <div className="flex flex-col gap-4 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  Page{" "}
                  <span className="font-semibold text-slate-900">
                    {pagination.page}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-900">
                    {pagination.pages}
                  </span>
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setPage((prev) =>
                        Math.max(prev - 1, 1)
                      )
                    }
                    disabled={page <= 1}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <button
                    onClick={() =>
                      setPage((prev) =>
                        Math.min(
                          prev + 1,
                          pagination.pages
                        )
                      )
                    }
                    disabled={
                      page >= pagination.pages
                    }
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* ================================================= */
            /* EMPTY STATE */
            /* ================================================= */

            <div className="flex min-h-[420px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100">
                <svg
                  className="h-10 w-10 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-4a4 4 0 100-8 4 4 0 000 8zm5 2a3 3 0 100-6"
                  />
                </svg>
              </div>

              <h3 className="mt-6 text-lg font-bold text-slate-900">
                {search
                  ? "No users found"
                  : "No users available"}
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {search
                  ? "Try changing your search."
                  : "There are currently no users in the system."}
              </p>

              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ===================================================== */}
      {/* USER DETAILS MODAL */}
      {/* ===================================================== */}

      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onClick={() =>
            setSelectedUser(null)
          }
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  User Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Complete account information
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedUser(null)
                }
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* MODAL BODY */}

            <div className="p-6">

              {/* PROFILE */}

              <div className="flex flex-col items-center rounded-2xl bg-slate-50 p-6 text-center sm:flex-row sm:text-left">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-2xl font-bold text-white">
                  {getInitials(
                    selectedUser
                  )}
                </div>

                <div className="mt-4 sm:ml-5 sm:mt-0">
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedUser.firstName}{" "}
                    {selectedUser.lastName}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    @{selectedUser.username}
                  </p>

                  <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                    {getRoleBadge(
                      selectedUser.role
                    )}

                    {getStatusBadge(
                      selectedUser.isActive
                    )}
                  </div>
                </div>
              </div>

              {/* INFORMATION GRID */}

              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                <InfoItem
                  label="First Name"
                  value={
                    selectedUser.firstName
                  }
                />

                <InfoItem
                  label="Last Name"
                  value={
                    selectedUser.lastName
                  }
                />

                <InfoItem
                  label="Other Names"
                  value={
                    selectedUser.otherNames
                  }
                />

                <InfoItem
                  label="Username"
                  value={
                    selectedUser.username
                  }
                />

                <InfoItem
                  label="Email"
                  value={
                    selectedUser.email
                  }
                />

                <InfoItem
                  label="Phone"
                  value={
                    selectedUser.phone
                  }
                />

                <InfoItem
                  label="Account Type"
                  value={
                    selectedUser.accountType
                  }
                />

                <InfoItem
                  label="Gender"
                  value={
                    selectedUser.gender
                  }
                />

                <InfoItem
                  label="Date of Birth"
                  value={formatDate(
                    selectedUser.dateOfBirth
                  )}
                />

                <InfoItem
                  label="Place of Birth"
                  value={
                    selectedUser.placeOfBirth
                  }
                />

                <InfoItem
                  label="Nationality"
                  value={
                    selectedUser.nationality
                  }
                />

                <InfoItem
                  label="National ID"
                  value={
                    selectedUser.nationalIdNumber
                  }
                />

                <InfoItem
                  label="Passport Number"
                  value={
                    selectedUser.passportNumber
                  }
                />

                <InfoItem
                  label="Verified"
                  value={
                    selectedUser.isVerified
                      ? "Yes"
                      : "No"
                  }
                />

                <InfoItem
                  label="Created At"
                  value={formatDate(
                    selectedUser.createdAt
                  )}
                />

                <InfoItem
                  label="Updated At"
                  value={formatDate(
                    selectedUser.updatedAt
                  )}
                />
              </div>
            </div>

            {/* MODAL FOOTER */}

            <div className="flex justify-end border-t border-slate-200 px-6 py-4">
              <button
                onClick={() =>
                  setSelectedUser(null)
                }
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===========================================================
// INFO ITEM
// ===========================================================

const InfoItem = ({ label, value }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1.5 break-words text-sm font-semibold text-slate-800">
        {value || "—"}
      </p>
    </div>
  );
};

export default Users;