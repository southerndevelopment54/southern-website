"use client";

import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Vacancy {
  id: number;
  title: string;
  salaryDisplay: string;
  jobType: string;
  district: { districtName: string } | null;
  locationDescription: string;
  requirements: string[];
  isUrgent: boolean;
  isFeatured: boolean;
}

interface EducationLevel {
  id: number;
  levelName: string;
}

interface VacancyApplyDialogProps {
  vacancy: Vacancy | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  translations: {
    title: string;
    subtitle: string;
    position: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    education: string;
    educationPlaceholder: string;
    yearsOfExperience: string;
    hasSecurityLicense: string;
    licenseNumber: string;
    licenseNumberPlaceholder: string;
    message: string;
    messagePlaceholder: string;
    submit: string;
    successTitle: string;
    successMessage: string;
    submitFailed: string;
    rateLimited: string;
    rateLimitedDesc: string;
    fieldRequired: string;
  };
}

export default function VacancyApplyDialog({
  vacancy,
  open,
  onOpenChange,
  translations: t,
}: VacancyApplyDialogProps) {
  const { toast } = useToast();
  const [educationLevels, setEducationLevels] = useState<EducationLevel[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    educationLevelId: "",
    yearsOfExperience: "",
    hasSecurityLicense: false,
    licenseNumber: "",
    message: "",
  });

  useEffect(() => {
    if (open) {
      api.get("/education-levels").then((res) => {
        setEducationLevels(res.data || []);
      });
    }
  }, [open]);

  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      educationLevelId: "",
      yearsOfExperience: "",
      hasSecurityLicense: false,
      licenseNumber: "",
      message: "",
    });
  };

  const handleClose = (value: boolean) => {
    if (!value) resetForm();
    onOpenChange(value);
  };

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vacancy) return;

    if (!form.firstName.trim() || !form.lastName.trim() || !form.phoneNumber.trim()) {
      toast({
        title: t.submitFailed,
        description: t.fieldRequired,
        variant: "destructive",
      });
      return;
    }
    if (!form.licenseNumber.trim()) {
      toast({
        title: t.submitFailed,
        description: t.licenseNumberRequired || "請輸入牌照號碼。",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/submissions", {
        vacancyId: vacancy.id,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phoneNumber: form.phoneNumber.trim(),
        email: form.email.trim() || undefined,
        educationLevelId: form.educationLevelId ? parseInt(form.educationLevelId) : undefined,
        yearsOfExperience: form.yearsOfExperience ? parseInt(form.yearsOfExperience) : undefined,
        hasSecurityLicense: form.hasSecurityLicense,
        licenseNumber: form.hasSecurityLicense ? form.licenseNumber.trim() || undefined : undefined,
        message: form.message.trim() || undefined,
      });
      toast({
        title: t.successTitle,
        description: t.successMessage,
      });
      resetForm();
      onOpenChange(false);
    } catch (err) {
      const e = err as { response?: { status?: number; data?: { message?: string } } };
      if (e.response?.status === 429) {
        toast({
          title: t.rateLimited,
          description: t.rateLimitedDesc,
          variant: "destructive",
        });
      } else {
        toast({
          title: t.submitFailed,
          description: e.response?.data?.message || "",
          variant: "destructive",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!vacancy) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.subtitle}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Position (read-only) */}
          <div className="space-y-1.5">
            <Label>{t.position}</Label>
            <div className="text-sm font-semibold text-dark bg-slate-50 border rounded-md px-3 py-2">
              {vacancy.title}
            </div>
          </div>

          {/* Name row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">
                {t.firstName} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">
                {t.lastName} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="phoneNumber">
                {t.phone} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={form.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">{t.email}</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
          </div>

          {/* Education & Experience */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="education">{t.education}</Label>
              <Select
                value={form.educationLevelId}
                onValueChange={(value) => handleChange("educationLevelId", value)}
              >
                <SelectTrigger id="education">
                  <SelectValue placeholder={t.educationPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {educationLevels.map((level) => (
                    <SelectItem key={level.id} value={String(level.id)}>
                      {level.levelName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="yearsOfExperience">{t.yearsOfExperience}</Label>
              <Input
                id="yearsOfExperience"
                type="number"
                min={0}
                max={50}
                value={form.yearsOfExperience}
                onChange={(e) => handleChange("yearsOfExperience", e.target.value)}
              />
            </div>
          </div>

          {/* Security License */}
          <div className="space-y-1.5">
            <Label htmlFor="licenseNumber">
              {t.licenseNumber} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="licenseNumber"
              value={form.licenseNumber}
              onChange={(e) => handleChange("licenseNumber", e.target.value)}
              placeholder={t.licenseNumberPlaceholder}
              required
            />
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <Label htmlFor="message">{t.message}</Label>
            <Textarea
              id="message"
              value={form.message}
              onChange={(e) => handleChange("message", e.target.value)}
              placeholder={t.messagePlaceholder}
              rows={3}
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary hover:bg-primary-light text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              {submitting ? "..." : t.submit}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
