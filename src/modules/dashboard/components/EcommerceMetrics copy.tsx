import React, { useState, useEffect } from 'react';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../../assets/icons";
import Badge from "../../../shared/ui/badge/Badge";
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { customerService } from '../../customers/services/service';
import { useGetStoreOrders } from '../../orders/hooks/useGetStoreOrders';

interface MetricItemProps {
  title: string;
  fullStats: number | string;
  winMuch: number | string;
  isWin: boolean;
  Icon: React.ElementType;
}

const MetricItem: React.FC<MetricItemProps> = ({ title, fullStats, winMuch, isWin, Icon }) => {
  const storeId = useSelector((state: RootState) => state.user.user?.storeId) || '';
  const [dynamicStats, setDynamicStats] = useState<number | string>(fullStats);
  const { fetchStoreOrders } = useGetStoreOrders(storeId);

  useEffect(() => {
    const fetchStats = async () => {
      if (storeId) {
        try {
          if (title.toLowerCase() === 'customers') {
            // Fetch customers using the existing service call.
            const response = await customerService.getStoreCustomers(storeId);
            const number_customers = response.data.data.customers.length;
            setDynamicStats(number_customers);
          } else if (title.toLowerCase() === 'orders') {
            // Use the new hook to fetch orders.
            const orders = await fetchStoreOrders();
            if (orders) {
              setDynamicStats(orders.length);
            }
          }
        } catch (error) {
          console.error(`Error fetching ${title} stats:`, error);
        }
      }
    };

    fetchStats();
  }, [storeId, title, fetchStoreOrders]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
        <Icon className="text-gray-800 size-6 dark:text-white/90" />
      </div>

      <div className="flex items-end justify-between mt-5">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">{title}</span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {dynamicStats}
          </h4>
        </div>
        {isWin ? (
          <Badge color="success">
            <ArrowUpIcon />
            {winMuch}%
          </Badge>
        ) : (
          <Badge color="error">
            <ArrowDownIcon />
            {winMuch}%
          </Badge>
        )}
      </div>
    </div>
  );
};

interface EcommerceMetricsProps {
  customers?: MetricItemProps;
  orders?: MetricItemProps;
}

export default function EcommerceMetrics({
  customers = {
    title: "Customers",
    fullStats: "3,782",
    winMuch: "11.01",
    isWin: true,
    Icon: GroupIcon,
  },
  orders = {
    title: "Orders",
    fullStats: "5,359",
    winMuch: "9.05",
    isWin: false,
    Icon: BoxIconLine,
  },
}: EcommerceMetricsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      <MetricItem {...customers} />
      <MetricItem {...orders} />
    </div>
  );
}
