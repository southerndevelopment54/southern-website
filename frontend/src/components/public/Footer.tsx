export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Security Co. All rights reserved.
        </p>
        <p className="text-xs mt-2">
          Licensed security services provider in Hong Kong.
        </p>
      </div>
    </footer>
  );
}
