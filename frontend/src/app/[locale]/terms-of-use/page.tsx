"use client";

import { Header, Footer } from "@/components/sections";
import { useI18n } from "@/components/I18nProvider";

export default function TermsOfUsePage() {
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
              {isEn ? "Terms of Use" : isCn ? "使用条款" : "使用條款"}
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
                  ? "Welcome to the website of Southern Services Limited ('Southern', 'we', 'us', or 'our'). By accessing or using this website, you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use this website."
                  : isCn
                  ? "欢迎浏览南方(警卫及管业)有限公司（「南方」、「我们」）的网站。您一经登入或使用本网站，即表示您同意受本使用条款约束。如您不同意本条款，请勿使用本网站。"
                  : "歡迎瀏覽南方(警衛及管業)有限公司（「南方」、「我們」）的網站。您一經登入或使用本網站，即表示您同意受本使用條款約束。如您不同意本條款，請勿使用本網站。"}
              </p>

              <h2 className="text-xl font-bold text-dark mt-8 mb-3">
                {isEn
                  ? "1. Use of Website"
                  : isCn
                  ? "1. 网站使用"
                  : "1. 網站使用"}
              </h2>
              <p>
                {isEn
                  ? "This website is provided for informational purposes regarding our security and property management services. You may use this website only for lawful purposes and in accordance with these Terms of Use. You agree not to use this website:"
                  : isCn
                  ? "本网站仅作提供我们保安及物业管理服务信息之用。您仅可为合法目的并根据本使用条款使用本网站。您同意不会："
                  : "本網站僅作提供我們保安及物業管理服務信息之用。您僅可為合法目的並根據本使用條款使用本網站。您同意不會："}
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  {isEn
                    ? "In any way that violates any applicable local, national, or international law or regulation"
                    : isCn
                    ? "以任何违反任何适用本地、国家或国际法律或法规的方式使用"
                    : "以任何違反任何適用本地、國家或國際法律或法規的方式使用"}
                </li>
                <li>
                  {isEn
                    ? "To transmit any unauthorised or unsolicited advertising or promotional material"
                    : isCn
                    ? "传送任何未经授权或未经要求的广告或推广材料"
                    : "傳送任何未經授權或未經要求的廣告或推廣材料"}
                </li>
                <li>
                  {isEn
                    ? "To attempt to gain unauthorised access to our systems or networks"
                    : isCn
                    ? "试图未经授权进入我们的系统或网络"
                    : "試圖未經授權進入我們的系統或網絡"}
                </li>
                <li>
                  {isEn
                    ? "To interfere with or disrupt the operation of this website"
                    : isCn
                    ? "干扰或破坏本网站的运作"
                    : "干擾或破壞本網站的運作"}
                </li>
              </ul>

              <h2 className="text-xl font-bold text-dark mt-8 mb-3">
                {isEn
                  ? "2. Intellectual Property"
                  : isCn
                  ? "2. 知识产权"
                  : "2. 知識產權"}
              </h2>
              <p>
                {isEn
                  ? "All content on this website, including but not limited to text, images, logos, graphics, and software, is the property of Southern or its licensors and is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any content on this website without our prior written consent."
                  : isCn
                  ? "本网站的所有内容，包括但不限于文字、图像、标志、图形及软件，均为南方或其特许人的财产，并受版权、商标及其他知识产权法律保护。未经我们事先书面同意，您不得复制、分发、修改或从本网站的任何内容创作衍生作品。"
                  : "本網站的所有內容，包括但不限於文字、圖像、標誌、圖形及軟件，均為南方或其特許人的財產，並受版權、商標及其他知識產權法律保護。未經我們事先書面同意，您不得複製、分發、修改或從本網站的任何內容創作衍生作品。"}
              </p>

              <h2 className="text-xl font-bold text-dark mt-8 mb-3">
                {isEn
                  ? "3. Accuracy of Information"
                  : isCn
                  ? "3. 信息准确性"
                  : "3. 信息準確性"}
              </h2>
              <p>
                {isEn
                  ? "While we endeavour to ensure that all information on this website is accurate and up-to-date, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information. Any reliance you place on such information is strictly at your own risk."
                  : isCn
                  ? "虽然我们致力确保本网站的所有信息准确及最新，但我们不对信息的完整性、准确性、可靠性、适用性或可用性作出任何明示或暗示的陈述或保证。您对该等信息的任何依赖均须自行承担风险。"
                  : "雖然我們致力確保本網站的所有信息準確及最新，但我們不對信息的完整性、準確性、可靠性、適用性或可用性作出任何明示或暗示的陳述或保證。您對該等信息的任何依賴均須自行承擔風險。"}
              </p>

              <h2 className="text-xl font-bold text-dark mt-8 mb-3">
                {isEn
                  ? "4. Service Enquiries and Job Applications"
                  : isCn
                  ? "4. 服务查询及职位申请"
                  : "4. 服務查詢及職位申請"}
              </h2>
              <p>
                {isEn
                  ? "All enquiries submitted through our contact form and job applications submitted through our careers page are subject to our Privacy Policy. Submitting an enquiry or application does not constitute a binding contract or employment offer. We reserve the right to respond to or disregard any submission at our sole discretion."
                  : isCn
                  ? "所有透过联络表格提交的服务查询及透过招聘页面提交的职位申请均受我们的隐私政策约束。提交查询或申请并不构成具约束力的合约或聘用要约。我们保留全权酌情回应或不予理会任何提交的权利。"
                  : "所有透過聯絡表格提交的服務查詢及透過招聘頁面提交的職位申請均受我們的隱私政策約束。提交查詢或申請並不構成具約束力的合約或聘用要約。我們保留全權酌情回應或不予理會任何提交的權利。"}
              </p>

              <h2 className="text-xl font-bold text-dark mt-8 mb-3">
                {isEn
                  ? "5. Disclaimer"
                  : isCn
                  ? "5. 免责声明"
                  : "5. 免責聲明"}
              </h2>
              <p>
                {isEn
                  ? "To the fullest extent permitted by law, Southern shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of or in connection with your use of this website. This includes, without limitation, loss of data, loss of profits, or business interruption."
                  : isCn
                  ? "在法律允许的最大范围内，南方不会因您使用本网站而引致或与之相关的任何直接、间接、附带、后果性或惩罚性损害承担责任。这包括但不限于数据损失、利润损失或业务中断。"
                  : "在法律允許的最大範圍內，南方不會因您使用本網站而引致或與之相關的任何直接、間接、附帶、後果性或懲罰性損害承擔責任。這包括但不限於數據損失、利潤損失或業務中斷。"}
              </p>

              <h2 className="text-xl font-bold text-dark mt-8 mb-3">
                {isEn
                  ? "6. Links to Third-Party Websites"
                  : isCn
                  ? "6. 第三方网站链接"
                  : "6. 第三方網站連結"}
              </h2>
              <p>
                {isEn
                  ? "This website may contain links to third-party websites for your convenience. We do not endorse or assume any responsibility for the content, privacy policies, or practices of any third-party websites. Accessing linked third-party websites is at your own risk."
                  : isCn
                  ? "本网站可能包含第三方网站的链接以方便您浏览。我们并不认可或承担任何第三方网站的内容、隐私政策或做法的任何责任。浏览连结的第三方网站须自行承担风险。"
                  : "本網站可能包含第三方網站的連結以方便您瀏覽。我們並不認可或承擔任何第三方網站的內容、隱私政策或做法的任何責任。瀏覽連結的第三方網站須自行承擔風險。"}
              </p>

              <h2 className="text-xl font-bold text-dark mt-8 mb-3">
                {isEn
                  ? "7. Modifications to Terms"
                  : isCn
                  ? "7. 条款修改"
                  : "7. 條款修改"}
              </h2>
              <p>
                {isEn
                  ? "We reserve the right to modify these Terms of Use at any time without prior notice. Your continued use of this website following any changes constitutes your acceptance of the revised terms. We encourage you to review this page periodically."
                  : isCn
                  ? "我们保留随时修改本使用条款的权利，恕不另行通知。您在任何变更后继续使用本网站，即表示您接受经修订的条款。我们建议您定期查阅本页面。"
                  : "我們保留隨時修改本使用條款的權利，恕不另行通知。您在任何變更後繼續使用本網站，即表示您接受經修訂的條款。我們建議您定期查閱本頁面。"}
              </p>

              <h2 className="text-xl font-bold text-dark mt-8 mb-3">
                {isEn
                  ? "8. Governing Law"
                  : isCn
                  ? "8. 管辖法律"
                  : "8. 管轄法律"}
              </h2>
              <p>
                {isEn
                  ? "These Terms of Use shall be governed by and construed in accordance with the laws of the Hong Kong Special Administrative Region. Any dispute arising under or in connection with these terms shall be subject to the exclusive jurisdiction of the courts of Hong Kong."
                  : isCn
                  ? "本使用条款受香港特别行政区法律管辖并据其解释。因本条款引起或与之相关的任何争议，均须接受香港法院的非专属司法管辖权管辖。"
                  : "本使用條款受香港特別行政區法律管轄並據其解釋。因本條款引起或與之相關的任何爭議，均須接受香港法院的非專屬司法管轄權管轄。"}
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
                  ? "If you have any questions about these Terms of Use, please contact us at:"
                  : isCn
                  ? "如您对本使用条款有任何疑问，请通过以下方式联络我们："
                  : "如您對本使用條款有任何疑問，請透過以下方式聯絡我們："}
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Email: info@southern.hk</li>
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
