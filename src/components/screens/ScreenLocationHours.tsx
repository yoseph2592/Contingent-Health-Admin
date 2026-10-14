import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  MapPin,
  Clock,
  Navigation,
  ArrowRight,
  Check,
  Building,
  Calendar,
} from 'lucide-react';

export const ScreenLocationHours: React.FC = () => {
  const {
    location,
    setLocation,
    operatingHours,
    setOperatingHours,
    setCurrentStep,
    brandTheme,
  } = useClinic();

  const [mapPinSelected, setMapPinSelected] = useState(true);

  const toggleDay = (dayName: string) => {
    setOperatingHours((prev) =>
      prev.map((d) => (d.day === dayName ? { ...d, isOpen: !d.isOpen } : d))
    );
  };

  const updateHours = (
    dayName: string,
    field: 'openTime' | 'closeTime' | 'breakStart' | 'breakEnd',
    val: string
  ) => {
    setOperatingHours((prev) =>
      prev.map((d) => (d.day === dayName ? { ...d, [field]: val } : d))
    );
  };

  return (
    <div className="py-10 px-4 sm:px-6 max-w-4xl mx-auto space-y-8">
      {/* 1. Location Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
        <div className="mb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Facility Location</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Clinic location & address
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Patients use this physical location to calculate proximity, directions, and find available nearby services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Location fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Country
                </label>
                <input
                  type="text"
                  value={location.country}
                  onChange={(e) => setLocation({ ...location, country: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  value={location.city}
                  onChange={(e) => setLocation({ ...location, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Street Address / Road
              </label>
              <input
                type="text"
                value={location.address}
                onChange={(e) => setLocation({ ...location, address: e.target.value })}
                placeholder="e.g. Bole Medhanealem Road"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Area / Neighborhood
                </label>
                <input
                  type="text"
                  value={location.area}
                  onChange={(e) => setLocation({ ...location, area: e.target.value })}
                  placeholder="e.g. Bole Sub-City"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Building / Unit
                </label>
                <input
                  type="text"
                  value={location.buildingUnit}
                  onChange={(e) => setLocation({ ...location, buildingUnit: e.target.value })}
                  placeholder="e.g. Morning Star, 2nd Fl"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Interactive Simulated Map Box */}
          <div className="flex flex-col">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Set Location On Map</span>
              <span className="text-[11px] text-emerald-600 font-medium">GPS: 9.0018° N, 38.7845° E</span>
            </label>

            <div className="relative flex-1 min-h-[200px] rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
              {/* Map grid representation */}
              <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />
              
              {/* Road lines simulation */}
              <div className="absolute w-full h-4 bg-slate-300/80 top-1/2 -translate-y-1/2 rotate-12" />
              <div className="absolute h-full w-4 bg-slate-300/80 left-1/2 -translate-x-1/2 -rotate-6" />

              {/* Map Pin marker */}
              <div className="relative z-10 flex flex-col items-center animate-bounce">
                <div
                  className="p-2 rounded-full text-white shadow-lg flex items-center justify-center ring-4 ring-white"
                  style={{ backgroundColor: brandTheme.palette.primary }}
                >
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="mt-1 px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-bold shadow-md whitespace-nowrap">
                  {location.buildingUnit || 'Clinic Location'}
                </div>
              </div>

              {/* Pin control button overlay */}
              <div className="absolute bottom-2.5 right-2.5 z-20">
                <button
                  type="button"
                  onClick={() => setMapPinSelected(true)}
                  className="px-3 py-1.5 rounded-lg bg-white/95 text-slate-800 text-xs font-semibold shadow-xs border border-slate-200 hover:bg-white flex items-center space-x-1.5"
                >
                  <Navigation className="w-3.5 h-3.5 text-blue-600" />
                  <span>Calibrate Pin</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Operating Hours Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
        <div className="mb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Facility Schedule</span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Operating days & clinical hours
          </h3>
          <p className="text-sm text-slate-600 mt-0.5">
            Doctor availability and patient appointment slots will align with these facility hours.
          </p>
        </div>

        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
          {operatingHours.map((schedule) => (
            <div
              key={schedule.day}
              className={`p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                schedule.isOpen ? 'bg-white' : 'bg-slate-50/60 opacity-75'
              }`}
            >
              <div className="flex items-center space-x-3 w-36">
                <button
                  type="button"
                  onClick={() => toggleDay(schedule.day)}
                  className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                    schedule.isOpen
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {schedule.isOpen && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
                <span className={`text-sm font-semibold ${schedule.isOpen ? 'text-slate-900' : 'text-slate-400'}`}>
                  {schedule.day}
                </span>
              </div>

              {schedule.isOpen ? (
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-slate-500 font-medium">Open:</span>
                    <input
                      type="time"
                      value={schedule.openTime}
                      onChange={(e) => updateHours(schedule.day, 'openTime', e.target.value)}
                      className="px-2 py-1 rounded-md border border-slate-300 bg-slate-50 text-slate-900 font-medium text-xs"
                    />
                  </div>

                  <span className="text-slate-400">—</span>

                  <div className="flex items-center space-x-1.5">
                    <span className="text-slate-500 font-medium">Close:</span>
                    <input
                      type="time"
                      value={schedule.closeTime}
                      onChange={(e) => updateHours(schedule.day, 'closeTime', e.target.value)}
                      className="px-2 py-1 rounded-md border border-slate-300 bg-slate-50 text-slate-900 font-medium text-xs"
                    />
                  </div>

                  {schedule.breakStart && (
                    <div className="flex items-center space-x-1 text-slate-400 text-[11px] ml-2">
                      <span>(Break: {schedule.breakStart} - {schedule.breakEnd})</span>
                    </div>
                  )}
                </div>
              ) : (
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Closed
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Navigation actions */}
        <div className="mt-8 pt-4 flex items-center justify-between border-t border-slate-100">
          <button
            type="button"
            onClick={() => setCurrentStep('info')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900"
          >
            Back
          </button>

          <button
            id="location-hours-continue-btn"
            onClick={() => setCurrentStep('verification')}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl font-semibold text-white shadow-xs transition-all hover:opacity-90 active:scale-[0.99]"
            style={{
              backgroundColor: brandTheme.palette.primary,
              color: brandTheme.palette.primaryContrast,
            }}
          >
            <span>Continue to Verification</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
