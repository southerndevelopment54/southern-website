"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Vacancy } from "@/types/vacancy";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

export default function AdminVacanciesPage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);

  const fetchVacancies = () => {
    api.get("/admin/vacancies").then((res) => {
      setVacancies(res.data.content || res.data);
    });
  };

  useEffect(() => {
    fetchVacancies();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("確定要刪除此職位空缺？")) return;
    try {
      await api.delete(`/admin/vacancies/${id}`);
      toast({ title: "已刪除" });
      fetchVacancies();
    } catch {
      toast({ title: "錯誤", description: "刪除失敗", variant: "destructive" });
    }
  };

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
              <th className="text-left px-4 py-3 font-medium">編號</th>
              <th className="text-left px-4 py-3 font-medium">類型</th>
              <th className="text-left px-4 py-3 font-medium">地區</th>
              <th className="text-left px-4 py-3 font-medium">地點</th>
              <th className="text-left px-4 py-3 font-medium">狀態</th>
              <th className="text-right px-4 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {vacancies.map((v) => (
              <tr key={v.id} className="border-t">
                <td className="px-4 py-3">{v.id}</td>
                <td className="px-4 py-3">{v.guardType.typeName}</td>
                <td className="px-4 py-3">{v.district.districtName}</td>
                <td className="px-4 py-3">{v.locationDescription}</td>
                <td className="px-4 py-3">
                  {v.isActive ? <Badge>生效中</Badge> : <Badge variant="secondary">已停用</Badge>}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Link href={`/admin/vacancies/${v.id}/edit`}>
                    <Button size="sm" variant="outline">編輯</Button>
                  </Link>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(v.id)}>刪除</Button>
                </td>
              </tr>
            ))}
            {vacancies.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                  暫無職位空缺。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
