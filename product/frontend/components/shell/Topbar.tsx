import React from "react";
import Icon from "./Icon";

interface TopbarProps {
  userInitials: string;
  userName: string;
  notificationCount: number;
}

/**
 * Topbar Tokko — header teal (#1A4958 vía bg-brand-secondary-high).
 * Cubre R2, R15.
 */
export default function Topbar({
  userInitials,
  userName,
  notificationCount,
}: TopbarProps) {
  return (
    <header
      role="banner"
      aria-label="Topbar"
      className="h-14 bg-brand-secondary-high flex items-center gap-8 px-6 pl-14 rounded-b-3xl shrink-0 z-20"
    >
      {/* Logo */}
      <div className="flex items-center gap-1.5 text-[15px] font-bold text-white tracking-tight">
        <div className="w-[26px] h-[26px] rounded-md bg-brand-primary-500 flex items-center justify-center">
          <Icon name="logo-eye" className="w-3.5 h-3.5" />
        </div>
        Lead<span className="text-brand-primary-100">Trust</span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-[856px] h-8 bg-white rounded-button flex items-center gap-6 px-3">
        <Icon name="search" className="w-3 h-3 opacity-50 shrink-0" />
        <input
          type="text"
          aria-label="Buscar"
          placeholder="Buscar leads, propiedades, contactos…"
          className="flex-1 bg-transparent text-body-xs text-neutral-grey-600 outline-none"
        />
      </div>

      {/* Right group */}
      <div
        role="group"
        aria-label="Acciones del topbar"
        className="flex items-center gap-6 ml-auto shrink-0"
      >
        <button
          type="button"
          aria-label="Notificaciones"
          className="relative w-8 h-8 rounded-chip text-white hover:bg-white/10 flex items-center justify-center"
        >
          <Icon name="bell" />
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 bg-brand-primary-500 text-white text-[10px] font-bold min-w-[16px] h-4 rounded-pill flex items-center justify-center px-1">
              {notificationCount}
            </span>
          )}
        </button>
        <button
          type="button"
          aria-label="Añadir"
          className="w-8 h-8 rounded-chip text-white hover:bg-white/10 flex items-center justify-center"
        >
          <Icon name="plus" />
        </button>
        <div className="flex items-center gap-2.5">
          <div
            aria-hidden="true"
            className="w-6 h-6 rounded-full bg-brand-primary-100 text-brand-primary-700 text-[10px] font-bold flex items-center justify-center"
          >
            {userInitials}
          </div>
          <span className="text-body-sm font-bold text-neutral-grey-100 whitespace-nowrap">
            {userName}
          </span>
        </div>
        <button
          type="button"
          aria-label="Configuración"
          className="w-8 h-8 rounded-chip text-white hover:bg-white/10 flex items-center justify-center"
        >
          <Icon name="settings" />
        </button>
        <button
          type="button"
          aria-label="Ayuda"
          className="w-8 h-8 rounded-chip text-white hover:bg-white/10 flex items-center justify-center"
        >
          <Icon name="help" />
        </button>
      </div>
    </header>
  );
}
