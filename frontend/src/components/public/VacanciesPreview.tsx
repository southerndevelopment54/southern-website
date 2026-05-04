"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, DollarSign } from "lucide-react";
import Link from "next/link";

const dummyVacancies = [
  {
    id: 1,
    title: "商業大廈保安員",
    location: "中環",
    salary: "$18,000 - $22,000",
    type: "全職",
    date: "即時入職",
  },
  {
    id: 2,
    title: "屋苑巡邏員",
    location: "九龍塘",
    salary: "$16,000 - $20,000",
    type: "全職",
    date: "2026-06-01",
  },
  {
    id: 3,
    title: "商場保安主任",
    location: "旺角",
    salary: "$24,000 - $28,000",
    type: "全職",
    date: "即時入職",
  },
  {
    id: 4,
    title: "地盤看守員",
    location: "將軍澳",
    salary: "$15,000 - $18,000",
    type: "兼職",
    date: "2026-05-15",
  },
];

export default function VacanciesPreview() {
  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-purple mb-3">
            職位空缺
          </h2>
          <div className="w-16 h-1 bg-green mx-auto rounded-full" />
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            加入我們的專業團隊，一起守護香港的安全
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dummyVacancies.map((job) => (
            <Card
              key={job.id}
              className="border-0 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-purple">{job.title}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {job.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green" />
                  <span>{job.salary}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green" />
                  <span>{job.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="#">
            <Button
              variant="outline"
              className="border-purple text-purple hover:bg-purple hover:text-white"
            >
              查看更多職位
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
