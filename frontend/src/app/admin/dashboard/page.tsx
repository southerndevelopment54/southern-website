"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Stats {
  totalVacancies: number;
  activeVacancies: number;
  totalSubmissions: number;
  newSubmissionsThisWeek: number;
  submissionsByStatus: Record<string, number>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api.get("/admin/dashboard").then((res) => setStats(res.data));
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="space-x-2">
          <Link href="/admin/vacancies">
            <Button variant="outline">Manage Vacancies</Button>
          </Link>
          <Link href="/admin/submissions">
            <Button variant="outline">Manage Submissions</Button>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Vacancies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.totalVacancies ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Vacancies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.activeVacancies ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.totalSubmissions ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">New This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.newSubmissionsThisWeek ?? 0}</div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-bold mb-4">Submissions by Status</h2>
      <div className="grid md:grid-cols-5 gap-4">
        {stats && Object.entries(stats.submissionsByStatus).map(([status, count]) => (
          <Card key={status}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-sm text-muted-foreground capitalize">{status}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
