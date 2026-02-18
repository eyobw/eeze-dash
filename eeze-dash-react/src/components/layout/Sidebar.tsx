interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  onOpenLineChart: () => void;
  onOpenPieBar: () => void;
  onOpenMultiBar: () => void;
  onOpenBoxPlot: () => void;
  onOpenAreaChart: () => void;
  onOpenScatterPlot: () => void;
  onOpenHorizontalBar: () => void;
  onOpenRadarChart: () => void;
  onOpenStackedBar: () => void;
  activeTab: 'dashboard' | 'table';
  onTabChange: (tab: 'dashboard' | 'table') => void;
}

const btnClass =
  'w-full text-white text-left text-[15px] leading-10 pl-6 bg-transparent border-none hover:border-l-[3px] hover:border-l-[#e99d1a] hover:cursor-pointer';

export default function Sidebar({
  open,
  onToggle,
  onOpenLineChart,
  onOpenPieBar,
  onOpenMultiBar,
  onOpenBoxPlot,
  onOpenAreaChart,
  onOpenScatterPlot,
  onOpenHorizontalBar,
  onOpenRadarChart,
  onOpenStackedBar,
  activeTab,
  onTabChange,
}: SidebarProps) {
  return (
    <div
      className={`fixed top-14 left-0 h-full z-50 transition-all duration-400 ease-in-out ${
        open ? 'w-[250px]' : 'w-[70px]'
      }`}
      style={{ background: '#7C4D4D' }}
    >
      <ul className="list-none p-0 m-0 overflow-x-hidden overflow-y-auto">
        {/* Header */}
        <li className="h-[65px]">
          <button
            onClick={onToggle}
            className="w-full text-white text-left text-lg leading-[60px] pl-5 hover:cursor-pointer bg-transparent border-none"
            style={{ width: 250 }}
          >
            Dashboard
            <span className="float-right pr-7 leading-[60px] text-lg">
              {open ? '\u2190' : '\u2192'}
            </span>
          </button>
        </li>

        {/* Dashboard tab */}
        <li className="h-10">
          <button
            onClick={() => onTabChange('dashboard')}
            className={`${btnClass} ${
              activeTab === 'dashboard' ? 'border-l-[3px] border-l-[#e99d1a]' : ''
            }`}
            style={{ width: 250 }}
          >
            Dashboard
          </button>
        </li>

        {/* Table tab */}
        <li className="h-10">
          <button
            onClick={() => onTabChange('table')}
            className={`${btnClass} ${
              activeTab === 'table' ? 'border-l-[3px] border-l-[#e99d1a]' : ''
            }`}
            style={{ width: 250 }}
          >
            Tables
          </button>
        </li>

        {/* Chart creation buttons */}
        <li className="h-10">
          <button onClick={onOpenLineChart} className={btnClass} style={{ width: 250 }}>
            Line Charts
          </button>
        </li>
        <li className="h-10">
          <button onClick={onOpenAreaChart} className={btnClass} style={{ width: 250 }}>
            Area Charts
          </button>
        </li>
        <li className="h-10">
          <button onClick={onOpenPieBar} className={btnClass} style={{ width: 250 }}>
            Pie and Bar Charts
          </button>
        </li>
        <li className="h-10">
          <button onClick={onOpenHorizontalBar} className={btnClass} style={{ width: 250 }}>
            Horizontal Bar
          </button>
        </li>
        <li className="h-10">
          <button onClick={onOpenMultiBar} className={btnClass} style={{ width: 250 }}>
            Multi Bar Charts
          </button>
        </li>
        <li className="h-10">
          <button onClick={onOpenStackedBar} className={btnClass} style={{ width: 250 }}>
            Stacked Bar
          </button>
        </li>
        <li className="h-10">
          <button onClick={onOpenScatterPlot} className={btnClass} style={{ width: 250 }}>
            Scatter Plot
          </button>
        </li>
        <li className="h-10">
          <button onClick={onOpenRadarChart} className={btnClass} style={{ width: 250 }}>
            Radar Chart
          </button>
        </li>
        <li className="h-10">
          <button onClick={onOpenBoxPlot} className={btnClass} style={{ width: 250 }}>
            Box Plot
          </button>
        </li>
      </ul>
    </div>
  );
}
