import { createSlice } from "@reduxjs/toolkit"

interface StoreProps{
    
    store: {
        id: string,
        name: string,
        description: string,
        meta_integration_status: boolean,
        payment_setup_status: boolean,
       
    } | null

}

const initialState: StoreProps = {
    store: null,
}


const storeSlice = createSlice({
    name:"store",
    initialState,
    reducers: {
        setStore: (state, action) => {
            state.store = action.payload;
          },
        removeStore: (state) =>{
            state.store = null
        },
        togglepayment: (state) => {
            if (state.store) {
                state.store.payment_setup_status = !state.store.payment_setup_status;
            }
        }
    }
})


export const { setStore, removeStore, togglepayment} = storeSlice.actions ;
export default storeSlice.reducer;
