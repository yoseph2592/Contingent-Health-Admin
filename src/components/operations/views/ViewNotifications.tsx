import React, { useState } from 'react';
import { useClinicOperations } from '../../../context/ClinicOperationsContext';
import { NotificationItem } from '../../../types/operations';
import {
  Bell,
  ArrowRight,
  Check,
  Stethoscope,
  ReceiptText,
} from 'lucide-react';

export const ViewNotifications: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead, setActiveTab } =
    useClinicOperations();

  const [filterCategory, setFilterCategory] = useState('All');

  const categories = ['All', 'Clinical', 'Financial', 'Operational', 'Administrative'];

  const filtered = notifications.filter(
    (n) => filterCategory === 'All' || n.category === filterCategory
  );

  const handleActionClick = (n: NotificationItem) => {
    markNotificationRead(n.id);
    if (n.category === 'Clinical') setActiveTab('encounter');
    else if (n.category === 'Financial') setActiveTab('claims');
    else if (n.category === 'Operational') setActiveTab('appointments');
    else setActiveTab('contracts');
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#717171]">
            Dispatch & Alerts
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-[#222222] mt-1">
            Notifications
          </h1>
          <p className="text-sm text-[#717171] mt-0.5">
            Real-time clinical alerts, claim adjudications, and urgent patient events
          </p>
        </div>

        <button
          type="button"
          onClick={markAllNotificationsRead}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#DDDDDD] hover:border-[#222222] bg-white text-[#222222] rounded-full text-xs font-medium transition-colors self-start sm:self-auto"
        >
          <Check className="w-3.5 h-3.5 text-[#717171]" />
          <span>Mark all read</span>
        </button>
      </div>

      {/* Filter strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilterCategory(c)}
            className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
              filterCategory === c
                ? 'bg-[#222222] text-white'
                : 'bg-white border border-[#DDDDDD] text-[#717171] hover:text-[#222222]'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div className="border border-[#EBEBEB] rounded-2xl bg-white overflow-hidden divide-y divide-[#EBEBEB] text-xs">
        {filtered.map((n) => (
          <div
            key={n.id}
            className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
              !n.isRead ? 'bg-[#FAFAFA]' : 'hover:bg-[#FAFAFA]'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-[#F7F7F7] text-[#222222] shrink-0 mt-0.5">
                {n.category === 'Clinical' ? (
                  <Stethoscope className="w-4 h-4" />
                ) : n.category === 'Financial' ? (
                  <ReceiptText className="w-4 h-4" />
                ) : (
                  <Bell className="w-4 h-4" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#222222] text-sm">{n.title}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      n.priority === 'Urgent'
                        ? 'bg-[#fb3748]/10 text-[#d00416]'
                        : n.priority === 'High'
                        ? 'bg-[#ffdb43]/20 text-[#dfb400]'
                        : 'bg-[#f0f2f5] text-[#606060]'
                    }`}
                  >
                    {n.priority}
                  </span>
                  <span className="text-xs text-[#717171] font-mono">({n.category})</span>
                </div>
                <p className="text-xs text-[#717171] mt-1">{n.message}</p>
                <div className="flex items-center gap-3 text-xs text-[#717171] mt-1">
                  <span>{n.timestamp}</span>
                  <span>Channels: {n.channel.join(', ')}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              {n.actionUrl && (
                <button
                  type="button"
                  onClick={() => handleActionClick(n)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#222222] hover:bg-black text-white rounded-full text-xs font-medium transition-colors shadow-xs"
                >
                  <span>Resolve & view</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
