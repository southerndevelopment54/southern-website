"use client";

import { MapPin, Clock, DollarSign, ChevronRight, ShieldCheck } from "lucide-react";

const vacancies = [
  {
    id: 1,
    title: "住宅保安員",
    location: "九龍 / 新界各區",
    type: "全職 / 兼職",
    salary: "$15,000 - $18,000",
    requirements: ["持有效保安人員許可證（甲 / 乙級）", "一年相關經驗優先", "良好粵語溝通能力"],
    highlight: true,
  },
  {
    id: 2,
    title: "商業大廈保安員",
    location: "中環 / 尖沙咀 / 灣仔",
    type: "全職",
    salary: "$16,500 - $20,000",
    requirements: ["持有效保安人員許可證（乙級）", "懂基本英語溝通", "形象端正，有禮貌"],
    highlight: false,
  },
  {
    id: 3,
    title: "巡邏保安主任",
    location: "全港各區",
    type: "全職",
    salary: "$20,000 - $25,000",
    requirements: ["持有效保安人員許可證（丙級）", "三年以上保安經驗", "具領導及管理能力"],
    highlight: false,
  },
  {
    id: 4,
    title: "活動臨時保安員",
    location: "按活動地點分配",
    type: "兼職 / 臨時",
    salary: "$70 - $90 / 小時",
    requirements: ["持有效保安人員許可證（甲級）", "彈性工作時間", "能應付戶外工作"],
    highlight: false,
  },
];

export default function VacanciesSection() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-6">
            <ShieldCheck className="w-4 h-4" />
            職位空缺
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
            加入南方警衛團隊
          </h2>
          <p className="text-gray-600 leading-relaxed">
            我們正在招聘有志於保安行業發展的專業人才。提供具競爭力的薪酬、完善培訓及良好晉升機會，與您攜手共創安穩未來。
          </p>
        </div>

        {/* Vacancy Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {vacancies.map((job) => (
            <div
              key={job.id}
              className={`relative rounded-xl border p-6 md:p-8 transition-all duration-200 hover:shadow-lg ${
                job.highlight
                  ? "border-primary bg-primary/5"
                  : "border-gray-100 bg-off-white hover:border-primary/30"
              }`}
            >
              {job.highlight && (
                <div className="absolute -top-3 left-6">
                  <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                    急聘
                  </span>
                </div>
              )}

              <div className="flex flex-col h-full">
                {/* Title & Salary */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h3 className="text-xl font-bold text-dark">{job.title}</h3>
                  <div className="flex items-center gap-1 text-primary font-bold text-sm whitespace-nowrap">
                    <DollarSign className="w-4 h-4" />
                    {job.salary}
                  </div>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap gap-4 mb-5 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {job.type}
                  </div>
                </div>

                {/* Requirements */}
                <div className="mb-6 flex-grow">
                  <div className="text-sm font-semibold text-dark mb-2">入職要求：</div>
                  <ul className="space-y-1.5">
                    {job.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Button */}
                <a
                  href="#contact"
                  className={`inline-flex items-center justify-center gap-2 w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                    job.highlight
                      ? "bg-primary hover:bg-primary-light text-white"
                      : "bg-dark hover:bg-dark-gray text-white"
                  }`}
                >
                  立即申請
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm mb-4">
            沒有看到合適的職位？歡迎直接與我們聯絡，我們樂意為您提供更多資訊。
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            聯絡我們查詢更多
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
