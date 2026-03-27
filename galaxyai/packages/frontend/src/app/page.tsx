import WorkflowCanvas from '@/components/flow/WorkflowCanvas';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50 overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-900/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="font-bold text-lg italic">N</span>
          </div>
          <h1 className="font-bold text-xl tracking-tight">NextFlow <span className="text-xs font-normal opacity-50 px-2 py-0.5 rounded-full bg-zinc-800 ml-1">BETA</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs text-zinc-500 font-medium">Auto-save: ON</div>
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center cursor-pointer hover:bg-zinc-700 transition">
            <span className="text-[10px]">AD</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <WorkflowCanvas />
      </div>
    </main>
  );
}
