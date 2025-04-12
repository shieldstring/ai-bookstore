import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMLMStats, fetchDownline } from '../../features/mlm/mlmSlice';
import MLMLayout from '../../components/mlm/MLMLayout';
import NetworkStats from '../../components/mlm/NetworkStats';
import EarningsChart from '../../components/mlm/EarningsChart';
import DownlineTable from '../../components/mlm/DownlineTable';
import PayoutHistory from '../../components/mlm/PayoutHistory';
import CommissionCalculator from '../../components/mlm/CommissionCalculator';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const MLMDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stats, downline, status, error } = useSelector((state) => state.mlm);

  useEffect(() => {
    if (user) {
      dispatch(fetchMLMStats(user._id));
      dispatch(fetchDownline(user._id));
    }
  }, [dispatch, user]);

  if (status === 'loading') return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <MLMLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Your MLM Network</h1>
        
        <NetworkStats stats={stats} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <EarningsChart earningsData={stats?.earningsHistory || []} />
          </div>
          <div>
            <CommissionCalculator 
              currentLevel={stats?.currentLevel} 
              commissionRates={stats?.commissionRates} 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DownlineTable downline={downline} />
          </div>
          <div>
            <PayoutHistory payouts={stats?.payoutHistory || []} />
          </div>
        </div>
      </div>
    </MLMLayout>
  );
};

export default MLMDashboard;