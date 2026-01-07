"use client";

import { useRef, useState } from 'react';
import { Download, Share2, Linkedin } from 'lucide-react';
import { Button } from './ui/button';
import html2canvas from 'html2canvas';

interface CertificateData {
  recipientName: string;
  recipientAvatar?: string;
  courseName: string;
  instructor: string;
  issuedDate: string;
  credentialId: string;
  score?: string;
  skills?: string[];
  duration?: string;
}

interface CertificateGeneratorProps {
  certificate: CertificateData;
  onDownload?: () => void;
  onShare?: () => void;
}

export default function CertificateGenerator({
  certificate,
  onDownload,
  onShare,
}: CertificateGeneratorProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadAsPNG = async () => {
    if (!certificateRef.current) return;

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 3, // Higher quality
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
        allowTaint: true,
      });

      const link = document.createElement('a');
      link.download = `KitaWorksHub-Certificate-${certificate.credentialId}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();

      onDownload?.();
    } catch (error) {
      console.error('Failed to generate certificate:', error);
      alert('Failed to generate certificate. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const shareOnLinkedIn = () => {
    const shareUrl = `${window.location.origin}/verify/${certificate.credentialId}`;
    const title = `I just earned my ${certificate.courseName} certificate from KitaWorksHub!`;
    const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent('Professional development is key to growth. #learning #professional #development')}&source=${encodeURIComponent('KitaWorksHub')}`;

    window.open(linkedInUrl, '_blank', 'width=600,height=600,scrollbars=yes');
    onShare?.();
  };

  return (
    <div className="space-y-8">
      {/* Certificate Preview - Larger, Professional Design */}
      <div
        ref={certificateRef}
        className="relative bg-white overflow-hidden shadow-2xl"
        style={{
          width: '900px',
          aspectRatio: '1.414/1', // A4 landscape ratio
        }}
      >
        {/* Border frame */}
        <div className="absolute inset-3 border-2 border-primary-200 pointer-events-none" />
        <div className="absolute inset-4 border border-primary-100 pointer-events-none" />

        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-primary-700" />

        {/* Corner accents */}
        <div className="absolute top-6 left-6 w-16 h-16 border-l-4 border-t-4 border-primary-600" />
        <div className="absolute top-6 right-6 w-16 h-16 border-r-4 border-t-4 border-primary-600" />
        <div className="absolute bottom-6 left-6 w-16 h-16 border-l-4 border-b-4 border-primary-600" />
        <div className="absolute bottom-6 right-6 w-16 h-16 border-r-4 border-b-4 border-primary-600" />

        {/* Certificate Content */}
        <div className="relative z-10 h-full flex flex-col px-16 py-12">
          {/* Header with Logo */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="w-14 h-14 bg-primary-700 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="currentColor">
                  <path d="M12 2L4 12h3v8h4v-6h2v6h4v-8h3L12 2z"/>
                </svg>
              </div>
              <div>
                <span className="text-2xl font-bold text-primary-800 tracking-tight block">
                  KitaWorksHub
                </span>
                <span className="text-xs text-gray-500 uppercase tracking-widest">
                  Professional Development
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Certificate ID</p>
              <p className="font-mono text-sm text-gray-600">{certificate.credentialId}</p>
            </div>
          </div>

          {/* Main Content - Centered */}
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <p className="text-sm text-gray-500 uppercase tracking-[0.3em] mb-4">
              Certificate of Completion
            </p>

            <p className="text-lg text-gray-500 mb-2">This is to certify that</p>

            <h1 className="text-5xl font-bold text-gray-900 mb-2 font-serif">
              {certificate.recipientName}
            </h1>
            <div className="w-32 h-1 bg-primary-600 rounded-full mb-6" />

            <p className="text-lg text-gray-500 mb-4">has successfully completed the course</p>

            <h2 className="text-3xl font-bold text-primary-700 mb-3 font-serif">
              {certificate.courseName}
            </h2>

            <p className="text-gray-500 mb-6">
              Instructor: <span className="font-medium text-gray-700">{certificate.instructor}</span>
              {certificate.duration && (
                <>
                  <span className="mx-3">•</span>
                  Duration: <span className="font-medium text-gray-700">{certificate.duration}</span>
                </>
              )}
            </p>

            {/* Score Badge - Prominent */}
            {certificate.score && (
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary-50 border-2 border-primary-200 rounded-xl mb-6">
                <span className="text-primary-600 text-sm uppercase tracking-wider">Final Score</span>
                <span className="text-2xl font-bold text-primary-700">{certificate.score}</span>
              </div>
            )}

            {/* Skills - Simple tags */}
            {certificate.skills && certificate.skills.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                {certificate.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-end justify-between pt-6 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Date Issued</p>
              <p className="text-lg font-semibold text-gray-700">{certificate.issuedDate}</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-px bg-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Authorized Signature</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Verify at</p>
              <p className="text-sm font-medium text-primary-600">kitaworkshub.com/verify</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={downloadAsPNG}
          disabled={isGenerating}
          size="lg"
          className="bg-primary-700 hover:bg-primary-800 px-8"
        >
          {isGenerating ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Generating...
            </>
          ) : (
            <>
              <Download className="w-5 h-5 mr-2" />
              Download as PNG
            </>
          )}
        </Button>
        <Button
          onClick={shareOnLinkedIn}
          variant="outline"
          size="lg"
          className="border-[#0077B5] text-[#0077B5] hover:bg-[#0077B5]/10 px-8"
        >
          <Linkedin className="w-5 h-5 mr-2" />
          Share on LinkedIn
        </Button>
      </div>
    </div>
  );
}
