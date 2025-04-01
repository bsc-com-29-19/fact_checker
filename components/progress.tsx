export default function Progress({ logs }: { logs: string[] }) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg max-h-64 overflow-y-auto">
      <h3 className="font-medium mb-2">Agent Progress</h3>
      <div className="space-y-1">
        {logs.map((log, index) => (
          <div key={index} className="text-sm font-mono">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}
