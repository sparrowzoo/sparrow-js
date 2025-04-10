export default function Page() {
  return (
    <div className="flex flex-col h-screen">
      <div className="h-[200px] shrink-0 bg-yellow-500">外头</div>
      <div className="flex-1 min-h-0 flex flex-col border border-red-700">
        <div className="h-16 bg-gray-200">头部</div>
        <div className="flex-1 min-h-0 overflow-y-auto border border-gray-300 rounded-md">
          <div className="bg-gray-300 h-[100000px]">内容</div>
        </div>
        <div className="h-16 bg-gray-200">内底</div>
      </div>
    </div>
  );
}
