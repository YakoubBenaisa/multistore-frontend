//import EcommerceMetrics from "../../../modules/dashboard/components/EcommerceMetrics copy";
import MonthlySalesChart from "../../../modules/dashboard/components/MonthlySalesChart";
import StatisticsChart from "../../../modules/dashboard/components/StatisticsChart";
import MonthlyTarget from "../../../modules/dashboard/components/MonthlyTarget";
import RecentOrders from "../../../modules/dashboard/components/RecentOrders";
import DemographicCard from "../../../modules/dashboard/components/DemographicCard";
import PageMeta from "../../../shared/containers/PageMeta";

import './dashboardStyle.css';

export default function Home() {
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6 ">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          {/*<EcommerceMetrics />*/}

          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div>
      </div>
    </>
  );
}
