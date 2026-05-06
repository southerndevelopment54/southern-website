export interface Submission {
  id: number;
  vacancyId: number;
  vacancyTitle: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  educationLevel?: string;
  yearsOfExperience?: number;
  hasSecurityLicense?: boolean;
  licenseNumber?: string;
  message?: string;
  status: string;
  ipAddress?: string;
  userAgent?: string;
  adminNotes?: string;
  reviewedBy?: number;
  reviewedAt?: string;
  createdAt: string;
}

export interface SubmissionFormData {
  vacancyId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  educationLevelId?: number;
  yearsOfExperience?: number;
  hasSecurityLicense?: boolean;
  licenseNumber?: string;
  message?: string;
}
