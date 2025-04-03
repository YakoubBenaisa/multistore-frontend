import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../../../shared/ui/dropdown/Dropdown";
import { DropdownItem } from "../../../shared/ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../../assets/icons";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useGetStoreOrders } from "../../orders/hooks/useGetStoreOrders";

export default function MonthlySalesChart() {
  const storeId = useSelector((state: RootState) => state.user.user?.storeId) || "";
  
  // Default chart series: 12 months.
  const [series, setSeries] = useState([
    { name: "Sales", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  ]);
  
  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 4, colors: ["transparent"] },
    xaxis: {
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: { title: { text: undefined } },
    grid: { yaxis: { lines: { show: true } } },
    fill: { opacity: 1 },
    tooltip: {
      x: { show: false },
      y: {
        formatter: (val: number) => {
          return val >= 1000 ? `${(val / 1000).toFixed(1)}k` : `${val}`;
        },
      },
    },
  };

  const [isOpen, setIsOpen] = useState(false);
  function toggleDropdown() { setIsOpen(!isOpen); }
  function closeDropdown() { setIsOpen(false); }
  
  const { fetchStoreOrders } = useGetStoreOrders(storeId);
  useEffect(() => {
    const fetchOrders = async () => {
      if (!storeId) return;
      const orders = await fetchStoreOrders();
      if (orders) {
        // Initialize an array of 12 zeros for monthly sales.
        const monthlySales = new Array(12).fill(0);
        orders.forEach((order: any) => {
          const total = parseFloat(order.total_amount) || 0;
          const orderDate = new Date(order.created_at);
          const month = orderDate.getMonth(); // 0 for Jan, 11 for Dec.
          monthlySales[month] += total;
        });
        setSeries([{ name: "Sales", data: monthlySales }]);
      }
    };
    fetchOrders();
  }, [storeId, fetchStoreOrders]);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Monthly Sales
        </h3>
        <div className="relative inline-block">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
          </button>
          <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <Chart options={options} series={series} type="bar" height={180} />
        </div>
      </div>
    </div>
  );
}
