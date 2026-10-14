import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  Users,
  Search,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  Building2,
  Stethoscope,
  ChevronRight,
  ExternalLink,
  Edit2,
  Send,
  AlertCircle,
  X,
  Sparkles,
} from 'lucide-react';
import { PLATFORM_DOCTORS } from '../../data/mockData';
import { PlatformDoctor } from '../../types';

export const ScreenDoctorAffiliation: React.FC = () => {
  const {
    clinicInfo,
    brandTheme,
    affiliations,
    services,
    sendAffiliationRequest,
    acceptAffiliation,
    cancelAffiliation,
    updateDoctorAssignment,
    setCurrentStep,
  } = useClinic();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [selectedDoctorForRequest, setSelectedDoctorForRequest] = useState<PlatformDoctor | null>(null);
  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);

  // Filter platform doctors based on search
  const searchResults = PLATFORM_DOCTORS.filter((doc) => {
    const q = searchQuery.toLowerCase();
    return (
      doc.name.toLowerCase().includes(q) ||
      doc.specialty.toLowerCase().includes(q) ||
      doc.licenseNumber.toLowerCase().includes(q) ||
      doc.verificationId.toLowerCase().includes(q)
    );
  });

  const affiliatedDocs = affiliations
    .filter((a) => a.status === 'accepted')
    .map((aff) => {
      const doc = PLATFORM_DOCTORS.find((d) => d.id === aff.doctorId)!;
      return { doc, aff };
    })
    .filter((item) => Boolean(item.doc));

  const pendingDocs = affiliations
    .filter((a) => a.status === 'pending')
    .map((aff) => {
      const doc = PLATFORM_DOCTORS.find((d) => d.id === aff.doctorId)!;
      return { doc, aff };
    })
    .filter((item) => Boolean(item.doc));

  return (
    <div className="py-10 px-4 sm:px-6 max-w-5xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Doctor Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Doctors
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Connect Contingent verified physicians to your clinic and assign clinical responsibilities.
          </p>
        </div>

        <button
          id="add-doctor-modal-btn"
          onClick={() => {
            setSearchQuery('');
            setIsSearchModalOpen(true);
          }}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-xs transition-all hover:opacity-90 self-start sm:self-auto"
          style={{
            backgroundColor: brandTheme.palette.primary,
            color: brandTheme.palette.primaryContrast,
          }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Doctor</span>
        </button>
      </div>

      {/* Mandatory Platform Rule Notice */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 flex items-start space-x-3 text-xs leading-relaxed">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-900 block mb-0.5">
            Important Doctor Verification Rule:
          </span>
          The clinic does not verify doctor credentials. A doctor can be affiliated if and only if they
          already exist on Contingent and have successfully passed the platform's professional medical credential verification.
          Affiliation requests require mutual acceptance by the physician.
        </div>
      </div>

      {/* Pending Affiliation Requests */}
      {pendingDocs.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-700" />
              <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wider">
                Pending Doctor Acceptance ({pendingDocs.length})
              </h3>
            </div>
            <span className="text-xs text-amber-700">Awaiting physician review</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingDocs.map(({ doc, aff }) => (
              <div
                key={doc.id}
                className="bg-white p-4 rounded-xl border border-amber-200/80 shadow-2xs flex flex-col justify-between"
              >
                <div className="flex items-start space-x-3">
                  <img
                    src={doc.avatarUrl}
                    alt={doc.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-1.5">
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {doc.name}
                      </h4>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-sm shrink-0 flex items-center space-x-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{doc.specialty}</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Request sent: {aff.requestedAt} · License: {doc.licenseNumber}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => cancelAffiliation(doc.id)}
                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    Cancel Request
                  </button>

                  {/* Simulator action: Doctor accepts request */}
                  <button
                    onClick={() => acceptAffiliation(doc.id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center space-x-1.5"
                    title="Simulate doctor clicking Accept on their portal"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Doctor Accepts (Simulate)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Affiliated Doctors Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <span>Affiliated Doctors</span>
            <span
              className="text-xs px-2.5 py-0.5 rounded-full font-bold"
              style={{
                backgroundColor: brandTheme.palette.lightTint,
                color: brandTheme.palette.primary,
              }}
            >
              {affiliatedDocs.length}
            </span>
          </h2>

          <button
            onClick={() => setCurrentStep('services')}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center space-x-1"
          >
            <span>Proceed to Services</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {affiliatedDocs.length === 0 ? (
          /* Empty State mandated by Rule 43 */
          <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              No doctors affiliated yet
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
              Add Contingent verified doctors to start offering clinic services and appointments to patients.
            </p>
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs inline-flex items-center space-x-1.5"
              style={{
                backgroundColor: brandTheme.palette.primary,
                color: brandTheme.palette.primaryContrast,
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Doctor</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {affiliatedDocs.map(({ doc, aff }) => {
              const isEditing = editingDoctorId === doc.id;
              const assignedServices = services.filter((s) =>
                s.associatedDoctorIds.includes(doc.id)
              );

              return (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top doctor header */}
                    <div className="flex items-start space-x-3.5">
                      <img
                        src={doc.avatarUrl}
                        alt={doc.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-2xs"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-1.5">
                          <h3 className="text-base font-bold text-slate-900 truncate">
                            {doc.name}
                          </h3>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-sm shrink-0 flex items-center space-x-0.5">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Verified</span>
                          </span>
                        </div>
                        <p className="text-xs font-medium text-slate-600">
                          {doc.specialty}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {doc.education} · {doc.experienceYears} yrs experience
                        </p>
                      </div>
                    </div>

                    {/* Affiliation relationship pill */}
                    <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-2">
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Department:</span>
                        <span className="font-semibold text-slate-900">{aff.department}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Facility Branch:</span>
                        <span className="font-semibold text-slate-900">{aff.branch}</span>
                      </div>
                      <div className="flex items-start justify-between text-slate-600 pt-1 border-t border-slate-200/60">
                        <span>Services:</span>
                        <div className="text-right">
                          {assignedServices.length > 0 ? (
                            assignedServices.map((s) => (
                              <span
                                key={s.id}
                                className="inline-block bg-white px-2 py-0.5 rounded-md border border-slate-200 text-[10px] font-semibold text-slate-800 ml-1 mb-1"
                              >
                                {s.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-amber-600 text-[11px]">
                              No services connected yet
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Doctor assignment action button */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setEditingDoctorId(isEditing ? null : doc.id)}
                      className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center space-x-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>{isEditing ? 'Close Assignment' : 'Assign Department & Services'}</span>
                    </button>

                    <button
                      onClick={() => cancelAffiliation(doc.id)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Inline Assignment Editor */}
                  {isEditing && (
                    <div className="mt-3 p-3.5 bg-slate-100/80 rounded-xl border border-slate-200 text-xs space-y-3">
                      <p className="font-bold text-slate-900">Configure Doctor Assignments</p>
                      
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Department:
                        </label>
                        <input
                          type="text"
                          value={aff.department}
                          onChange={(e) =>
                            updateDoctorAssignment(doc.id, { department: e.target.value })
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Branch:
                        </label>
                        <input
                          type="text"
                          value={aff.branch}
                          onChange={(e) =>
                            updateDoctorAssignment(doc.id, { branch: e.target.value })
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Associated Clinic Services:
                        </label>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {services.map((srv) => {
                            const isChecked = srv.associatedDoctorIds.includes(doc.id);
                            return (
                              <label
                                key={srv.id}
                                className="flex items-center space-x-2 text-[11px] cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    const nextIds = e.target.checked
                                      ? [...srv.associatedDoctorIds, doc.id]
                                      : srv.associatedDoctorIds.filter((id) => id !== doc.id);
                                    updateDoctorAssignment(doc.id, {
                                      assignedServiceIds: e.target.checked
                                        ? [...aff.assignedServiceIds, srv.id]
                                        : aff.assignedServiceIds.filter((id) => id !== srv.id),
                                    });
                                  }}
                                  className="rounded border-slate-300 text-slate-900"
                                />
                                <span>{srv.name}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal 1: Search Platform Doctors */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full p-6 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Find a doctor</h3>
                <p className="text-xs text-slate-500">
                  Search across verified medical doctors on the Contingent Platform.
                </p>
              </div>
              <button
                onClick={() => setIsSearchModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="my-4 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by doctor name, specialty, license, or credential ID..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-hidden"
              />
            </div>

            {/* Search Results list */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {searchResults.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No verified platform doctors matched your search.
                </div>
              ) : (
                searchResults.map((doctor) => {
                  const existingAff = affiliations.find((a) => a.doctorId === doctor.id);
                  const isAccepted = existingAff?.status === 'accepted';
                  const isPending = existingAff?.status === 'pending';

                  return (
                    <div
                      key={doctor.id}
                      className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start space-x-3">
                        <img
                          src={doctor.avatarUrl}
                          alt={doctor.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <h4 className="text-sm font-bold text-slate-900">
                              {doctor.name}
                            </h4>
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-sm flex items-center space-x-0.5">
                              <ShieldCheck className="w-3 h-3" />
                              <span>Verified by Contingent</span>
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-slate-600">
                            {doctor.specialty} · {doctor.title}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                            {doctor.credentialSummary}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center space-x-2">
                        {isAccepted ? (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                            Already Affiliated
                          </span>
                        ) : isPending ? (
                          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Pending Acceptance</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => setSelectedDoctorForRequest(doctor)}
                            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs transition-opacity hover:opacity-90"
                            style={{
                              backgroundColor: brandTheme.palette.primary,
                              color: brandTheme.palette.primaryContrast,
                            }}
                          >
                            Add to Clinic
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Doctor Affiliation Confirmation Screen (Section 22) */}
      {selectedDoctorForRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Affiliation Request
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                Add {selectedDoctorForRequest.name} to your clinic?
              </h3>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Clinic Organization:</span>
                <span className="font-bold text-slate-900">{clinicInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Doctor Specialty:</span>
                <span className="font-bold text-slate-900">{selectedDoctorForRequest.specialty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Credential Status:</span>
                <span className="font-bold text-emerald-600 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Contingent Verified</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Relationship:</span>
                <span className="font-bold text-slate-900">Clinic-affiliated doctor</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Upon sending, an official affiliation invitation will be delivered to the doctor's Contingent portal.
              The doctor must review and accept before services can be scheduled with them.
            </p>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedDoctorForRequest(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  sendAffiliationRequest(selectedDoctorForRequest.id);
                  setSelectedDoctorForRequest(null);
                  setIsSearchModalOpen(false);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-opacity hover:opacity-90 flex items-center space-x-1.5"
                style={{
                  backgroundColor: brandTheme.palette.primary,
                  color: brandTheme.palette.primaryContrast,
                }}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Affiliation Request</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
