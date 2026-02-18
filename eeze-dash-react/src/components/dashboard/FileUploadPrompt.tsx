import { useFileUpload } from '@/hooks/useFileUpload';
import { useDashboard } from '@/context/DashboardContext';

export default function FileUploadPrompt() {
  const { loadData } = useDashboard();
  const { handleFileChange } = useFileUpload(loadData);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-gray-100 rounded-lg p-12 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 font-montserrat">Customizable-Dash</h1>
        <p className="text-lg text-gray-600 mb-8">
          Upload your data in JSON or CSV format and create your own dashboard
        </p>
        <label className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg text-lg cursor-pointer hover:bg-green-700 transition-colors">
          Choose File
          <input
            type="file"
            accept=".json,.csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}
