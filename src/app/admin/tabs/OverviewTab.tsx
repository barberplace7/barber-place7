'use client';
import { useState } from 'react';
import { useAdminOverview } from '@/hooks/useAdminQueries';
import Overview from '../components/dashboard/Overview';

export default function OverviewTab({ adminData }: any) {
  const [overviewPeriod, setOverviewPeriod] = useState('7days');
  const [chartPeriod, setChartPeriod] = useState('7days');
  const [branchPeriod, setBranchPeriod] = useState('7days');

  const { data: overviewData } = useAdminOverview({ overviewPeriod, chartPeriod, branchPeriod });

  return (
    <Overview
      overviewData={overviewData}
      overviewPeriod={overviewPeriod}
      chartPeriod={chartPeriod}
      branchPeriod={branchPeriod}
      setOverviewPeriod={setOverviewPeriod}
      setChartPeriod={setChartPeriod}
      setBranchPeriod={setBranchPeriod}
      branchList={adminData.branchList}
      capsterList={adminData.capsterList}
      kasirList={adminData.kasirList}
      serviceList={adminData.serviceList}
      productList={adminData.productList}
    />
  );
}
