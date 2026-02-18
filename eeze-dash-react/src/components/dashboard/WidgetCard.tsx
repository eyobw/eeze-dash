import type { Widget } from '@/types';
import ChartRenderer from '@/components/charts/ChartRenderer';

interface Props {
  widget: Widget;
  onRemove: (id: string) => void;
}

export default function WidgetCard({ widget, onRemove }: Props) {
  return (
    <div className="widget-card h-full border border-gray-300 bg-white relative pt-9">
      {/* Header - drag handle */}
      <div className="drag-handle bg-gray-200 px-2.5 border border-gray-300 cursor-move absolute w-full h-9 top-0 left-0 flex items-center justify-between">
        <h5 className="text-sm font-medium truncate flex-1">{widget.name}</h5>
        <button
          onClick={() => onRemove(widget.id)}
          className="text-gray-400 hover:text-red-500 ml-2 text-lg leading-none"
          title="Remove chart"
        >
          &times;
        </button>
      </div>

      {/* Chart content */}
      <div className="h-[calc(100%-36px)] p-1">
        <ChartRenderer widget={widget} />
      </div>
    </div>
  );
}
