"use client";

import { Header, Footer } from "@/components/sections";
import { useI18n } from "@/components/I18nProvider";

export default function PrivacyPolicyPage() {
  const { locale } = useI18n();

  const isZh = locale === "zh";
  const isCn = locale === "cn";
  const isEn = locale === "en";

  return (
    <main className="min-h-screen bg-off-white">
      <Header />

      <section className="pt-28 md:pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-dark mb-8">
              {isEn ? "Privacy Policy" : isCn ? "隐私政策" : "隱私政策"}
            </h1>

            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p>
                <strong className="text-dark">
                  {isEn
                    ? "Last Updated: June 2026"
                    : isCn
                    ? "最后更新：2026年6月"
                    : "最後更新：2026年6月"}
                </strong>
              </p>

              <p>
                {isEn
                  ? "Southern Services Limited (hereinafter referred to as 'Southern', 'we', 'us', or 'our') is committed to protecting your personal data and respecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information when you visit our website or use our services, in compliance with the Personal Data (Privacy) Ordinance (Cap. 486) of the Hong Kong Special Administrative Region."
                  : isCn
                  ? "南方(警卫及管业)有限公司（以下简称「南方」、「我们」或「本公司」）致力保障您的个人资料私隐。本隐私政策说明我们如何根据香港特别行政区《个人资料（隐私）条例》（第486章）收集、使用、储存及保护您的个人资料。"
                  : "南方(警衛及管業)有限公司（以下簡稱「南方」、「我們」或「本公司」）致力保障您的個人資料私隱。本隱私政策說明我們如何根據香港特別行政區《個人資料（私隱）條例》（第486章）收集、使用、儲存及保護您的個人資料。"}
              </p>

              <h2 className="text-xl font-bold text-dark mt-8 mb-3">
                {isEn
                  ? "1. Data Controller"
                  : isCn
                  ? "1. 资料控制者"
                  : "1. 資料控制者"}
              </h2>
              <p>
                {isEn
                  ? "The data controller responsible for your personal data is:"
                  : isCn
                  ? "负责处理您个人资料的资料控制者为："
                  : "負責處理您個人資料的資料控制者為："}
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  {isEn
                    ? "Southern Services Limited"
                    : isCn
                    ? "南方(警卫及管业)有限公司"
                    : "南方(警衛及管業)有限公司"}
                </li>
                <li>
                  {isEn
                    ? "Address: Suite 2105-2107, New Treasure Centre, 10 Ng Fong Street, San Po Kong, Kowloon, Hong Kong"
                    : isCn
                    ? "地址：香港九龙新蒲岗五芳街10号新宝中心21楼2105-2107室"
                    : "地址：香港九龍新蒲崗五芳街10號新寶中心21樓2105-2107室"}
                </li>
                {/* TODO: Re-enable when email is ready
                <li>Email: info@southern-security.hk</li>
                */}
                <li>
                  {isEn ? "Phone: " : isCn ? "电话：" : "電話："}+852 2762 8128
                </li>
              </ul>

              <h2 className="text-xl font-bold text-dark mt-8 mb-3">
                {isEn
                  ? "2. Personal Data We Collect"
                  : isCn
                  ? "2. 我们收集的个人资料"
                  : "2. 我們收集的個人資料"}
              </h2>
              <p>
                {isEn
                  ? "We may collect the following categories of personal data:"
                  : isCn
                  ? "我们可能收集以下类别的个人资料："
                  : "我們可能收集以下類別的個人資料："}
              </p>
              <h3 className="font-semibold text-dark mt-4 mb-2">
                {isEn
                  ? "2.1 Contact Form Data"
                  : isCn
                  ? "2.1 联络表格资料"
                  : "2.1 聯絡表格資料"}
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>{isEn ? "Name" : isCn ? "姓名" : "姓名"}</li>
                <li>
                  {isEn
                    ? "Company name"
                    : isCn
                    ? "公司名称"
                    : "公司名稱"}
                </li>
                <li>{isEn ? "Phone number" : isCn ? "电话号码" : "電話號碼"}</li>
                <li>{isEn ? "Email address" : isCn ? "电邮地址" : "電郵地址"}</li>
                <li>
                  {isEn ? "Message content" : isCn ? "查询内容" : "查詢內容"}
                </li>
              </ul>
              <h3 className="font-semibold text-dark mt-4 mb-2">
                {isEn
                  ? "2.2 Job Application Data"
                  : isCn
                  ? "2.2 职位申请资料"
                  : "2.2 職位申請資料"}
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>{isEn ? "Name" : isCn ? "姓名" : "姓名"}</li>
                <li>{isEn ? "Phone number" : isCn ? "电话号码" : "電話號碼"}</li>
                <li>{isEn ? "Email address" : isCn ? "电邮地址" : "電郵地址"}</li>
                <li>
                  {isEn
                    ? "Position applied for"
                    : isCn
                    ? "申请职位"
                    : "申請職位"}
                </li>
              </ul>
              <h3 className="font-semibold text-dark mt-4 mb-2">
                {isEn
                  ? "2.3 Automatically Collected Data"
                  : isCn
                  ? "2.3 自动收集的资料"
                  : "2.3 自動收集的資料"}
              </h3>
              <p>
                {isEn
                  ? "When you visit our website, we may automatically collect technical data such as your IP address, browser type, operating system, and pages visited. This data is used for website analytics and security purposes only. We do not use cookies for tracking or advertising purposes."
                  : isCn
                  ? "当您浏览本网站时，我们可能自动收集技术性资料，例如您的IP地址、浏览器类型、操作系统及浏览页面。该等资料仅用于网站分析及保安用途。我们不会使用Cookie进行追踪或广告目的。"
                  : "當您瀏覽本網站時，我們可能自動收集技術性資料，例如您的IP地址、瀏覽器類型、操作系統及瀏覽頁面。該等資料僅用於網站分析及保安用途。我們不會使用Cookie進行追蹤或廣告目的。"}
              </p>

              <h2 className="text-xl font-bold text-dark mt-8 mb-3">
                {isEn
                  ? "3. Purpose of Collection"
                  : isCn
                  ? "3. 收集目的"
                  : "3. 收集目的"}
              </h2>
              <p>
                {isEn
                  ? "We collect and use your personal data for the following purposes:"
                  : isCn
                  ? "我们收集及使用您的个人资料作以下用途："
                  : "我們收集及使用您的個人資料作以下用途："}
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  {isEn
                    ? "To respond to your enquiries and provide the security services you request"
                    : isCn
                    ? "回应您的查询并提供您要求的保安服务"
                    : "回應您的查詢並提供您要求的保安服務"}
                </li>
                <li>
                  {isEn
                    ? "To process and evaluate job applications"
                    : isCn
                    ? "处理及评估职位申请"
                    : "處理及評估職位申請"}
                </li>
                <li>
                  {isEn
                    ? "To communicate with you regarding our services"
                    : isCn
                    ? "就我们的服务与您沟通"
                    : "就我們的服務與您溝通"}
                </li>
                <li>
                  {isEn
                    ? "To comply with legal and regulatory obligations"
                    : isCn
                    ? "遵守法律及监管义务"
                    : "遵守法律及監管義務"}
                </li>
                <li>
                  {isEn
                    ? "To improve our website and services"
                    : isCn
                    ? "改善我们的网站及服务"
                    : "改善我們的網站及服務"}
                </li>
              </ul>

              <h2 className="text-xl font-bold text-dark mt-8 mb-3">
                {isEn
                  ? "4. Data Protection and Security"
                  : isCn
                  ? "4. 资料保护及安全"
                  : "4. 資料保護及安全"}
              </h2>
              <p>
                {isEn
                  ? "We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction. These measures include encrypted data transmission (SSL/TLS), access controls, and regular security assessments."
                  : isCn
                  ? "我们实施适当的技术及组织措施，以保护您的个人资料免受未经授权的查阅、更改、披露或销毁。该等措施包括加密数据传输（SSL/TLS）、存取控制及定期保安评估。"
                  : "我們實施適當的技術及組織措施，以保護您的個人資料免受未經授權的查閱、更改、披露或銷毀。該等措施包括加密數據傳輸（SSL/TLS）、存取控制及定期保安評估。"}
              </p>

              <h2 className="text-xl font-bold text-dark mt-8 mb-3">
                {isEn
                  ? "5. Data Retention"
                  : isCn
                  ? "5. 资料保存"
                  : "5. 資料保存"}
              </h2>
              <p>
                {isEn
                  ? "We retain your personal data only for as long as necessary to fulfil the purposes for which it was collected, or as required by applicable laws and regulations. Job application data is typically retained for 12 months unless you request earlier deletion."
                  : isCn
                  ? "我们仅在为实现收集目的所必需的期间内保留您的个人资料，或按适用法律及法规规定的期间保留。职位申请资料通常保存12个月，除非您要求提早删除。"
                  : "我們僅在為實現收集目的所必需的期間內保留您的個人資料，或按適用法律及法規規定的期間保留。職位申請資料通常保存12個月，除非您要求提早刪除。"}
              </p>

              <h2 className="text-xl font-bold text-dark mt-8 mb-3">
                {isEn
                  ? "6. Your Rights"
                  : isCn
                  ? "6. 您的权利"
                  : "6. 您的權利"}
              </h2>
              <p>
                {isEn
                  ? "Under the Personal Data (Privacy) Ordinance, you have the right to:"
                  : isCn
                  ? "根据《个人资料（隐私）条例》，您有权："
                  : "根據《個人資料（私隱）條例》，您有權："}
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  {isEn
                    ? "Request access to your personal data"
                    : isCn
                    ? "要求查阅您的个人资料"
                    : "要求查閱您的個人資料"}
                </li>
                <li>
                  {isEn
                    ? "Request correction of inaccurate personal data"
                    : isCn
                    ? "要求更正不准确的个人资料"
                    : "要求更正不準確的個人資料"}
                </li>
                <li>
                  {isEn
                    ? "Request cessation of processing your personal data"
                    : isCn
                    ? "要求停止使用您的个人资料"
                    : "要求停止使用您的個人資料"}
                </li>
                <li>
                  {isEn
                    ? "Object to the use of your personal data for direct marketing purposes"
                    : isCn
                    ? "反对将您的个人资料用于直接促销目的"
                    : "反對將您的個人資料用於直接促銷目的"}
                </li>
              </ul>

              <h2 className="text-xl font-bold text-dark mt-8 mb-3">
                {isEn
                  ? "7. Third-Party Disclosure"
                  : isCn
                  ? "7. 第三方披露"
                  : "7. 第三方披露"}
              </h2>
              <p>
                {isEn
                  ? "We do not sell, trade, or otherwise transfer your personal data to third parties without your consent, except where required by law or to fulfil our contractual obligations to you (e.g., sharing with regulatory authorities when legally mandated)."
                  : isCn
                  ? "未经您同意，我们不会出售、交易或以其他方式将您的个人资料转让给第三方，除非法律要求或为了履行我们对您的合约义务（例如，在法律强制要求时与监管机构分享）。"
                  : "未經您同意，我們不會出售、交易或以其他方式將您的個人資料轉讓給第三方，除非法律要求或為了履行我們對您的合約義務（例如，在法律強制要求時與監管機構分享）。"}
              </p>

              <h2 className="text-xl font-bold text-dark mt-8 mb-3">
                {isEn
                  ? "8. Changes to This Policy"
                  : isCn
                  ? "8. 政策变更"
                  : "8. 政策變更"}
              </h2>
              <p>
                {isEn
                  ? "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically."
                  : isCn
                  ? "我们可能会不时更新本隐私政策。任何变更将连同更新后的修订日期张贴于此页面。我们建议您定期查阅本政策。"
                  : "我們可能會不時更新本隱私政策。任何變更將連同更新後的修訂日期張貼於此頁面。我們建議您定期查閱本政策。"}
              </p>

              <h2 className="text-xl font-bold text-dark mt-8 mb-3">
                {isEn
                  ? "9. Contact Us"
                  : isCn
                  ? "9. 联络我们"
                  : "9. 聯絡我們"}
              </h2>
              <p>
                {isEn
                  ? "If you have any questions about this Privacy Policy or wish to exercise your data protection rights, please contact us at:"
                  : isCn
                  ? "如您对本隐私政策有任何疑问，或希望行使您的资料保护权利，请通过以下方式联络我们："
                  : "如您對本隱私政策有任何疑問，或希望行使您的資料保護權利，請透過以下方式聯絡我們："}
              </p>
              <ul className="list-disc pl-5 space-y-1">
                {/* TODO: Re-enable when email is ready
                <li>Email: info@southern-security.hk</li>
                */}
                <li>
                  {isEn ? "Phone: " : isCn ? "电话：" : "電話："}+852 2762 8128
                </li>
                <li>
                  {isEn
                    ? "Address: Suite 2105-2107, New Treasure Centre, 10 Ng Fong Street, San Po Kong, Kowloon, Hong Kong"
                    : isCn
                    ? "地址：香港九龙新蒲岗五芳街10号新宝中心21楼2105-2107室"
                    : "地址：香港九龍新蒲崗五芳街10號新寶中心21樓2105-2107室"}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
