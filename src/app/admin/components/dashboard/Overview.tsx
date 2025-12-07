import React from 'react';

interface OverviewProps {
  overviewData: any;
  overviewPeriod: string;
  chartPeriod: string;
  branchPeriod: string;
  setOverviewPeriod: (period: string) => void;
  setChartPeriod: (period: string) => void;
  setBranchPeriod: (period: string) => void;
  branchList: any[];
  capsterList: any[];
  kasirList: any[];
  serviceList: any[];
  productList: any[];
}

export default function Overview({
  overviewData,
  overviewPeriod,
  chartPeriod,
  branchPeriod,
  setOverviewPeriod,
  setChartPeriod,
  setBranchPeriod,
  branchList,
  capsterList,
  kasirList,
  serviceList,
  productList
}: OverviewProps) {
  const [currentTime, setCurrentTime] = React.useState('');

  React.useEffect(() => {
    // Set initial time on client
    setCurrentTime(new Date().toLocaleDateString('id-ID', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    }) + ', ' + new Date().toLocaleTimeString('id-ID').replace(/\./g, ':') + ' WIB');

    // Update every second
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleDateString('id-ID', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      }) + ', ' + new Date().toLocaleTimeString('id-ID').replace(/\./g, ':') + ' WIB');
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Business Overview</h2>
          <p className="text-gray-600 mt-1">Real-time insights and performance metrics</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Last updated</div>
          <div className="text-lg font-semibold text-gray-900">
            {currentTime || 'Loading...'}
          </div>
        </div>
      </div>

      {!overviewData ? (
        <div className="space-y-8">
          {/* Loading Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-gray-200 p-6 rounded-xl animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                    <div className="h-8 bg-gray-300 rounded w-32"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Loading Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
              <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>
              <div className="space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="flex items-center justify-between animate-pulse">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div className="space-y-1">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Loading Branch Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200">
              <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
              <div className="space-y-4">
                {[1,2].map(i => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="space-y-1">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="h-6 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
              <div className="space-y-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-6 bg-gray-200 rounded w-8"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border-l-4 border-green-500 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-gray-500 text-sm font-medium mb-2">Today's Revenue</p>
                  <p className={`font-bold text-gray-900 break-words ${
                    (overviewData?.todayRevenue?.toLocaleString() || '0').length > 15 ? 'text-xl' : 
                    (overviewData?.todayRevenue?.toLocaleString() || '0').length > 12 ? 'text-2xl' : 'text-3xl'
                  }`}>Rp {overviewData?.todayRevenue?.toLocaleString() || '0'}</p>
                </div>
                <div className="w-12 h-12 bg-white border-2 border-green-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border-l-4 border-red-500 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-gray-500 text-sm font-medium mb-2">Today's Expenses</p>
                  <p className={`font-bold text-gray-900 break-words ${
                    (overviewData?.todayExpenses?.toLocaleString() || '0').length > 15 ? 'text-xl' : 
                    (overviewData?.todayExpenses?.toLocaleString() || '0').length > 12 ? 'text-2xl' : 'text-3xl'
                  }`}>Rp {overviewData?.todayExpenses?.toLocaleString() || '0'}</p>
                </div>
                <div className="w-12 h-12 bg-white border-2 border-red-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-gray-500 text-sm font-medium mb-2">Net Profit Today</p>
                  <p className={`font-bold text-gray-900 break-words ${
                    (((overviewData?.todayRevenue || 0) - (overviewData?.todayExpenses || 0)).toLocaleString()).length > 15 ? 'text-xl' : 
                    (((overviewData?.todayRevenue || 0) - (overviewData?.todayExpenses || 0)).toLocaleString()).length > 12 ? 'text-2xl' : 'text-3xl'
                  }`}>Rp {((overviewData?.todayRevenue || 0) - (overviewData?.todayExpenses || 0)).toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-white border-2 border-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border-l-4 border-purple-500 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-2">Transactions Today</p>
                  <p className="text-3xl font-bold text-gray-900">{overviewData?.todayTransactions || 0}</p>
                </div>
                <div className="w-12 h-12 bg-white border-2 border-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Chart - Full Width */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Revenue Trend</h3>
                <p className="text-sm text-gray-500 mt-1">Daily revenue performance</p>
              </div>
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                {[
                  { id: '7days', name: '7 Days' },
                  { id: '30days', name: '30 Days' }
                ].map((period) => (
                  <button
                    key={period.id}
                    onClick={() => setChartPeriod(period.id)}
                    className={`px-4 py-2 text-xs font-medium rounded-md transition-colors ${
                      chartPeriod === period.id
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {period.name}
                  </button>
                ))}
              </div>
            </div>
            <div className={chartPeriod === '30days' ? 'overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100' : 'pb-2'}>
              <div className="relative pt-4" style={{ minWidth: chartPeriod === '30days' ? '1000px' : '100%' }}>
                {/* Chart Bars */}
                <div className={`h-48 flex items-end ${chartPeriod === '30days' ? 'gap-2' : 'gap-4'} pb-2`}>
                  {overviewData.weeklyRevenue.map((day: any, index: number) => {
                    const maxRevenue = Math.max(...overviewData.weeklyRevenue.map((d: any) => d.revenue));
                    const heightPercent = (day.revenue / maxRevenue) * 100;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center group" style={{ minWidth: chartPeriod === '30days' ? '28px' : 'auto' }}>
                        <div className="w-full flex flex-col items-center justify-end" style={{ height: '160px' }}>
                          <div className="text-[9px] font-bold text-gray-700 mb-1 whitespace-nowrap">
                            {day.revenue.toLocaleString('id-ID')}
                          </div>
                          <div 
                            className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all hover:from-blue-700 hover:to-blue-500 cursor-pointer relative"
                            style={{ height: `${Math.max(heightPercent, 5)}%` }}
                          >
                            <div className="absolute inset-0 bg-white/10 rounded-t-lg"></div>
                          </div>
                        </div>
                        <div className="mt-2 text-[11px] text-gray-600 font-medium text-center">{day.day}</div>
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-8 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-lg">
                          <div className="font-bold">Rp {day.revenue.toLocaleString()}</div>
                          <div className="text-[10px] text-gray-300 mt-0.5">{day.day}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {chartPeriod === '30days' && (
              <div className="mt-3 text-center text-xs text-gray-500">
                💡 Scroll horizontally to view all days
              </div>
            )}
          </div>

          {/* Top Services - Moved Below */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Top Services</h3>
            <div className="space-y-4">
              {overviewData.topServices.map((service: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full border-2 border-gray-300 bg-gray-50 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-700">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{service.name}</div>
                      <div className="text-sm text-gray-500">{service.count} transactions</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">Rp {service.revenue.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Branch Performance & Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Branch Performance */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Branch Performance</h3>
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                  {[
                    { id: 'today', name: 'Today' },
                    { id: '7days', name: '7 Days' },
                    { id: '30days', name: '30 Days' }
                  ].map((period) => (
                    <button
                      key={period.id}
                      onClick={() => setBranchPeriod(period.id)}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                        branchPeriod === period.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {period.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                {overviewData.branchPerformance.map((branch: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold">#{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{branch.name}</div>
                        <div className="text-sm text-gray-500">{branch.transactions} transactions</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">Rp {branch.revenue.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">{branch.staff} staff active</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Total Branches</span>
                  <span className="text-xl font-bold text-orange-600">{branchList.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Total Capsters</span>
                  <span className="text-xl font-bold text-blue-600">{capsterList.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Total Kasir</span>
                  <span className="text-xl font-bold text-green-600">{kasirList.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Services & Products</span>
                  <span className="text-xl font-bold text-purple-600">{(serviceList?.length || 0) + (productList?.length || 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
