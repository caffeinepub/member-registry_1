import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClipboardList, Search, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useActor } from "./hooks/useActor";
import ManagePage from "./pages/ManagePage";
import RegisterPage from "./pages/RegisterPage";
import ReportPage from "./pages/ReportPage";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 30 } },
});

type Tab = "register" | "report" | "manage";

const NAV_ITEMS: {
  tab: Tab;
  label: string;
  icon: React.ElementType;
  ocid: string;
}[] = [
  {
    tab: "register",
    label: "Register",
    icon: ClipboardList,
    ocid: "nav.register_tab",
  },
  { tab: "report", label: "Report", icon: Search, ocid: "nav.report_tab" },
  { tab: "manage", label: "Manage", icon: Settings, ocid: "nav.manage_tab" },
];

function AppInner() {
  const [tab, setTab] = useState<Tab>("register");
  const { actor, isFetching } = useActor();
  const seeded = useRef(false);

  useEffect(() => {
    if (!actor || isFetching || seeded.current) return;
    seeded.current = true;
    actor.seedInitialData().catch(() => {});
  }, [actor, isFetching]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-primary text-primary-foreground px-4 py-3 flex items-center gap-3 shadow-md">
        <div className="w-8 h-8 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
          <ClipboardList className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-bold text-base leading-tight">Member Registry</h1>
          <p className="text-xs text-primary-foreground/70">
            Management System
          </p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-20">
        <div className="max-w-[480px] mx-auto">
          {tab === "register" && <RegisterPage />}
          {tab === "report" && <ReportPage />}
          {tab === "manage" && <ManagePage />}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-[0_-2px_12px_rgba(0,0,0,0.06)] z-50">
        <div className="max-w-[480px] mx-auto flex">
          {NAV_ITEMS.map(({ tab: t, label, icon: Icon, ocid }) => (
            <button
              type="button"
              key={t}
              data-ocid={ocid}
              onClick={() => setTab(t)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 text-xs font-medium transition-colors relative ${
                tab === t
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === t && (
                <span className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-primary rounded-full" />
              )}
              <Icon className="h-5 w-5" />
              {label}
            </button>
          ))}
        </div>
      </nav>

      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}
