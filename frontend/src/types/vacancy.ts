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
  guardType: GuardType;
  district: District;
  locationDescription: string;
  startDate: string;
  salaryMin: number;
  salaryMax: number;
  salaryPeriod: string;
  employmentType: string;
  workingHours: string;
  requirements: string;
  description: string;
  contactPhone: string;
  contactEmail: string;
  isActive: boolean;
  isFeatured: boolean;
  imageKey: string;
  imageUrl: string;
  createdAt: string;
  expiresAt: string;
}
