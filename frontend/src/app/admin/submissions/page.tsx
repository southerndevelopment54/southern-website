"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Submission } from "@/types/submission";
import { Vacancy } from "@/types/vacancy";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useSortable } from "@/hooks/useSortable";
import SortHeader from "@/components/SortHeader";
import {
  MapPin,
  DollarSign,
  Clock,
  Calendar,
  Phone,
  Mail,
  ShieldCheck,
  AlertCircle,
  Briefcase,
  GraduationCap,
  FileText,
  Globe,
} from "lucide-react";

const statusConfig: Record<string, { label: string; className: string }> = {
  new: { label: "新申請", className: "bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200 whitespace-nowrap" },
  reviewed: { label: "已審閱", className: "bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200 whitespace-nowrap" },
  contacted: { label: "已聯絡", className: "bg-violet-50 text-violet-700 hover:bg-violet-50 border-violet-200 whitespace-nowrap" },
  hired: { label: "已聘用", className: "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200 whitespace-nowrap" },
  rejected: { label: "已拒絕", className: "bg-red-50 text-red-700 hover:bg-red-50 border-red-200 whitespace-nowrap" },
};

function InfoRow({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
      <div>
        <div className="text-xs text-slate-500">{label}</div>
        <div className="text-sm font-medium text-slate-800">{children}</div>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-3">
      {children}
    </div>
  );
}

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [vacancyDetails, setVacancyDetails] = useState<Vacancy | null>(null);
  const [vacancyLoading, setVacancyLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { sortedItems, sortKey, direction, requestSort } = useSortable(submissions);

  const fetchSubmissions = () => {
    api.get("/admin/submissions").then((res) => {
      setSubmissions(res.data.content || res.data);
    });
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    if (selected) {
      setVacancyLoading(true);
      api
        .get(`/vacancies/${selected.vacancyId}`)
        .then((res) => setVacancyDetails(res.data))
        .catch(() => setVacancyDetails(null))
        .finally(() => setVacancyLoading(false));
    } else {
      setVacancyDetails(null);
    }
  }, [selected]);

  const handleStatus = async (id: number, status: string) => {
    try {
      await api.put(`/admin/submissions/${id}/status?status=${status}&adminNotes=${encodeURIComponent(adminNotes)}`);
      toast({ title: "狀態已更新" });
      setAdminNotes("");
      setSelected(null);
      fetchSubmissions();
    } catch {
      toast({ title: "錯誤", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/admin/submissions/${deleteId}`);
      toast({ title: "已刪除" });
      setDeleteId(null);
      fetchSubmissions();
    } catch {
      toast({ title: "錯誤", description: "刪除失敗", variant: "destructive" });
    }
  };

  const pendingSubmission = submissions.find((s) => s.id === deleteId);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">申請紀錄</h1>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <SortHeader label="編號" sortKey="id" currentKey={sortKey} direction={direction} onSort={requestSort} className="w-16" />
              <SortHeader label="姓名" sortKey="firstName" currentKey={sortKey} direction={direction} onSort={requestSort} />
              <SortHeader label="職位編號" sortKey="vacancyId" currentKey={sortKey} direction={direction} onSort={requestSort} className="w-20" />
              <SortHeader label="職位" sortKey="vacancyTitle" currentKey={sortKey} direction={direction} onSort={requestSort} />
              <SortHeader label="電話" sortKey="phoneNumber" currentKey={sortKey} direction={direction} onSort={requestSort} />
              <SortHeader label="狀態" sortKey="status" currentKey={sortKey} direction={direction} onSort={requestSort} className="w-24" />
              <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap w-28">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedItems.map((s) => {
              const statusCfg = statusConfig[s.status] || { label: s.status, className: "" };
              return (
                <tr key={s.id} className="hover:bg-slate-50/60 transition-colors group">
                  <td className="px-5 py-4 text-slate-400 tabular-nums">{s.id}</td>
                  <td className="px-5 py-4">
                    <span className="font-medium text-slate-900">{s.firstName} {s.lastName}</span>
                  </td>
                  <td className="px-5 py-4 text-slate-400 tabular-nums">{s.vacancyId}</td>
                  <td className="px-5 py-4 text-slate-500">{s.vacancyTitle}</td>
                  <td className="px-5 py-4 text-slate-500">{s.phoneNumber}</td>
                  <td className="px-5 py-4">
                    <Badge className={statusCfg.className}>{statusCfg.label}</Badge>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="sm" variant="ghost" className="h-8 px-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100" onClick={() => { setSelected(s); setAdminNotes(s.adminNotes || ""); }}>
                        查看
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 px-2.5 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => setDeleteId(s.id)}>
                        刪除
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {sortedItems.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-slate-400 text-sm">
                  暫無申請紀錄
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => { setSelected(null); setAdminNotes(""); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
          {selected && (
            <>
              {/* Header */}
              <div className="px-6 pt-6 pb-4 border-b">
                <DialogHeader className="mb-1">
                  <div className="flex items-center gap-3">
                    <DialogTitle className="text-lg">申請詳情 #{selected.id}</DialogTitle>
                    <Badge className={(statusConfig[selected.status] || { className: "" }).className}>
                      {(statusConfig[selected.status] || { label: selected.status }).label}
                    </Badge>
                  </div>
                </DialogHeader>
                <p className="text-xs text-slate-500">
                  提交時間: {new Date(selected.createdAt).toLocaleString("zh-HK")}
                </p>
              </div>

              <div className="px-6 py-5 space-y-6">
                {/* Vacancy Section */}
                <section>
                  <SectionTitle>
                    <Briefcase className="w-4 h-4 text-primary" />
                    申請職位資訊
                  </SectionTitle>
                  {vacancyLoading ? (
                    <div className="text-sm text-slate-400 py-4">載入職位資料中...</div>
                  ) : vacancyDetails ? (
                    <div className="bg-slate-50 border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-slate-900">{vacancyDetails.title}</h3>
                            {vacancyDetails.isUrgent && (
                              <Badge className="bg-red-50 text-red-700 border-red-200 text-xs">急聘</Badge>
                            )}
                            {vacancyDetails.isFeatured && (
                              <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs">精選</Badge>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">職位編號: #{vacancyDetails.id}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-primary font-bold text-sm">
                            <DollarSign className="w-4 h-4" />
                            {vacancyDetails.salaryDisplay || "面議"}
                          </div>
                          <p className="text-xs text-slate-500">{vacancyDetails.salaryPeriod}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <InfoRow icon={MapPin} label="地區">
                          {vacancyDetails.district?.districtName || vacancyDetails.locationDescription || "—"}
                        </InfoRow>
                        <InfoRow icon={Clock} label="工作類型">
                          {vacancyDetails.jobType || "—"}
                        </InfoRow>
                        <InfoRow icon={Calendar} label="開始日期">
                          {vacancyDetails.startDate || "—"}
                        </InfoRow>
                        <InfoRow icon={Clock} label="工作時間">
                          {vacancyDetails.workingHours || "—"}
                        </InfoRow>
                      </div>

                      {vacancyDetails.requirements && vacancyDetails.requirements.length > 0 && (
                        <div className="pt-2 border-t border-slate-200">
                          <div className="text-xs text-slate-500 mb-1.5">入職要求</div>
                          <ul className="space-y-1">
                            {vacancyDetails.requirements.map((req, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                                <div className="w-1 h-1 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {(vacancyDetails.contactPhone || vacancyDetails.contactEmail) && (
                        <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-3">
                          {vacancyDetails.contactPhone && (
                            <InfoRow icon={Phone} label="聯絡電話">{vacancyDetails.contactPhone}</InfoRow>
                          )}
                          {vacancyDetails.contactEmail && (
                            <InfoRow icon={Mail} label="聯絡電郵">{vacancyDetails.contactEmail}</InfoRow>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-slate-50 border rounded-lg p-4">
                      <div className="flex items-center gap-2 text-amber-700 mb-1">
                        <AlertCircle className="w-4 h-4" />
                        <span className="font-medium text-sm">職位資料已無法載入</span>
                      </div>
                      <p className="text-sm text-slate-600">
                        職位編號: <span className="font-mono">#{selected.vacancyId}</span>
                      </p>
                      <p className="text-sm text-slate-600">職位名稱: {selected.vacancyTitle}</p>
                    </div>
                  )}
                </section>

                {/* Applicant Section */}
                <section>
                  <SectionTitle>
                    <GraduationCap className="w-4 h-4 text-primary" />
                    申請人資料
                  </SectionTitle>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                    <InfoRow icon={FileText} label="姓名">
                      {selected.firstName} {selected.lastName}
                    </InfoRow>
                    <InfoRow icon={Phone} label="聯絡電話">
                      {selected.phoneNumber}
                    </InfoRow>
                    <InfoRow icon={Mail} label="電郵地址">
                      {selected.email || "—"}
                    </InfoRow>
                    <InfoRow icon={GraduationCap} label="學歷">
                      {selected.educationLevel || "—"}
                    </InfoRow>
                    <InfoRow icon={Briefcase} label="相關經驗">
                      {selected.yearsOfExperience != null ? `${selected.yearsOfExperience} 年` : "—"}
                    </InfoRow>
                    <InfoRow icon={ShieldCheck} label="保安牌照">
                      {selected.hasSecurityLicense ? (
                        <span className="text-emerald-700">
                          有{selected.licenseNumber ? `（${selected.licenseNumber}）` : ""}
                        </span>
                      ) : (
                        <span className="text-slate-500">無</span>
                      )}
                    </InfoRow>
                  </div>
                </section>

                {/* Message Section */}
                {selected.message && (
                  <section>
                    <SectionTitle>
                      <FileText className="w-4 h-4 text-primary" />
                      申請人訊息
                    </SectionTitle>
                    <div className="bg-slate-50 border rounded-lg p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {selected.message}
                    </div>
                  </section>
                )}

                {/* System Info */}
                <section>
                  <SectionTitle>
                    <Globe className="w-4 h-4 text-primary" />
                    系統資訊
                  </SectionTitle>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div>
                      <span className="text-slate-500">IP 地址:</span>{" "}
                      <span className="text-slate-700 font-mono">{selected.ipAddress || "—"}</span>
                    </div>
                    {selected.reviewedAt && (
                      <div>
                        <span className="text-slate-500">審閱時間:</span>{" "}
                        <span className="text-slate-700">{new Date(selected.reviewedAt).toLocaleString("zh-HK")}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-2">
                    <span className="text-slate-500 text-sm">User-Agent:</span>{" "}
                    <span className="text-xs text-muted-foreground break-all">{selected.userAgent || "—"}</span>
                  </div>
                </section>

                {/* Admin Notes & Actions */}
                <div className="pt-4 border-t space-y-4">
                  <div>
                    <Label htmlFor="adminNotes" className="text-sm font-semibold text-slate-900 mb-1.5 block">
                      管理員備註
                    </Label>
                    <Textarea
                      id="adminNotes"
                      rows={3}
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="輸入備註..."
                      className="text-sm"
                    />
                    {selected.adminNotes && adminNotes !== selected.adminNotes && (
                      <p className="text-xs text-slate-500 mt-1">
                        現有備註: {selected.adminNotes}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => handleStatus(selected.id, "reviewed")}>標記已審閱</Button>
                    <Button size="sm" variant="outline" onClick={() => handleStatus(selected.id, "contacted")}>標記已聯絡</Button>
                    <Button size="sm" variant="outline" onClick={() => handleStatus(selected.id, "hired")}>標記已聘用</Button>
                    <Button size="sm" variant="outline" onClick={() => handleStatus(selected.id, "rejected")}>標記已拒絕</Button>
                    <Button size="sm" variant="destructive" onClick={() => { setDeleteId(selected.id); setSelected(null); }}>刪除</Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>確認刪除</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600">
            確定要刪除申請「<span className="font-semibold text-slate-900">{pendingSubmission?.firstName} {pendingSubmission?.lastName}</span>」嗎？此操作無法復原。
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)}>取消</Button>
            <Button variant="destructive" onClick={handleDelete}>確認刪除</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
