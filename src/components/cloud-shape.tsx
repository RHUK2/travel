export function CloudShape({ scale, opacity }: { scale: number; opacity: number }) {
  return (
    <div style={{ transform: `scale(${scale})`, opacity, transformOrigin: "left center" }}>
      <div className="relative h-10 w-32">
        <div className="absolute inset-x-0 bottom-0 h-5 rounded-full bg-white" />
        <div className="absolute bottom-3 left-2 h-7 w-10 rounded-full bg-white" />
        <div className="absolute bottom-3 left-9 h-10 w-14 rounded-full bg-white" />
        <div className="absolute bottom-3 left-20 h-6 w-9 rounded-full bg-white" />
      </div>
    </div>
  );
}
