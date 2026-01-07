// lib/certificate.ts
import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import pb from './pocketbase';

// --- Types ---

export interface CertificateData {
  studentName: string;
  courseName: string;
  completionDate: string;
  instructorName: string;
  certificateId: string;
}

interface CertificateWithQR extends CertificateData {
  qrCodeUrl?: string;
}

// --- Styles ---

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 0,
    fontFamily: 'Helvetica',
  },
  container: {
    padding: 60,
    height: '100%',
    width: '100%',
    position: 'relative',
  },
  border: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    borderWidth: 4,
    borderColor: '#5F7C6B',
  },
  innerBorder: {
    position: 'absolute',
    top: 28,
    left: 28,
    right: 28,
    bottom: 28,
    borderWidth: 1,
    borderColor: '#5F7C6B',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  brandName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#5F7C6B',
    marginBottom: 10,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginBottom: 30,
  },
  certifyText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  studentName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textDecoration: 'underline',
  },
  completionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  courseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5F7C6B',
    marginBottom: 40,
    textAlign: 'center',
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 60,
    marginTop: 40,
  },
  signatureBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  signatureLine: {
    width: 150,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginBottom: 5,
  },
  signatureLabel: {
    fontSize: 10,
    color: '#666',
  },
  dateBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  idText: {
    fontSize: 8,
    color: '#999',
    marginTop: 20,
  },
});

// --- Certificate Template Component ---

const CertificateTemplate: React.FC<CertificateWithQR> = ({
  studentName,
  courseName,
  completionDate,
  instructorName,
  certificateId,
}) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Document>
      <Page size="LETTER" orientation="landscape" style={styles.page}>
        <View style={styles.border} />
        <View style={styles.innerBorder} />

        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.brandName}>KitaWorksHub</Text>
            <Text style={styles.subtitle}>Certificate of Completion</Text>

            <Text style={styles.certifyText}>This is to certify that</Text>
            <Text style={styles.studentName}>{studentName}</Text>

            <Text style={styles.completionText}>has successfully completed the course</Text>
            <Text style={styles.courseName}>{courseName}</Text>

            <View style={styles.footer}>
              <View style={styles.signatureBlock}>
                <View style={styles.signatureLine} />
                <Text style={styles.signatureLabel}>{instructorName}</Text>
                <Text style={styles.signatureLabel}>Instructor</Text>
              </View>

              <View style={styles.dateBlock}>
                <Text style={styles.dateText}>{formatDate(completionDate)}</Text>
                <View style={styles.signatureLine} />
                <Text style={styles.signatureLabel}>Date of Completion</Text>
              </View>
            </View>

            <Text style={styles.idText}>Certificate ID: {certificateId}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// --- PDF Generation Functions ---

/**
 * Generates a certificate PDF and returns it as a Buffer
 */
export async function generateCertificatePDF(data: CertificateData): Promise<Buffer> {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://kitaworkshub.com'}/verify/${data.certificateId}`;

  let qrCodeUrl: string | undefined;
  try {
    qrCodeUrl = await QRCode.toDataURL(verificationUrl);
  } catch (err) {
    console.warn('QR code generation failed:', err);
  }

  // Create the document element directly
  const document = (
    <CertificateTemplate
      {...data}
      qrCodeUrl={qrCodeUrl}
    />
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfBlob = await pdf(document as any).toBlob();
  const arrayBuffer = await pdfBlob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Generates a unique certificate ID
 */
export function generateCertificateId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 7);
  return `CERT-${timestamp}-${randomStr}`.toUpperCase();
}

/**
 * Saves the certificate to PocketBase and returns the URL
 */
export async function saveCertificate(
  data: CertificateData,
  userId: string
): Promise<{ url: string; recordId: string }> {
  const pdfBuffer = await generateCertificatePDF(data);
  const fileName = `certificate_${data.certificateId}.pdf`;

  const formData = new FormData();
  formData.append('user', userId);
  formData.append('course_name', data.courseName);
  formData.append('certificate_id', data.certificateId);
  formData.append('issued_at', new Date().toISOString());
  formData.append('file', new Blob([new Uint8Array(pdfBuffer)], { type: 'application/pdf' }), fileName);

  try {
    const record = await pb.collection('certificates').create(formData);
    const url = pb.files.getUrl(record, record.file);

    return { url, recordId: record.id };
  } catch (error) {
    console.error('Failed to save certificate:', error);
    throw new Error('Certificate save failed');
  }
}

/**
 * Verifies a certificate by its ID
 */
export async function verifyCertificate(certificateId: string): Promise<{
  valid: boolean;
  data?: {
    studentName: string;
    courseName: string;
    issuedAt: string;
  };
}> {
  try {
    const record = await pb.collection('certificates').getFirstListItem(
      `certificate_id = "${certificateId}"`,
      { expand: 'user' }
    );

    return {
      valid: true,
      data: {
        studentName: record.expand?.user?.name || 'Unknown',
        courseName: record.course_name,
        issuedAt: record.issued_at,
      },
    };
  } catch {
    return { valid: false };
  }
}
