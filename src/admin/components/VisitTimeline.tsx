import { useState } from 'react';
import { FiActivity, FiFileText, FiImage, FiDownload, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import type { PatientVisit } from '../types/patient.types';
import { formatTimelineDate, sortByDateDesc } from '../utils/dateUtils';

interface VisitTimelineProps {
  visits: PatientVisit[];
}

const VisitTimeline = ({ visits }: VisitTimelineProps) => {
  const [expandedVisits, setExpandedVisits] = useState<Set<string>>(new Set());
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const sortedVisits = sortByDateDesc(visits);

  const toggleVisit = (visitId: string) => {
    setExpandedVisits(prev => {
      const newSet = new Set(prev);
      if (newSet.has(visitId)) {
        newSet.delete(visitId);
      } else {
        newSet.add(visitId);
      }
      return newSet;
    });
  };

  if (visits.length === 0) {
    return (
      <div className="text-center py-12">
        <FiActivity className="text-5xl text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No visits recorded yet</p>
        <p className="text-gray-400 text-sm mt-1">Add a visit to start tracking medical history</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {sortedVisits.map((visit, index) => {
          const isExpanded = expandedVisits.has(visit.id);
          const hasVitals = visit.bloodPressure || visit.weight || visit.temperature || visit.pulse || visit.height;

          return (
            <div key={visit.id} className="relative">
              {/* Timeline Line */}
              {index !== sortedVisits.length - 1 && (
                <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-gray-200" />
              )}

              {/* Visit Card */}
              <div className="relative bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition">
                {/* Timeline Dot */}
                <div className="absolute left-0 top-5 w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center shadow-lg">
                  <FiActivity className="text-white text-lg" />
                </div>

                <div className="ml-14">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">{formatTimelineDate(visit.visitDate)}</p>
                      {visit.notes && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{visit.notes}</p>
                      )}
                    </div>
                    <button
                      onClick={() => toggleVisit(visit.id)}
                      className="p-2 hover:bg-white rounded-lg transition"
                    >
                      {isExpanded ? (
                        <FiChevronUp className="text-gray-600" />
                      ) : (
                        <FiChevronDown className="text-gray-600" />
                      )}
                    </button>
                  </div>

                  {/* Vital Signs Summary (Always Visible) */}
                  {hasVitals && (
                    <div className="flex flex-wrap gap-3 mb-3">
                      {visit.bloodPressure && (
                        <div className="px-3 py-1.5 bg-white rounded-lg border text-sm">
                          <span className="text-gray-500">BP:</span>{' '}
                          <span className="font-medium text-gray-900">
                            {visit.bloodPressure.systolic}/{visit.bloodPressure.diastolic}
                          </span>
                        </div>
                      )}
                      {visit.weight && (
                        <div className="px-3 py-1.5 bg-white rounded-lg border text-sm">
                          <span className="text-gray-500">Weight:</span>{' '}
                          <span className="font-medium text-gray-900">{visit.weight} kg</span>
                        </div>
                      )}
                      {visit.temperature && (
                        <div className="px-3 py-1.5 bg-white rounded-lg border text-sm">
                          <span className="text-gray-500">Temp:</span>{' '}
                          <span className="font-medium text-gray-900">{visit.temperature}°F</span>
                        </div>
                      )}
                      {visit.pulse && (
                        <div className="px-3 py-1.5 bg-white rounded-lg border text-sm">
                          <span className="text-gray-500">Pulse:</span>{' '}
                          <span className="font-medium text-gray-900">{visit.pulse} bpm</span>
                        </div>
                      )}
                      {visit.height && (
                        <div className="px-3 py-1.5 bg-white rounded-lg border text-sm">
                          <span className="text-gray-500">Height:</span>{' '}
                          <span className="font-medium text-gray-900">{visit.height} cm</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Reports Count */}
                  {visit.reports.length > 0 && (
                    <div className="text-sm text-gray-600">
                      <FiFileText className="inline mr-1" />
                      {visit.reports.length} report{visit.reports.length > 1 ? 's' : ''} attached
                    </div>
                  )}

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t space-y-4">
                      {/* Full Notes */}
                      {visit.notes && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Notes</p>
                          <p className="text-gray-700">{visit.notes}</p>
                        </div>
                      )}

                      {/* Reports */}
                      {visit.reports.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Medical Reports</p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {visit.reports.map((report) => (
                              <div
                                key={report.id}
                                className="relative group bg-white rounded-lg border overflow-hidden hover:shadow-md transition"
                              >
                                {report.fileType === 'image' ? (
                                  <div
                                    onClick={() => setLightboxImage(report.fileUrl)}
                                    className="cursor-pointer"
                                  >
                                    <img
                                      src={report.fileUrl}
                                      alt={report.fileName}
                                      className="w-full h-32 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition flex items-center justify-center">
                                      <FiImage className="text-white text-2xl opacity-0 group-hover:opacity-100 transition" />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="h-32 flex items-center justify-center bg-gray-50">
                                    <FiFileText className="text-4xl text-gray-400" />
                                  </div>
                                )}
                                <div className="p-2">
                                  <p className="text-xs text-gray-700 truncate">{report.fileName}</p>
                                  <a
                                    href={report.fileUrl}
                                    download={report.fileName}
                                    className="text-xs text-teal-600 hover:text-teal-700 flex items-center gap-1 mt-1"
                                  >
                                    <FiDownload className="text-xs" />
                                    Download
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox for Images */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
        >
          <img
            src={lightboxImage}
            alt="Report"
            className="max-w-full max-h-full object-contain"
          />
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
};

export default VisitTimeline;
