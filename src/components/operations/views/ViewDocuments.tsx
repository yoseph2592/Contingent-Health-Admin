import React, { useState } from 'react';
import { useClinicOperations } from '../../../context/ClinicOperationsContext';
import {
  Search,
  FileText,
  Eye,
} from 'lucide-react';

export const ViewDocuments: React.FC = () => {
  const { documents, setPrintDocumentData, setSelectedPatientId, setActiveTab } =
    useClinicOperations();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Appointment Notes',
    'Prescriptions',
    'Lab Results',
    'Consent Forms',
    'Claims Documentation',
  ];

  const filtered = documents.filter((d) => {
    const matchesCategory = selectedCategory === 'All' || d.category === selectedCategory;
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#717171]">
          Clinical Archives
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-[#222222] mt-1">
          Documentation
        </h1>
        <p className="text-sm text-[#717171] mt-0.5">
          Immutable clinical records, certified prescriptions, lab reports, and legal consent forms
        </p>
      </div>

      {/* Filter and search */}
      <div className="border border-[#EBEBEB] rounded-2xl bg-white p-4 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#717171]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, document ID, patient, author..."
            className="w-full pl-9 pr-4 py-2 bg-[#F7F7F7] border border-transparent focus:border-[#DDDDDD] focus:bg-white rounded-full text-xs text-[#222222] placeholder-[#717171] focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedCategory(c)}
              className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
                selectedCategory === c
                  ? 'bg-[#222222] text-white'
                  : 'bg-[#F7F7F7] text-[#717171] hover:text-[#222222]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Table */}
      <div className="border border-[#EBEBEB] rounded-2xl bg-white overflow-hidden divide-y divide-[#EBEBEB] text-xs">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAFAFA] transition-colors"
          >
            <div className="flex items-start gap-3.5 min-w-0">
              <div className="p-2.5 bg-[#F7F7F7] text-[#222222] rounded-xl shrink-0 mt-0.5">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#222222] text-sm truncate">{doc.title}</span>
                  <span className="font-mono text-xs text-[#717171]">({doc.id})</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#84ebb4]/25 text-[#1fc16b]">
                    {doc.status}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#F7F7F7] text-[#717171] text-xs font-medium">
                    v{doc.version}
                  </span>
                </div>

                <p className="text-xs text-[#717171] mt-1">
                  Patient:{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPatientId(doc.patientId);
                      setActiveTab('patients');
                    }}
                    className="font-semibold text-[#222222] hover:underline"
                  >
                    {doc.patientName}
                  </button>{' '}
                  · Author: <strong className="text-[#222222] font-semibold">{doc.author}</strong> ({doc.authorRole}) · Date:{' '}
                  {doc.date}
                </p>

                <div className="flex items-center gap-3 text-xs text-[#717171] font-mono mt-1">
                  <span>Hash: {doc.verificationHash.slice(0, 20)}...</span>
                  <span>Permissions: {doc.accessPermissions.join(', ')}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                type="button"
                onClick={() => setPrintDocumentData(doc)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-[#DDDDDD] hover:border-[#222222] text-[#222222] rounded-full text-xs font-medium transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-[#717171]" />
                <span>Preview & print</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
