import  { useState, useEffect } from "react";
import { Map } from "algeria-map-ts";
import { Dropdown } from "../../../shared/ui/dropdown/Dropdown";
import { DropdownItem } from "../../../shared/ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../../assets/icons";
import { useGetStoreOrders } from "../../orders/hooks/useGetStoreOrders";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";

const assignColor = (value: number) => {
  if (value <= 1) return "#cef0d7";
  if (value <= 2) return "#7ed896";
  if (value <= 250) return "#cef0d7";
  if (value <= 500) return "#a7e4b7";
  if (value <= 1000) return "#7ed896";
  if (value <= 5000) return "#57cc76";
  return "#32c158";
};

export default function DemographicCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const storeId = useSelector((state: RootState) => state.user.user?.storeId) || "";
  const [aggregatedData, setAggregatedData] = useState<Record<string, { value: number; color: string }>>({});

  const { fetchStoreOrders } = useGetStoreOrders(storeId);

  useEffect(() => {
    async function getOrders() {
      const ordersResult = await fetchStoreOrders();
      if (ordersResult) setOrders(ordersResult);
    }
    getOrders();
  }, [fetchStoreOrders]);

  useEffect(() => {
    const counts: Record<string, number> = {};
    orders.forEach((order) => {
      const state = order.address?.state || "Unknown";
      counts[state] = (counts[state] || 0) + 1;
    });
    const coloredData = Object.entries(counts).reduce<Record<string, { value: number; color: string }>>(
      (acc, [state, value]) => {
        acc[state] = { value, color: assignColor(value) };
        return acc;
      }, {});
    setAggregatedData(coloredData);
  }, [orders]);

  const mapData = Object.keys(aggregatedData).length > 0 ? aggregatedData : {
    Adrar: { value: 54, color: assignColor(54) },
    Alger: { value: 150, color: assignColor(150) },
    Annaba: { value: 75, color: assignColor(75) },
  };

  const totalCustomers = Object.values(mapData).reduce((sum, { value }) => sum + value, 0);
  const sortedWilayas = Object.entries(mapData).sort(([, a], [, b]) => b.value - a.value).slice(0, 5);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Customers Demographic</h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">Number of customers based on wilaya</p>
        </div>
        <div className="relative inline-block">
          <button className="dropdown-toggle" onClick={() => setIsOpen(!isOpen)}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
          </button>
          <Dropdown isOpen={isOpen} onClose={() => setIsOpen(false)} className="w-40 p-2">
            <DropdownItem
              onItemClick={() => setIsOpen(false)}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={() => setIsOpen(false)}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
      <div className="px-4 py-6 my-6 overflow-hidden border border-gray-200 rounded-2xl dark:border-gray-800 sm:px-6">
        <div id="mapOne" className="mapOne map-btn -mx-4 -my-6 h-[212px] w-[252px] 2xsm:w-[307px] xsm:w-[358px] sm:-mx-6 md:w-[668px] lg:w-[634px] xl:w-[393px] 2xl:w-[554px]">
          <Map
            color="#D0D5DD"
            HoverColor="#465FFF"
            stroke="#fff"
            hoverStroke="#218c74"
            height="200px"
            width="100%"
            data={mapData}
            onWilayaClick={(wilaya, data) => console.log(wilaya, data)}
          />
        </div>
      </div>
      <div className="space-y-5">
        {sortedWilayas.map(([wilaya, { value }], index) => {
          const percentage = totalCustomers === 0 ? 0 : Math.round((value / totalCustomers) * 100);
          return (
            <div className="flex items-center justify-between" key={wilaya}>
              <div className="flex items-center gap-3">
                <div className="items-center w-full rounded-full max-w-8">
                  <img src={`./images/country/country-0${index + 1}.svg`} alt={wilaya.toLowerCase()} />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">{wilaya}</p>
                  <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                    {value.toLocaleString()} Customers
                  </span>
                </div>
              </div>
              <div className="flex w-full max-w-[140px] items-center gap-3">
                <div className="relative block h-2 w-full max-w-[100px] rounded bg-gray-200 dark:bg-gray-800">
                  <div
                    className="absolute left-0 top-0 flex h-full items-center justify-center rounded bg-brand-500 text-xs font-medium text-white"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{percentage}%</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}