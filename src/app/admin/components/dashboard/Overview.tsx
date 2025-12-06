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
            {new Date().toLocaleDateString('id-ID', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long' 
            })}, {new Date().toLocaleTimeString('id-ID').replace(/\./g, ':')} WIB
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
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Today's Revenue</p>
                  <p className="text-3xl font-bold">Rp {overviewData?.todayRevenue?.toLocaleString() || '0'}</p>
                </div>
                <div className="w-12 h-12 bg-green-400 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">Today's Expenses</p>
                  <p className="text-3xl font-bold">Rp {overviewData?.todayExpenses?.toLocaleString() || '0'}</p>
                </div>
                <div className="w-12 h-12 bg-red-400 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💸</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Net Profit Today</p>
                  <p className="text-3xl font-bold">Rp {((overviewData?.todayRevenue || 0) - (overviewData?.todayExpenses || 0)).toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📈</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Transactions Today</p>
                  <p className="text-3xl font-bold">{overviewData?.todayTransactions || 0}</p>
                </div>
                <div className="w-12 h-12 bg-purple-400 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🛒</span>
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
              <div className="relative" style={{ minWidth: chartPeriod === '30days' ? '1000px' : '100%' }}>
                {/* Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none" style={{ height: chartPeriod === '30days' ? '240px' : '240px' }}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="border-t border-gray-200 border-dashed"></div>
                  ))}
                </div>
                {/* Chart Bars */}
                <div className={`h-60 flex items-end space-x-2 pt-4 ${chartPeriod === '30days' ? 'pb-16' : 'pb-8'}`}>
                  {overviewData.weeklyRevenue.map((day: any, index: number) => (
                    <div key={index} className="flex-1 flex flex-col items-center group relative" style={{ minWidth: chartPeriod === '30days' ? '25px' : 'auto' }}>
                      <div 
                        className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all hover:from-blue-700 hover:to-blue-500 cursor-pointer shadow-sm"
                        style={{ height: `${Math.max((day.revenue / Math.max(...overviewData.weeklyRevenue.map((d: any) => d.revenue))) * 200, 8)}px` }}
                      ></div>
                      <div className="mt-2 text-xs text-gray-600 font-medium w-full text-center" style={{ writingMode: chartPeriod === '30days' ? 'vertical-rl' : 'horizontal-tb', transform: chartPeriod === '30days' ? 'rotate(180deg)' : 'none' }}>{day.day}</div>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-2 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-lg">
                        <div className="font-bold">Rp {day.revenue.toLocaleString()}</div>
                        <div className="text-[10px] text-gray-300 mt-0.5">{day.day}</div>
                      </div>
                    </div>
                  ))}
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
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                    }`}>
                      {index + 1}
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