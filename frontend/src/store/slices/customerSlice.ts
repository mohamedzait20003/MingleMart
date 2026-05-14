import { createSlice, isAnyOf } from '@reduxjs/toolkit';


interface OrderItem {
    productName: string;
    quantity: number;
    price: number;
};

interface Order {
    uid: string;
    totalPrice: number;
    items: OrderItem[];
    status: string;
}

interface Customer {
    orders: Order[];
};

const initialState: Customer = {
    orders: [],
};

const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        // Add extra reducers if needed in the future
    }
});

export default customerSlice.reducer;