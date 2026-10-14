import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  ShieldCheck,
  MapPin,
  Clock,
  Phone,
  Globe,
  Calendar,
  Stethoscope,
  Users,
  ChevronRight,
  Star,
  CheckCircle2,
  Search,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Info,
  Check,
} from 'lucide-react';
import { PlatformDoctor, ClinicService } from '../../types';

export const ScreenPatientListing: React.FC = () => {
  const {
    clinicInfo,
    brandTheme,
    location,
    operatingHours,
    services,
    getAffiliatedDoctors,
    verification,
    setCurrentStep,
  } = useClinic();

  const affiliatedDocs = getAffiliatedDoctors();

  // Interactive booking state
  const [selectedService, setSelectedService] = useState<ClinicService | null>(
    services[0] || null
  );
  const [selectedDoctor, setSelectedDoctor] = useState<PlatformDoctor | null>(
    affiliatedDocs[0]?.doctor || null
  );
  const [selectedDate, setSelectedDate] = useState('Tomorrow, 09:30 AM');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Available doctors for the currently selected service
  const doctorsForSelectedService = selectedService
    ? affiliatedDocs.filter((item) =>
        selectedService.associatedDoctorIds.includes(item.doctor.id)
      )
    : [];

  const availableSlots = [
    '09:00 AM',
    '09:30 AM',
    '10:30 AM',
    '11:15 AM',
    '02:00 PM',
    '03:30 PM',
  ];

  return (
    <div className="py-8 px-4 sm:px-6 max-w-5xl mx-auto space-y-8">
      {/* Top Banner explaining Preview context */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center space-x-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: brandTheme.palette.primary }}
          />
          <div>
            <h3 className="text-sm font-bold">Patient-Facing Clinic Listing Preview</h3>
            <p className="text-xs text-slate-300">
              Live representation of how patients discover, browse, and book appointments at {clinicInfo.name}.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentStep('setup')}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => setCurrentStep('publish')}
            className="px-4 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs transition-opacity hover:opacity-90"
            style={{
              backgroundColor: brandTheme.palette.primary,
              color: brandTheme.palette.primaryContrast,
            }}
          >
            Publish Settings
          </button>
        </div>
      </div>

      {/* 1. Patient Discovery Card (Section 33: How it appears in search results) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
          Patient Search Result Card
        </span>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/40 transition-all">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-white p-2 border border-slate-200 shadow-2xs shrink-0 flex items-center justify-center">
              <img
                src={brandTheme.url}
                alt="Clinic Emblem"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-base font-bold text-slate-900">{clinicInfo.name}</h4>
                {verification.status === 'approved' && (
                  <span className="inline-flex items-center space-x-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-200">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified Clinic</span>
                  </span>
                )}
              </div>

              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                {clinicInfo.category} · {location.city}, {location.area}
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                <span className="flex items-center space-x-1 text-emerald-600 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  <span>Open Today (08:00 - 18:00)</span>
                </span>
                <span>·</span>
                <span>{affiliatedDocs.length} Verified Doctors</span>
                <span>·</span>
                <span>{services.length} Healthcare Services</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              const el = document.getElementById('public-clinic-profile');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs transition-opacity hover:opacity-90"
            style={{
              backgroundColor: brandTheme.palette.primary,
              color: brandTheme.palette.primaryContrast,
            }}
          >
            View Clinic Profile
          </button>
        </div>
      </div>

      {/* 2. Full Patient-Facing Clinic Profile (Section 34) */}
      <div
        id="public-clinic-profile"
        className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
      >
        {/* Dynamic Clinic Header Banner */}
        <div
          className="p-6 sm:p-10 text-white relative"
          style={{
            backgroundColor: brandTheme.palette.primary,
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start sm:items-center space-x-4">
              <div className="w-20 h-20 rounded-2xl bg-white p-2.5 shadow-md shrink-0 flex items-center justify-center">
                <img
                  src={brandTheme.url}
                  alt="Clinic Emblem"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {clinicInfo.name}
                  </h2>
                  {verification.status === 'approved' && (
                    <span className="bg-white/20 backdrop-blur-xs text-white border border-white/30 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified Clinic</span>
                    </span>
                  )}
                </div>

                <p className="text-sm opacity-90 mt-1 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>
                    {location.buildingUnit}, {location.address}, {location.city}
                  </span>
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                const el = document.getElementById('booking-portal-engine');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-md hover:bg-slate-50 transition-all self-start sm:self-auto"
            >
              Book Appointment
            </button>
          </div>
        </div>

        {/* Clinic Nav Tabs */}
        <div className="border-b border-slate-200 px-6 sm:px-10 flex space-x-8 text-xs font-bold text-slate-500">
          <span
            className="py-3.5 border-b-2 font-extrabold"
            style={{
              borderColor: brandTheme.palette.primary,
              color: brandTheme.palette.primary,
            }}
          >
            Overview & Services
          </span>
          <span className="py-3.5 hover:text-slate-900 cursor-pointer">Affiliated Doctors</span>
          <span className="py-3.5 hover:text-slate-900 cursor-pointer">Location & Hours</span>
        </div>

        {/* Profile Content Body */}
        <div className="p-6 sm:p-10 space-y-10">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">About The Clinic</h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
              {clinicInfo.fullDescription || clinicInfo.shortDescription}
            </p>
          </div>

          {/* Active Services Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Clinical Services</h3>
                <p className="text-xs text-slate-500">Available for walk-in and online scheduling.</p>
              </div>
              <span className="text-xs text-slate-500 font-semibold">
                {services.length} active offerings
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => {
                const isSelected = selectedService?.id === service.id;
                const assignedDocs = affiliatedDocs.filter((item) =>
                  service.associatedDoctorIds.includes(item.doctor.id)
                );

                return (
                  <div
                    key={service.id}
                    onClick={() => {
                      setSelectedService(service);
                      if (assignedDocs.length > 0) {
                        setSelectedDoctor(assignedDocs[0].doctor);
                      }
                    }}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-slate-800 bg-slate-50/70 ring-2 ring-slate-800/10 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-sm font-bold text-slate-900">{service.name}</h4>
                        <span
                          className="text-xs font-bold shrink-0"
                          style={{ color: brandTheme.palette.primary }}
                        >
                          {service.priceCurrency} {service.priceAmount}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed mb-3">
                        {service.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{service.durationMinutes} mins</span>
                      </span>

                      <div className="flex items-center space-x-1">
                        <span className="text-slate-500 font-medium">
                          {assignedDocs.length} doctor{assignedDocs.length === 1 ? '' : 's'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Affiliated Doctors Section (Section 34: Doctor remains connected to clinic) */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Affiliated Medical Staff</h3>
                <p className="text-xs text-slate-500">
                  Every doctor has been verified by the Contingent Platform credentials board.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {affiliatedDocs.map(({ doctor, affiliation }) => (
                <div
                  key={doctor.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-all"
                >
                  <div>
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={doctor.avatarUrl}
                        alt={doctor.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{doctor.name}</h4>
                        <p className="text-[11px] text-slate-600">{doctor.specialty}</p>
                        <span className="inline-flex items-center space-x-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-sm border border-emerald-200 mt-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Contingent Verified</span>
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 space-y-1 mb-3">
                      <p>
                        <strong className="text-slate-700">Clinic Dept:</strong> {affiliation.department}
                      </p>
                      <p>
                        <strong className="text-slate-700">Branch:</strong> {affiliation.branch}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedDoctor(doctor);
                      const el = document.getElementById('booking-portal-engine');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-2 px-3 rounded-lg text-xs font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Select for Booking
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 35: The Patient Discovery & Booking Engine */}
          <div
            id="booking-portal-engine"
            className="p-6 sm:p-8 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-6"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Patient Appointment Discovery Engine</span>
              </span>
              <h3 className="text-xl font-extrabold text-slate-900">
                Book with {clinicInfo.name}
              </h3>
              <p className="text-xs text-slate-500">
                Flow: Select Service → Select Affiliated Doctor → Choose Available Time Slot → Confirm
              </p>
            </div>

            {/* Step 1: Selected Service */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                1. Selected Service:
              </label>
              <div className="flex flex-wrap gap-2">
                {services.map((srv) => {
                  const isSelected = selectedService?.id === srv.id;
                  return (
                    <button
                      key={srv.id}
                      onClick={() => {
                        setSelectedService(srv);
                        const docs = affiliatedDocs.filter((d) =>
                          srv.associatedDoctorIds.includes(d.doctor.id)
                        );
                        if (docs.length > 0) setSelectedDoctor(docs[0].doctor);
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {srv.name} ({srv.priceCurrency} {srv.priceAmount})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select Affiliated Doctor for this Service */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                2. Select Affiliated Doctor for this Service:
              </label>

              {doctorsForSelectedService.length === 0 ? (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                  No affiliated doctor has been assigned to this service yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {doctorsForSelectedService.map(({ doctor }) => {
                    const isSelected = selectedDoctor?.id === doctor.id;
                    return (
                      <button
                        key={doctor.id}
                        type="button"
                        onClick={() => setSelectedDoctor(doctor)}
                        className={`p-3 rounded-xl border text-left flex items-center space-x-3 transition-all ${
                          isSelected
                            ? 'bg-white border-slate-900 ring-2 ring-slate-900/10 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={doctor.avatarUrl}
                          alt={doctor.name}
                          className="w-10 h-10 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {doctor.name}
                          </p>
                          <p className="text-[11px] text-slate-500">{doctor.specialty}</p>
                          <span className="text-[10px] text-emerald-600 font-semibold">
                            Contingent Verified
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Step 3: Select Time Slot */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                3. Choose Appointment Slot:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {availableSlots.map((slot) => {
                  const isSelected = selectedDate === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedDate(slot)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold text-center border transition-all ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Booking confirmation CTA */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-600">
                <span>Appointment at </span>
                <strong className="text-slate-900">{clinicInfo.name}</strong>
                <span> with </span>
                <strong className="text-slate-900">{selectedDoctor?.name || 'Selected Doctor'}</strong>
              </div>

              <button
                type="button"
                onClick={() => {
                  setBookingSuccess(true);
                  setTimeout(() => setBookingSuccess(false), 5000);
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs text-white shadow-xs transition-opacity hover:opacity-90 flex items-center justify-center space-x-1.5"
                style={{
                  backgroundColor: brandTheme.palette.primary,
                  color: brandTheme.palette.primaryContrast,
                }}
              >
                <span>Confirm Patient Booking</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {bookingSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center space-x-3 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <strong className="block text-sm">Appointment Booked Successfully!</strong>
                  Patient consultation scheduled at {clinicInfo.name} with {selectedDoctor?.name} for {selectedService?.name} at {selectedDate}.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
