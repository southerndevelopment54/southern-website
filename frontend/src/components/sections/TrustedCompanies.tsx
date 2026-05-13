"use client";

const companies = [
  { name: "新鴻基地產", logo: "/images/clients/SHKP.png" },
  { name: "長江實業集團", logo: "/images/clients/CK.png" },
  { name: "恒基兆業地產", logo: "/images/clients/Henderson_Land_Development.png" },
  { name: "信和置業", logo: "/images/clients/SinoGroup.png" },
  { name: "太古地產", logo: "/images/clients/swire.png" },
  { name: "九龍倉集團", logo: "/images/clients/WHARF.png" },
  { name: "新世界發展", logo: "/images/clients/New%20world%20group.png" },
  { name: "港鐵公司", logo: "/images/clients/MTR.png" },
];

export default function TrustedCompanies() {
  return (
    <section className="py-16 md:py-20 bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-dark mb-3">
            客戶信賴
          </h2>
          <p className="text-gray-600">
            深受眾多知名企業及機構信賴
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8">
          {companies.map((company, index) => (
            <div
              key={index}
              className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center transition-colors duration-200 shadow-sm"
            >
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-white flex items-center justify-center mb-3 p-2">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-sm text-gray-700 text-center font-medium">
                {company.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
