import { ResponsiveGridLayout, useContainerWidth } from 'react-grid-layout';
import type { Widget, LayoutItem } from '@/types';
import WidgetCard from './WidgetCard';
import 'react-grid-layout/css/styles.css';

interface Props {
  widgets: Widget[];
  layouts: LayoutItem[];
  onLayoutChange: (layouts: LayoutItem[]) => void;
  onRemoveWidget: (id: string) => void;
}

export default function DashboardGrid({
  widgets,
  layouts,
  onLayoutChange,
  onRemoveWidget,
}: Props) {
  const { width, containerRef, mounted } = useContainerWidth();

  return (
    <div ref={containerRef} className="border border-gray-300 min-h-[200px]">
      {mounted && (
        <ResponsiveGridLayout
          className="layout"
          width={width}
          layouts={{ lg: layouts }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 4, md: 4, sm: 2, xs: 1, xxs: 1 }}
          rowHeight={200}
          margin={[10, 10] as const}
          dragConfig={{ handle: '.drag-handle' }}
          resizeConfig={{ enabled: true, handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'] }}
          onLayoutChange={(layout) => {
            const mapped: LayoutItem[] = [...layout].map((l) => ({
              i: l.i,
              x: l.x,
              y: l.y,
              w: l.w,
              h: l.h,
            }));
            onLayoutChange(mapped);
          }}
        >
          {widgets.map((widget) => (
            <div key={widget.id}>
              <WidgetCard widget={widget} onRemove={onRemoveWidget} />
            </div>
          ))}
        </ResponsiveGridLayout>
      )}
    </div>
  );
}
