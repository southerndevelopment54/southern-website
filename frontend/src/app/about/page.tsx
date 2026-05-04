import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">關於安保公司</h1>
        <p className="text-muted-foreground mb-4">
          安保公司是一間位於香港的持牌保安公司，為全港各區提供可靠及專業的保安服務。
        </p>
        <p className="text-muted-foreground mb-4">
          我們的團隊由經驗豐富、持有有效許可證的保安人員組成，具備住宅、商業、零售及活動保安的豐富經驗。
        </p>
        <p className="text-muted-foreground">
          我們致力以誠信、警惕和卓越的精神，保障人身及財產安全。
        </p>
      </main>
      <Footer />
    </div>
  );
}
