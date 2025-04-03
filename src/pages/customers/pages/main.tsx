import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../api/api';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { ProductGrid } from '../components/ProductGrid';
import { Footer } from '../components/Footer';
import { useDispatch } from 'react-redux';
import { setName } from '../../../modules/store/states/storeSlice';

export const StorePage = () => {
  const { id: storeId } = useParams();
  const [storeData, setStoreData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await api.get(`/stores/${storeId}`);
        const data = response.data.data;
        setStoreData(data);
        //dispatch(setName(data.store.name));
      } catch (err) {
        setError('Failed to load store data');
      } finally {
        setLoading(false);
      }
    };

    if (storeId) {
      fetchStoreData();
    }
  }, [storeId, dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar storeName={storeData.store.name} />
      <main className="flex-grow">
        <Hero description={storeData.store.description} />
        <div className="container mx-auto px-4 py-8">
          <ProductGrid
            title="Latest Products"
            products={storeData.products.sort(
              (a: any, b: any) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )}
          />
          <ProductGrid
            title="High Budget"
            products={storeData.products.sort(
              (a: any, b: any) => Number(b.price) - Number(a.price)
            )}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};
