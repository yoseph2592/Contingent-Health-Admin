import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  Stethoscope,
  Plus,
  Users,
  Clock,
  Tag,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  X,
  ChevronRight,
  ShieldAlert,
  Building,
} from 'lucide-react';
import { ClinicService } from '../../types';

export const ScreenServices: React.FC = () => {
  const {
    services,
    createService,
    updateService,
    deleteService,
    getAffiliatedDoctors,
    brandTheme,
    setCurrentStep,
  } = useClinic();

  const affiliatedDoctorList = getAffiliatedDoctors();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'General Medicine',
    description: '',
    durationMinutes: 30,
    priceCurrency: 'ETB',
    priceAmount: 800,
    branch: 'Main Bole Branch',
    department: 'Outpatient Care',
    status: 'active' as 'active' | 'draft',
    associatedDoctorIds: [] as string[],
  });

  const [formError, setFormError] = useState('');

  const openCreateModal = () => {
    setFormData({
      name: '',
      category: 'General Medicine',
      description: '',
      durationMinutes: 30,
      priceCurrency: 'ETB',
      priceAmount: 800,
      branch: 'Main Bole Branch',
      department: 'Outpatient Care',
      status: 'active',
      associatedDoctorIds: affiliatedDoctorList.length > 0 ? [affiliatedDoctorList[0].doctor.id] : [],
    });
    setEditingServiceId(null);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (service: ClinicService) => {
    setFormData({
      name: service.name,
      category: service.category,
      description: service.description,
      durationMinutes: service.durationMinutes,
      priceCurrency: service.priceCurrency,
      priceAmount: service.priceAmount,
      branch: service.branch,
      department: service.department,
      status: service.status,
      associatedDoctorIds: [...service.associatedDoctorIds],
    });
    setEditingServiceId(service.id);
    setFormError('');
    setIsModalOpen(true);
  };

  const toggleDoctorForService = (doctorId: string) => {
    setFormData((prev) => {
      const exists = prev.associatedDoctorIds.includes(doctorId);
      return {
        ...prev,
        associatedDoctorIds: exists
          ? prev.associatedDoctorIds.filter((id) => id !== doctorId)
          : [...prev.associatedDoctorIds, doctorId],
      };
    });
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Please provide a service title');
      return;
    }
    if (formData.associatedDoctorIds.length === 0) {
      setFormError('Rule: You must associate at least one affiliated doctor with this service');
      return;
    }

    if (editingServiceId) {
      updateService(editingServiceId, formData);
    } else {
      createService(formData);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="py-10 px-4 sm:px-6 max-w-5xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-2">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Healthcare Services</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Services
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Create the healthcare services your clinic offers and choose which affiliated doctors provide them.
          </p>
        </div>

        <button
          id="create-service-btn"
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-xs transition-all hover:opacity-90 self-start sm:self-auto"
          style={{
            backgroundColor: brandTheme.palette.primary,
            color: brandTheme.palette.primaryContrast,
          }}
        >
          <Plus className="w-4 h-4" />
          <span>Create Service</span>
        </button>
      </div>

      {/* Relational Rule Banner: Clinic -> Service -> Doctor(s) */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 flex items-start space-x-3 text-xs leading-relaxed">
        <Users className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-900 block mb-0.5">
            Service → Doctor Affiliation Relationship:
          </span>
          A service must be associated with one or more affiliated doctors who have accepted clinic credentials.
          When patients search and book this service, they choose from these designated physicians.
        </div>
      </div>

      {/* Services Table or Empty State */}
      {services.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3">
            <Stethoscope className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Create your first service
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
            Services help patients understand what your clinic offers and calculate appointment availability.
          </p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs inline-flex items-center space-x-1.5"
            style={{
              backgroundColor: brandTheme.palette.primary,
              color: brandTheme.palette.primaryContrast,
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Service</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-4 sm:px-6">Service Name</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Duration & Fee</th>
                  <th className="py-3.5 px-4">Assigned Doctors</th>
                  <th className="py-3.5 px-4">Branch</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {services.map((service) => {
                  const assignedDocs = affiliatedDoctorList.filter((item) =>
                    service.associatedDoctorIds.includes(item.doctor.id)
                  );
                  const hasNoDocs = assignedDocs.length === 0;

                  return (
                    <tr key={service.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Name & description */}
                      <td className="py-4 px-4 sm:px-6">
                        <p className="font-bold text-slate-900 text-sm">{service.name}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-1 max-w-xs">
                          {service.description}
                        </p>
                      </td>

                      {/* Department */}
                      <td className="py-4 px-4 font-medium text-slate-700">
                        {service.department}
                      </td>

                      {/* Duration & Fee */}
                      <td className="py-4 px-4">
                        <span className="font-bold text-slate-900">
                          {service.priceCurrency} {service.priceAmount}
                        </span>
                        <span className="block text-[11px] text-slate-500">
                          {service.durationMinutes} mins
                        </span>
                      </td>

                      {/* Assigned Doctors */}
                      <td className="py-4 px-4">
                        {hasNoDocs ? (
                          <span className="inline-flex items-center space-x-1 text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md font-semibold text-[10px]">
                            <AlertCircle className="w-3 h-3" />
                            <span>No doctor assigned</span>
                          </span>
                        ) : (
                          <div className="flex items-center space-x-1.5">
                            <div className="flex -space-x-2">
                              {assignedDocs.slice(0, 3).map((d) => (
                                <img
                                  key={d.doctor.id}
                                  src={d.doctor.avatarUrl}
                                  alt={d.doctor.name}
                                  title={d.doctor.name}
                                  className="w-7 h-7 rounded-full object-cover border-2 border-white ring-1 ring-slate-200 shadow-2xs"
                                />
                              ))}
                            </div>
                            <span className="text-xs font-semibold text-slate-700">
                              {assignedDocs.length} {assignedDocs.length === 1 ? 'Doctor' : 'Doctors'}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Branch */}
                      <td className="py-4 px-4 text-slate-600">
                        {service.branch}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            service.status === 'active' && !hasNoDocs
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {hasNoDocs ? 'Needs Provider' : service.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(service)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                          title="Edit Service & Doctors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteService(service.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                          title="Delete Service"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bottom navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          onClick={() => setCurrentStep('doctors')}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900"
        >
          Back to Doctors
        </button>

        <button
          onClick={() => setCurrentStep('preview')}
          className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl font-semibold text-white shadow-xs transition-all hover:opacity-90 active:scale-[0.99]"
          style={{
            backgroundColor: brandTheme.palette.primary,
            color: brandTheme.palette.primaryContrast,
          }}
        >
          <span>Preview Patient-Facing Listing</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Create / Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-xl w-full p-6 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingServiceId ? 'Edit Service' : 'Create Clinic Service'}
                </h3>
                <p className="text-xs text-slate-500">
                  Define service attributes and link qualified affiliated doctors.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="my-3 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveService} className="overflow-y-auto space-y-4 my-4 pr-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Service Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. General Medical Consultation"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="General Medicine"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="Outpatient Care"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Clinical scope, diagnostic examination, and patient intake expectations..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Duration
                  </label>
                  <select
                    value={formData.durationMinutes}
                    onChange={(e) =>
                      setFormData({ ...formData, durationMinutes: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                  >
                    <option value={15}>15 mins</option>
                    <option value={30}>30 mins</option>
                    <option value={45}>45 mins</option>
                    <option value={60}>60 mins</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Currency
                  </label>
                  <input
                    type="text"
                    value={formData.priceCurrency}
                    onChange={(e) => setFormData({ ...formData, priceCurrency: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Price Amount
                  </label>
                  <input
                    type="number"
                    value={formData.priceAmount}
                    onChange={(e) =>
                      setFormData({ ...formData, priceAmount: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                  />
                </div>
              </div>

              {/* Mandatory Doctor Association Section (Section 28) */}
              <div className="pt-3 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Who provides this service? (Mandatory) *</span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    {formData.associatedDoctorIds.length} selected
                  </span>
                </label>
                <p className="text-[11px] text-slate-500 mb-2">
                  Select which affiliated verified physicians provide this service.
                </p>

                {affiliatedDoctorList.length === 0 ? (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                    No affiliated doctors currently available. Please affiliate doctors in the Doctors tab first!
                  </div>
                ) : (
                  <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50 max-h-48 overflow-y-auto">
                    {affiliatedDoctorList.map(({ doctor }) => {
                      const isChecked = formData.associatedDoctorIds.includes(doctor.id);
                      return (
                        <label
                          key={doctor.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 hover:border-slate-300 cursor-pointer text-xs"
                        >
                          <div className="flex items-center space-x-2.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleDoctorForService(doctor.id)}
                              className="w-4 h-4 rounded border-slate-300 text-slate-900"
                            />
                            <img
                              src={doctor.avatarUrl}
                              alt={doctor.name}
                              className="w-7 h-7 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-bold text-slate-900">{doctor.name}</p>
                              <p className="text-[10px] text-slate-500">{doctor.specialty}</p>
                            </div>
                          </div>

                          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                            Verified
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="pt-4 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: brandTheme.palette.primary,
                    color: brandTheme.palette.primaryContrast,
                  }}
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
