import { Card, CardContent } from "@/components/ui/card";
import { WEATHER } from "@/lib/trip-data";

export function WeatherStrip() {
  return (
    <>
      {/* 모바일: 한 줄 스트립 */}
      <Card className="sm:hidden">
        <CardContent className="flex divide-x px-0 py-2">
          {WEATHER.map((w) => (
            <div
              key={w.label}
              className="flex flex-1 flex-col items-center gap-0.5 px-2"
            >
              <p className="text-muted-foreground text-[10px] font-bold tracking-wide uppercase">
                {w.label.split("·")[0].trim()}
              </p>
              <span className="text-xl">{w.icon}</span>
              <p className="text-xs font-semibold">
                {w.temp.split("~")[1]?.trim() ?? w.temp}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* sm 이상: 기존 그리드 */}
      <div className="hidden grid-cols-3 gap-3 sm:grid">
        {WEATHER.map((w) => (
          <Card key={w.label} className="text-center">
            <CardContent className="flex flex-col gap-1 px-3 py-4">
              <p className="text-muted-foreground text-[10px] font-bold tracking-wide uppercase">
                {w.label}
              </p>
              <div className="text-2xl">{w.icon}</div>
              <p className="text-sm font-semibold">{w.temp}</p>
              <p className="text-xs text-blue-500">{w.rain}</p>
              <p className="text-muted-foreground text-[10px]">{w.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
