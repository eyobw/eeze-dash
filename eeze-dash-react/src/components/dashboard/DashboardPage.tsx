import { useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import Sidebar from '@/components/layout/Sidebar';
import PageLayout from '@/components/layout/PageLayout';
import FileUploadPrompt from './FileUploadPrompt';
import DashboardGrid from './DashboardGrid';
import DataTable from '@/components/table/DataTable';
import LineChartModal from '@/components/modals/LineChartModal';
import PieBarModal from '@/components/modals/PieBarModal';
import MultiBarChartModal from '@/components/modals/MultiBarChartModal';
import BoxPlotModal from '@/components/modals/BoxPlotModal';
import DeleteDashboardModal from '@/components/modals/DeleteDashboardModal';
import AreaChartModal from '@/components/modals/AreaChartModal';
import ScatterPlotModal from '@/components/modals/ScatterPlotModal';
import HorizontalBarModal from '@/components/modals/HorizontalBarModal';
import RadarChartModal from '@/components/modals/RadarChartModal';
import StackedBarChartModal from '@/components/modals/StackedBarChartModal';

export default function DashboardPage() {
  const { state, removeWidget, updateLayouts, clearDashboard } = useDashboard();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'table'>('dashboard');

  // Modal states
  const [lineChartOpen, setLineChartOpen] = useState(false);
  const [pieBarOpen, setPieBarOpen] = useState(false);
  const [multiBarOpen, setMultiBarOpen] = useState(false);
  const [boxPlotOpen, setBoxPlotOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [areaChartOpen, setAreaChartOpen] = useState(false);
  const [scatterPlotOpen, setScatterPlotOpen] = useState(false);
  const [horizontalBarOpen, setHorizontalBarOpen] = useState(false);
  const [radarChartOpen, setRadarChartOpen] = useState(false);
  const [stackedBarOpen, setStackedBarOpen] = useState(false);

  // No data loaded -> show upload prompt
  if (!state.data || !state.analysis) {
    return <FileUploadPrompt />;
  }

  return (
    <>
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
        onOpenLineChart={() => setLineChartOpen(true)}
        onOpenPieBar={() => setPieBarOpen(true)}
        onOpenMultiBar={() => setMultiBarOpen(true)}
        onOpenBoxPlot={() => setBoxPlotOpen(true)}
        onOpenAreaChart={() => setAreaChartOpen(true)}
        onOpenScatterPlot={() => setScatterPlotOpen(true)}
        onOpenHorizontalBar={() => setHorizontalBarOpen(true)}
        onOpenRadarChart={() => setRadarChartOpen(true)}
        onOpenStackedBar={() => setStackedBarOpen(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <PageLayout sidebarOpen={sidebarOpen}>
        {activeTab === 'dashboard' && (
          <>
            <h3 className="text-xl font-semibold mb-2">Dashboard</h3>
            <button
              onClick={() => setDeleteOpen(true)}
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Clear Dashboard
            </button>

            <DashboardGrid
              widgets={state.widgets}
              layouts={state.layouts}
              onLayoutChange={updateLayouts}
              onRemoveWidget={removeWidget}
            />
          </>
        )}

        {activeTab === 'table' && (
          <DataTable
            columns={state.analysis.columns}
            data={state.data}
          />
        )}
      </PageLayout>

      {/* Modals */}
      <LineChartModal open={lineChartOpen} onClose={() => setLineChartOpen(false)} />
      <PieBarModal open={pieBarOpen} onClose={() => setPieBarOpen(false)} />
      <MultiBarChartModal open={multiBarOpen} onClose={() => setMultiBarOpen(false)} />
      <BoxPlotModal open={boxPlotOpen} onClose={() => setBoxPlotOpen(false)} />
      <AreaChartModal open={areaChartOpen} onClose={() => setAreaChartOpen(false)} />
      <ScatterPlotModal open={scatterPlotOpen} onClose={() => setScatterPlotOpen(false)} />
      <HorizontalBarModal open={horizontalBarOpen} onClose={() => setHorizontalBarOpen(false)} />
      <RadarChartModal open={radarChartOpen} onClose={() => setRadarChartOpen(false)} />
      <StackedBarChartModal open={stackedBarOpen} onClose={() => setStackedBarOpen(false)} />
      <DeleteDashboardModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={clearDashboard}
      />
    </>
  );
}
