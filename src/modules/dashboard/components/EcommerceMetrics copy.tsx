import {
  ArrowDownIcon,
  ArrowUpIcon,
  GroupIcon,
} from "../../../assets/icons";
import Badge from "../../../shared/ui/badge/Badge";

export default function EcommerceMetrics(isWin: boolean, title: string, fullStats: number, winMuch: number) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {title}
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {fullStats}
            </h4>
          </div>
          {isWin ? <Badge color="success">
            <ArrowUpIcon />
            {winMuch}%
          </Badge>
          :<Badge color="error">
            <ArrowDownIcon />
          {winMuch}%
          </Badge>}
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

          {/**/}
        </div>
  );
}
