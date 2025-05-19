import React, { useState } from "react";
import {
  Trophy,
  BarChart3,
  ChevronDown,
  ChevronUp,
  RefreshCcw,
  PlusCircle,
  Trash2,
  PencilLine,
  Users,
} from "lucide-react";
import {
  useGetMLMStatsQuery,
  useGetAllTiersQuery,
  useAddTierMutation,
  useUpdateTierMutation,
  useDeleteTierMutation,
  useRecalculateUserTierMutation,
} from "../../../redux/slices/mlmApiSlice";
import LoadingSkeleton from "../../../components/preloader/LoadingSkeleton";
import ErrorMessage from "../../../components/common/ErrorMessage";
import TierFormModal from "../../../components/dashboard/admin/TierFormModal";
import SEO from "../../../components/SEO";

export default function MLMSettings() {
  const { data: stats, isLoading, isError } = useGetMLMStatsQuery();
  const {
    data: tiers,
    isLoading: tiersLoading,
    isError: tiersError,
  } = useGetAllTiersQuery();

  const [addTier] = useAddTierMutation();
  const [updateTier] = useUpdateTierMutation();
  const [deleteTier] = useDeleteTierMutation();
  const [recalcUserTier, { isLoading: recalcLoading }] =
    useRecalculateUserTierMutation();

  const [expandedTier, setExpandedTier] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState(null);

  const toggleTierDetails = (id) =>
    setExpandedTier((prev) => (prev === id ? null : id));

  const openCreateModal = () => {
    setEditingTier(null);
    setModalOpen(true);
  };

  const openEditModal = (tier) => {
    setEditingTier(tier);
    setModalOpen(true);
  };

  const handleSaveTier = async (values) => {
    if (editingTier) {
      await updateTier({ id: editingTier._id, ...values });
    } else {
      await addTier(values);
    }
    setModalOpen(false);
  };

  const handleDeleteTier = (id) => {
    if (window.confirm("Delete this tier?")) {
      deleteTier(id);
    }
  };

  if (isLoading || tiersLoading) return <LoadingSkeleton type="page" />;
  if (isError) return <ErrorMessage error={isError.data?.message} />;
  if (tiersError) return <ErrorMessage error={tiersError.data?.message} />;

  return (
    <div className="space-y-8">
      <SEO
        title="MLM Tiers"
        description="AI-Powered Social-Ecommerce Platform is a comprehensive system integrating eCommerce, social networking, and MLM for book sales, community engagement, and earning opportunities."
        name="AI-Powered Social-Ecommerce"
        type="description"
      />
      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users />}
        />
        <StatCard
          title="Users in MLM"
          value={stats.usersInMLM}
          icon={<Trophy />}
        />
        <StatCard
          title="Total Referral Earnings"
          value={stats.totalEarnings.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
          icon={<BarChart3 />}
        />
      </section>

      {/* Tier management */}
      <section className="bg-white rounded-xl shadow-sm p-6">
        <header className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">MLM Tiers</h2>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-3 py-2 rounded-lg"
          >
            <PlusCircle className="h-4 w-4" /> Add Tier
          </button>
        </header>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <Th>#</Th>
                <Th>Name</Th>
                <Th>Commission %</Th>
                <Th>Min Earnings</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tiers.map((tier) => (
                <React.Fragment key={tier._id}>
                  <tr>
                    <Td>{tier.tier}</Td>
                    <Td>{tier.name}</Td>
                    <Td>{tier.commissionRate}%</Td>
                    <Td>
                      {tier.minEarnings.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </Td>
                    <Td>
                      <button
                        className="text-purple-600 hover:text-purple-800 mr-2"
                        onClick={() => openEditModal(tier)}
                      >
                        <PencilLine className="h-4 w-4" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteTier(tier._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </Td>
                  </tr>
                  {expandedTier === tier._id && (
                    <tr className="bg-purple-50">
                      <td colSpan={5} className="p-4 text-sm">
                        Benefits: {tier.benefits.join(", ") || "None"}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Manual user‑tier recalculation */}
      <section className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">Recalculate User Tier</h2>
        <form
          className="flex flex-col sm:flex-row gap-3"
          onSubmit={async (e) => {
            e.preventDefault();
            const id = e.target.userId.value.trim();
            if (id) await recalcUserTier(id);
          }}
        >
          <input
            name="userId"
            type="text"
            placeholder="Enter user ID"
            className="flex-1 border rounded-lg px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={recalcLoading}
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-1"
          >
            <RefreshCcw className="h-4 w-4" /> Recalculate
          </button>
        </form>
      </section>

      {/* Tier form modal */}
      {modalOpen && (
        <TierFormModal
          initialValues={editingTier}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveTier}
        />
      )}
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-3">
      <div className="bg-purple-100 p-2 rounded-full">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

const Th = ({ children }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {children}
  </th>
);
const Td = ({ children }) => (
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
    {children}
  </td>
);
