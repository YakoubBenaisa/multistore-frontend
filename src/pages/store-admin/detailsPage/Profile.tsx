
import StoreInfoForm from '../../../modules/store/components/StoreInfo';
import OwnerInfo from '../../../modules/store/components/OwnerInfo';
import MetaIntegrationForm from '../../../modules/meta/components/MetaForm';
import PaymentChargilyForm from '../../../modules/payment/components/PaymentForm';


export default function StoreDetailsPage() {

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <StoreInfoForm />
        <OwnerInfo />
        <MetaIntegrationForm  />
        <PaymentChargilyForm  />
      </div>
    </div>
  );
}