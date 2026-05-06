"use client";

export default function TopBar() {
  return (
    <div className="w-full flex text-white text-xs md:text-sm">
      <div
        className="flex items-center px-4 py-2"
        style={{ width: "70%", backgroundColor: "#1a2447" }}
      >
        <span>香港九龍新蒲崗五芳街10號新寶中心21樓7室</span>
      </div>
      <div
        className="flex items-center justify-end px-4 py-2 relative"
        style={{ width: "30%", backgroundColor: "#51db3d" }}
      >
        {/* Slash separator */}
        <div
          className="absolute left-0 top-0 bottom-0"
          style={{
            width: "20px",
            backgroundColor: "#1a2447",
            clipPath: "polygon(0 0, 100% 0, 0 100%)",
          }}
        />
        <div className="flex gap-4 ml-4">
          <span className="hover:underline cursor-pointer">FAQ</span>
          <span className="hover:underline cursor-pointer">Support</span>
        </div>
      </div>
    </div>
  );
}
