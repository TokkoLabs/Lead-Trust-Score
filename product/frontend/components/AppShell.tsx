import React from "react";
import Topbar from "./shell/Topbar";
import LeftRail from "./shell/LeftRail";
import RightRail from "./shell/RightRail";
import BottomBar from "./shell/BottomBar";

export type AppShellView =
  | "dashboard"
  | "queue"
  | "processed"
  | "criteria"
  | "team"
  | "integrations"
  | "reports"
  | "settings";

export interface AppShellProps {
  children: React.ReactNode;
  activeView?: AppShellView | string;
  onSelectView?: (view: string) => void;
  onNewLead?: () => void;
  queueBadgeCount?: number;
  analyzedCount?: number;
  userInitials?: string;
  userName?: string;
  notificationCount?: number;
}

/**
 * AppShell Tokko — wrapper raíz que monta topbar + left rail + content + bottom
 * bar + right rail. Es el wrapper raíz del producto desde la feature 8.
 *
 * Cubre R1, R14, R15.
 */
export default function AppShell({
  children,
  activeView = "dashboard",
  onSelectView,
  onNewLead,
  queueBadgeCount = 0,
  analyzedCount = 0,
  userInitials = "EH",
  userName = "Emanuel",
  notificationCount = 3,
}: AppShellProps) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-surface-low">
      <Topbar
        userInitials={userInitials}
        userName={userName}
        notificationCount={notificationCount}
      />
      <div className="flex flex-1 overflow-hidden">
        <LeftRail
          activeView={activeView}
          onSelectView={onSelectView}
          onNewLead={onNewLead}
          queueBadgeCount={queueBadgeCount}
        />
        <main
          role="main"
          aria-label="Contenido"
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-auto">{children}</div>
          <BottomBar analyzedCount={analyzedCount} />
        </main>
        <RightRail />
      </div>
    </div>
  );
}
