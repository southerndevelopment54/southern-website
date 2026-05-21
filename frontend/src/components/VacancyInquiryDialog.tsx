"use client";

import { useEffect, useState } from "react";
import { Send, MessageCircle } from "lucide-react";
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

interface District {
  id: number;
  districtName: string;
  region: string;
}

interface EducationLevel {
  id: number;
  levelName: string;
}

interface VacancyInquiryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  translations: {
    title: string;
    subtitle: string;
    firstName: string;
    lastName: string;
    phone: string;
    phonePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    education: string;
    educationPlaceholder: string;
    yearsOfExperience: string;
    licenseNumber: string;
    licenseNumberPlaceholder: string;
    serviceType: string;
    servicePlaceholder: string;
    districtPreference: string;
    districtPlaceholder: string;
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

const SERVICE_TYPES_ZH = [
  { value: "住宅", label: "住宅" },
  { value: "商廈/商場", label: "商廈/商場" },
  { value: "其他", label: "其他" },
];

export default function VacancyInquiryDialog({
  open,
  onOpenChange,
  translations: t,
}: VacancyInquiryDialogProps) {
  const { toast } = useToast();
  const [districts, setDistricts] = useState<District[]>([]);
  const [educationLevels, setEducationLevels] = useState<EducationLevel[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    educationLevelId: "",
    yearsOfExperience: "",
    licenseNumber: "",
    serviceType: "",
    districtPreference: "",
    message: "",
  });

  useEffect(() => {
    if (open) {
      api.get("/vacancies/districts").then((res) => {
        setDistricts(res.data || []);
      });
      api.get("/education-levels").then((res) => {
        setEducationLevels(res.data || []);
      });
    }
  }, [open]);

  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      educationLevelId: "",
      yearsOfExperience: "",
      licenseNumber: "",
      serviceType: "",
      districtPreference: "",
      message: "",
    });
  };

  const handleClose = (value: boolean) => {
    if (!value) resetForm();
    onOpenChange(value);
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.phone.trim() ||
      !form.email.trim() ||
      !form.serviceType.trim()
    ) {
      toast({
        title: t.submitFailed,
        description: t.fieldRequired,
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/vacancy-inquiries", {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        educationLevelId: form.educationLevelId ? parseInt(form.educationLevelId) : undefined,
        yearsOfExperience: form.yearsOfExperience ? parseInt(form.yearsOfExperience) : undefined,
        licenseNumber: form.licenseNumber.trim() || undefined,
        serviceType: form.serviceType,
        districtPreference: form.districtPreference || undefined,
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            {t.title}
          </DialogTitle>
          <DialogDescription>{t.subtitle}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Name row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="inq-firstName">
                {t.firstName} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="inq-firstName"
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="inq-lastName">
                {t.lastName} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="inq-lastName"
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="inq-phone">
                {t.phone} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="inq-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder={t.phonePlaceholder}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="inq-email">
                {t.email} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="inq-email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder={t.emailPlaceholder}
                required
              />
            </div>
          </div>

          {/* Education & Experience */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="inq-education">{t.education}</Label>
              <Select
                value={form.educationLevelId}
                onValueChange={(value) => handleChange("educationLevelId", value)}
              >
                <SelectTrigger id="inq-education">
                  <SelectValue placeholder={t.educationPlaceholder} />
                </SelectTrigger>
                <SelectContent position="popper" className="max-h-[200px] overflow-y-auto">
                  {educationLevels.map((level) => (
                    <SelectItem key={level.id} value={String(level.id)}>
                      {level.levelName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="inq-yearsOfExperience">{t.yearsOfExperience}</Label>
              <Input
                id="inq-yearsOfExperience"
                type="number"
                min={0}
                max={50}
                value={form.yearsOfExperience}
                onChange={(e) => handleChange("yearsOfExperience", e.target.value)}
              />
            </div>
          </div>

          {/* License Number */}
          <div className="space-y-1.5">
            <Label htmlFor="inq-licenseNumber">{t.licenseNumber}</Label>
            <Input
              id="inq-licenseNumber"
              value={form.licenseNumber}
              onChange={(e) => handleChange("licenseNumber", e.target.value)}
              placeholder={t.licenseNumberPlaceholder}
            />
          </div>

          {/* Service Type & District */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="inq-serviceType">
                {t.serviceType} <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.serviceType}
                onValueChange={(value) => handleChange("serviceType", value)}
              >
                <SelectTrigger id="inq-serviceType">
                  <SelectValue placeholder={t.servicePlaceholder} />
                </SelectTrigger>
                <SelectContent position="popper" className="max-h-[200px] overflow-y-auto">
                  {SERVICE_TYPES_ZH.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="inq-district">{t.districtPreference}</Label>
              <Select
                value={form.districtPreference}
                onValueChange={(value) => handleChange("districtPreference", value)}
              >
                <SelectTrigger id="inq-district">
                  <SelectValue placeholder={t.districtPlaceholder} />
                </SelectTrigger>
                <SelectContent position="popper" className="max-h-[200px] overflow-y-auto">
                  {districts.map((d) => (
                    <SelectItem key={d.id} value={d.districtName}>
                      {d.districtName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <Label htmlFor="inq-message">{t.message}</Label>
            <Textarea
              id="inq-message"
              value={form.message}
              onChange={(e) => handleChange("message", e.target.value)}
              placeholder={t.messagePlaceholder}
              rows={4}
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
