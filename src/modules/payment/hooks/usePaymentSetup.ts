import { useDispatch } from 'react-redux';
import usePaymentCommon from '../utils/fun';
import { togglepayment } from '../../store/states/storeSlice';


export default function usePayment() {
  // Passing false calls paymentService.update (PUT)

const dispatch = useDispatch()
  const resp =  usePaymentCommon();

  if (!resp.error) dispatch(togglepayment());
  
  return resp;


}



/*export default function usePaymentUpdate() {
  // Passing false calls paymentService.update (PUT)
}*/


