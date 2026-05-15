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
        <h1 className="text-2xl font-bold">職位空缺</h1>
        <Link href="/admin/vacancies/new">
          <Button>新增職位空缺</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <SortHeader label="編號" sortKey="id" currentKey={sortKey} direction={direction} onSort={requestSort} className="w-16" />
              <SortHeader label="職位名稱" sortKey="title" currentKey={sortKey} direction={direction} onSort={requestSort} />
              <SortHeader label="類型" sortKey="guardType.typeName" currentKey={sortKey} direction={direction} onSort={requestSort} />
              <SortHeader label="地區" sortKey="district.districtName" currentKey={sortKey} direction={direction} onSort={requestSort} />
              <SortHeader label="薪金" sortKey="salaryDisplay" currentKey={sortKey} direction={direction} onSort={requestSort} />
              <SortHeader label="類別" sortKey="jobType" currentKey={sortKey} direction={direction} onSort={requestSort} />
              <SortHeader label="精選" sortKey="isFeatured" currentKey={sortKey} direction={direction} onSort={requestSort} className="w-16" />
              <SortHeader label="狀態" sortKey="isActive" currentKey={sortKey} direction={direction} onSort={requestSort} className="w-20" />
              <th className="text-right px-4 py-3 font-medium w-32">操作</th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((v) => (
              <tr key={v.id} className="border-t">
                <td className="px-4 py-3">{v.id}</td>
                <td className="px-4 py-3 font-medium">{v.title}</td>
                <td className="px-4 py-3">{v.guardType?.typeName || '-'}</td>
                <td className="px-4 py-3">{v.district?.districtName || '-'}</td>
                <td className="px-4 py-3">{v.salaryDisplay || '-'}</td>
                <td className="px-4 py-3">{v.jobType || '-'}</td>
                <td className="px-4 py-3">
                  {v.isFeatured ? <Badge>精選</Badge> : <Badge variant="secondary">-</Badge>}
                </td>
                <td className="px-4 py-3">
                  {v.isActive ? <Badge>生效中</Badge> : <Badge variant="secondary">已停用</Badge>}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Link href={`/admin/vacancies/${v.id}/edit`}>
                    <Button size="sm" variant="outline">編輯</Button>
                  </Link>
                  <Button size="sm" variant="destructive" onClick={() => setDeleteId(v.id)}>刪除</Button>
                </td>
              </tr>
            ))}
            {sortedItems.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-6 text-center text-muted-foreground">
                  暫無職位空缺。
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
          <p className="text-sm text-gray-600">
            確定要刪除職位「<span className="font-semibold text-gray-900">{pendingVacancy?.title}</span>」嗎？此操作無法復原。
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
