import usePaymentCommon from '../utils/fun';

export default function usePaymentUpdate() {
  // Passing false calls paymentService.update (PUT)
  return usePaymentCommon(false);
}


