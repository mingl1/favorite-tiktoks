import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function SkeletonCard(n: number) {
  return Array(n)
    .fill(0)
    .map((_, i) => (
      <div
        className={`flex min-h-[500px] max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20`}
        key={i + 33}
      >
        <Skeleton className="font-boldr text-4xl" />
        <div className="  min-h-[540px] min-w-[300px]">
          <Skeleton className="mx-auto" width={"95%"} height={"100%"} />
        </div>
        <div className="text-5xl">
          <Skeleton className="w-full overflow-hidden" />
        </div>
      </div>
    ));
}
