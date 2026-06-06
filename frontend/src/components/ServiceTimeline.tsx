import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2, Clock, AlertCircle, FilePlus, ShieldCheck,
  UserCheck, Wrench, MapPin, Flag, UserCircle2
} from 'lucide-react';
import type { TimelineEvent } from '../types';

// ──────────────────────────────────────────────
// Per-status visual config
// ──────────────────────────────────────────────
type StatusKey = 'DIBUAT' | 'DITERIMA' | 'DIVERIFIKASI' | 'DITUGASKAN' | 'DIPROSES' | 'TINDAK_LANJUT' | 'SELESAI' | 'DITOLAK';

const STATUS_CONFIG: Record<StatusKey, { color: string; bg: string; border: string; Icon: React.FC<{ size?: number; className?: string }> }> = {
  DIBUAT:       { color: 'var(--text-secondary)',  bg: 'var(--surface-2)',     border: 'var(--border)',   Icon: FilePlus },
  DITERIMA:     { color: 'var(--info)',             bg: 'var(--info-subtle)',   border: 'var(--info)',     Icon: ShieldCheck },
  DIVERIFIKASI: { color: 'var(--primary)',          bg: 'var(--primary-subtle)',border: 'var(--primary)', Icon: ShieldCheck },
  DITUGASKAN:   { color: 'var(--primary)',          bg: 'var(--primary-subtle)',border: 'var(--primary)', Icon: UserCheck },
  DIPROSES:     { color: 'var(--warning)',          bg: 'var(--warning-subtle)',border: 'var(--warning)', Icon: Wrench },
  TINDAK_LANJUT:{ color: 'var(--warning)',          bg: 'var(--warning-subtle)',border: 'var(--warning)', Icon: MapPin },
  SELESAI:      { color: 'var(--success)',          bg: 'var(--success-subtle)',border: 'var(--success)', Icon: Flag },
  DITOLAK:      { color: 'var(--error)',            bg: 'var(--error-subtle)',  border: 'var(--error)',   Icon: AlertCircle },
};

// Determine which STATUS_CONFIG key to use for a given event
function resolveConfig(event: TimelineEvent) {
  const s = (event.status as string).toUpperCase().replace(/ /g, '_');
  if (s in STATUS_CONFIG) return STATUS_CONFIG[s as StatusKey];
  // Fallback by completion state
  if (event.isCompleted) return STATUS_CONFIG['SELESAI'];
  if (event.isActive)    return STATUS_CONFIG['DIPROSES'];
  return { color: 'var(--text-tertiary)', bg: 'var(--surface-2)', border: 'var(--border)', Icon: Clock };
}

// ──────────────────────────────────────────────
// Props — use shared TimelineEvent from types/
// ──────────────────────────────────────────────
export interface ServiceTimelineProps {
  events: TimelineEvent[];
}

// ──────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────
export const ServiceTimeline: React.FC<ServiceTimelineProps> = ({ events }) => {
  return (
    <div className="relative pl-6 py-4">
      {/* Vertical connector line */}
      <div
        className="absolute top-8 bottom-8 left-[15px] w-px z-0"
        style={{ background: 'var(--border)' }}
      />

      {events.map((event, idx) => {
        const cfg = resolveConfig(event);
        const Icon = cfg.Icon;

        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.22, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex gap-5 mb-8 last:mb-0"
          >
            {/* ── Status Icon Bubble ── */}
            <div
              className="w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all z-10"
              style={{
                background: event.isActive || event.isCompleted ? cfg.bg : 'var(--surface-1)',
                borderColor: event.isActive || event.isCompleted ? cfg.border : 'var(--border)',
                boxShadow: event.isActive ? `0 0 0 4px ${cfg.bg}` : 'none',
              }}
            >
              {event.isCompleted && !event.isActive ? (
                <CheckCircle2 size={14} style={{ color: cfg.color }} />
              ) : (
                <Icon
                  size={14}
                  style={{ color: event.isActive || event.isCompleted ? cfg.color : 'var(--text-tertiary)' } as React.CSSProperties}
                />
              )}
            </div>

            {/* ── Content ── */}
            <div className="flex-1 pb-1">
              {/* Title row */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-1 mb-1">
                <div className="flex items-center gap-2">
                  <h4
                    className="text-sm font-bold"
                    style={{ color: event.isActive || event.isCompleted ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                  >
                    {event.title}
                  </h4>
                  {event.isActive && (
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                    >
                      Saat Ini
                    </span>
                  )}
                </div>

                {event.timestamp && (
                  <span
                    className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded"
                    style={{ background: 'var(--surface-2)', color: 'var(--text-tertiary)' }}
                  >
                    {new Date(event.timestamp).toLocaleDateString('id-ID', {
                      month: 'short', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                )}
              </div>

              {/* Description */}
              <p
                className="text-sm leading-relaxed mb-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                {event.description}
              </p>

              {/* Responsible actor */}
              {event.actor && (
                <div
                  className="flex items-center gap-1.5 pt-2 border-t"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <UserCircle2 size={13} style={{ color: 'var(--text-tertiary)' }} />
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    Ditangani oleh:{' '}
                    <strong style={{ color: 'var(--text-secondary)' }}>{event.actor}</strong>
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
