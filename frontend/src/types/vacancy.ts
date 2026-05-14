export interface GuardType {
  id: number;
  typeName: string;
}

export interface District {
  id: number;
  districtName: string;
  region: string;
}

export interface Vacancy {
  id: number;
  title: string;
  guardType: GuardType;
  district: District;
  locationDescription: string;
  locationDisplay: string;
  startDate: string;
  salaryMin: number;
  salaryMax: number;
  salaryDisplay: string;
  salaryPeriod: string;
  employmentType: string;
  jobType: string;
  workingHours: string;
  requirements: string[];
  description: string;
  contactPhone: string;
  contactEmail: string;
  isActive: boolean;
  isFeatured: boolean;
  isUrgent: boolean;
  imageKey: string;
  imageUrl: string;
  createdAt: string;
  expiresAt: string;
  createdBy: number;
}
