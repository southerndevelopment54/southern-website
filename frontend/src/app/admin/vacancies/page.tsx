"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Vacancy } from "@/types/vacancy";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSortable } from "@/hooks/useSortable";
import SortHeader from "@/components/SortHeader";

export default function AdminVacanciesPage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { sortedItems, sortKey, direction, requestSort } = useSortable(vacancies);

  const fetchVacancies = () => {
    api.get("/admin/vacancies").then((res) => {
      setVacancies(res.data.content || res.data);
    });
  };

  useEffect(() => {
    fetchVacancies();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/admin/vacancies/${deleteId}`);
      toast({ title: "已刪除" });
      setDeleteId(null);
      fetchVacancies();
    } catch {
      toast({ title: "錯誤", description: "刪除失敗", variant: "destructive" });
    }
  };

  const pendingVacancy = vacancies.find((v) => v.id === deleteId);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">職位空缺</h1>
        <Link href="/admin/vacancies/new">
          <Button>新增職位空缺</Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <SortHeader label="編號" sortKey="id" currentKey={sortKey} direction={direction} onSort={requestSort} className="w-16" />
              <SortHeader label="職位名稱" sortKey="title" currentKey={sortKey} direction={direction} onSort={requestSort} />
              <SortHeader label="類型" sortKey="guardType.typeName" currentKey={sortKey} direction={direction} onSort={requestSort} />
              <SortHeader label="地區" sortKey="district.districtName" currentKey={sortKey} direction={direction} onSort={requestSort} />
              <SortHeader label="薪金" sortKey="salaryDisplay" currentKey={sortKey} direction={direction} onSort={requestSort} />
              <SortHeader label="類別" sortKey="jobType" currentKey={sortKey} direction={direction} onSort={requestSort} />
              <SortHeader label="精選" sortKey="isFeatured" currentKey={sortKey} direction={direction} onSort={requestSort} className="w-16" />
              <SortHeader label="狀態" sortKey="isActive" currentKey={sortKey} direction={direction} onSort={requestSort} className="w-20" />
              <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap w-28">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedItems.map((v) => (
              <tr key={v.id} className="hover:bg-slate-50/60 transition-colors group">
                <td className="px-5 py-4 text-slate-400 tabular-nums">{v.id}</td>
                <td className="px-5 py-4 font-medium text-slate-900">{v.title}</td>
                <td className="px-5 py-4 text-slate-500">{v.guardType?.typeName || "—"}</td>
                <td className="px-5 py-4 text-slate-500">{v.district?.districtName || "—"}</td>
                <td className="px-5 py-4 text-slate-500">
                  {v.showSalary === false ? (
                    <span className="text-slate-400 italic">不公開</span>
                  ) : (
                    v.salaryDisplay || "—"
                  )}
                </td>
                <td className="px-5 py-4 text-slate-500">{v.jobType || "—"}</td>
                <td className="px-5 py-4">
                  {v.isFeatured ? (
                    <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200 whitespace-nowrap">精選</Badge>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
                <td className="px-5 py-4">
                  {v.isActive ? (
                    <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200 whitespace-nowrap">生效中</Badge>
                  ) : (
                    <Badge variant="outline" className="text-slate-400 border-slate-200 whitespace-nowrap">已停用</Badge>
                  )}
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/vacancies/${v.id}/edit`}>
                      <Button size="sm" variant="ghost" className="h-8 px-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                        編輯
                      </Button>
                    </Link>
                    <Button size="sm" variant="ghost" className="h-8 px-2.5 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => setDeleteId(v.id)}>
                      刪除
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {sortedItems.length === 0 && (
              <tr>
                <td colSpan={9} className="px-5 py-12 text-center text-slate-400 text-sm">
                  暫無職位空缺
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>確認刪除</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600">
            確定要刪除職位「<span className="font-semibold text-slate-900">{pendingVacancy?.title}</span>」嗎？此操作無法復原。
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
