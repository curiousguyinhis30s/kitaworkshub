"use client";

import { useState, useEffect } from 'react';
import PortalLayout from '../components/PortalLayout';
import CertificateGenerator from '../../components/CertificateGenerator';
import { X, ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react';

interface Certificate {
  id: string;
  courseName: string;
  instructor: string;
  issuedDate: string;
  credentialId: string;
  score?: string;
  duration?: string;
  skills?: string[];
}

interface InProgress {
  id: string;
  name: string;
  progress: number;
  estimatedCompletion: string;
}

interface CertificateData {
  certificates: Certificate[];
  inProgress: InProgress[];
  stats: { earned: number; inProgress: number; totalHours: number };
}

const demoUserProfile = { name: 'Ahmad bin Abdullah', avatar: '' };

export default function CertificatesPage() {
  const [data, setData] = useState<CertificateData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setZoomLevel(1);
  const toggleFullscreen = () => setIsFullscreen(prev => !prev);

  const closeCertificate = () => {
    setSelectedCert(null);
    setZoomLevel(1);
    setIsFullscreen(false);
  };

  useEffect(() => {
    fetch('/api/portal/certificates')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <PortalLayout title="Certificates">
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-700" />
        </div>
      </PortalLayout>
    );
  }

  const certificates = data?.certificates || [];
  const inProgress = data?.inProgress || [];
  const stats = data?.stats || { earned: 0, inProgress: 0, totalHours: 0 };

  return (
    <PortalLayout title="Certificates">
      {/* Stats - Clean text, no colored pills */}
      <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
        <span>{stats.earned} earned</span>
        <span className="w-1 h-1 rounded-full bg-gray-300" />
        <span>{stats.inProgress} in progress</span>
        <span className="w-1 h-1 rounded-full bg-gray-300" />
        <span>{stats.totalHours}h learning</span>
      </div>

      {/* Earned Certificates - Card Layout */}
      {certificates.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center mb-6">
          <p className="text-gray-500">Complete a course to earn your first certificate!</p>
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {certificates.map((cert) => (
            <div key={cert.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Certificate Card - Larger, More Prominent */}
              <div className="p-6 flex items-start gap-5">
                {/* Certificate Icon - Large */}
                <div className="w-16 h-16 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-primary-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h4" />
                    <circle cx="16" cy="16" r="3" fill="currentColor" />
                  </svg>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{cert.courseName}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    Instructor: {cert.instructor} · Issued: {cert.issuedDate}
                  </p>

                  {/* Score Badge - If present */}
                  {cert.score && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 border border-primary-100 rounded-lg mb-3">
                      <span className="text-sm font-semibold text-primary-800">Score: {cert.score}</span>
                    </div>
                  )}

                  <p className="text-xs text-gray-400 font-mono">ID: {cert.credentialId}</p>
                </div>

                {/* Actions - Vertical */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => setSelectedCert(cert)}
                    className="px-4 py-2 bg-primary-700 text-white rounded-lg text-sm font-medium hover:bg-primary-800 transition-colors"
                  >
                    View Certificate
                  </button>
                  <button
                    onClick={() => {
                      const url = encodeURIComponent(`${window.location.origin}/verify/${cert.credentialId}`);
                      const text = encodeURIComponent(`I just earned my ${cert.courseName} certificate from KitaWorksHub! #learning #professional`);
                      window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}`, '_blank', 'width=600,height=600');
                    }}
                    className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Share on LinkedIn
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* In Progress */}
      {inProgress.length > 0 && (
        <>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">In Progress</h2>
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {inProgress.map((course) => (
              <div key={course.id} className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    {/* Progress ring */}
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                        <circle
                          cx="18" cy="18" r="15"
                          fill="none"
                          className="stroke-gray-100"
                          strokeWidth="3"
                        />
                        <circle
                          cx="18" cy="18" r="15"
                          fill="none"
                          className="stroke-primary-600"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray={`${course.progress * 0.94} 100`}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
                        {course.progress}%
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{course.name}</p>
                      <p className="text-xs text-gray-400">Est. completion: {course.estimatedCompletion}</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors">
                    Continue
                  </button>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary-600 transition-all duration-500"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Certificate Modal with Zoom Controls */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-auto">
          <div className={`bg-white shadow-2xl transition-all duration-300 ${
            isFullscreen
              ? 'fixed inset-0 rounded-none'
              : 'rounded-xl w-full max-w-[980px]'
          } overflow-hidden flex flex-col`}>

            {/* Header with Zoom Controls */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex justify-between items-center z-10">
              <h3 className="font-bold text-gray-900">Certificate of Completion</h3>

              {/* Zoom Controls */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 0.5}
                    className="p-1.5 hover:bg-white rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleResetZoom}
                    className="px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 min-w-[3rem]"
                    title="Reset Zoom"
                  >
                    {Math.round(zoomLevel * 100)}%
                  </button>
                  <button
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 2}
                    className="p-1.5 hover:bg-white rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={toggleFullscreen}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>

                <button
                  onClick={closeCertificate}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Zoomable Certificate Area */}
            <div className="flex-1 overflow-auto bg-gray-100 p-8">
              <div
                className="flex items-center justify-center min-h-full"
                style={{ minHeight: isFullscreen ? 'calc(100vh - 60px)' : 'auto' }}
              >
                <div
                  className="transition-transform duration-200 origin-center"
                  style={{ transform: `scale(${zoomLevel})` }}
                >
                  <CertificateGenerator
                    certificate={{
                      recipientName: demoUserProfile.name,
                      recipientAvatar: demoUserProfile.avatar || undefined,
                      courseName: selectedCert.courseName,
                      instructor: selectedCert.instructor,
                      issuedDate: selectedCert.issuedDate,
                      credentialId: selectedCert.credentialId,
                      score: selectedCert.score,
                      skills: selectedCert.skills,
                      duration: selectedCert.duration,
                    }}
                    onDownload={() => console.log('Downloaded:', selectedCert.credentialId)}
                    onShare={() => console.log('Shared:', selectedCert.credentialId)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
