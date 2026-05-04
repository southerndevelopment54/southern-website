export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} 安保公司. 版權所有.
        </p>
        <p className="text-xs mt-2">
          香港持牌保安服務供應商.
        </p>
      </div>
    </footer>
  );
}
