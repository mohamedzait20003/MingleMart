import { createSlice, isAnyOf } from '@reduxjs/toolkit';


interface User {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
};

interface Category {
    name: string;
    description: string;
}

interface Product {
    name: string;
    description: string;
    price: number;
    category: string;
    imagesURls: string[];
};

interface AdminState {
    Admins: User[];
    Customers: User[];
    Managers: User[];
    Categories: Category[];
    Products: Product[];
};

const initialState: AdminState = {
    Admins: [],
    Customers: [],
    Managers: [],
    Categories: [],
    Products: []
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,   
    reducers: {
    },
    extraReducers: (builder) => {
        // Add extra reducers here when needed
    }   
});

export default adminSlice.reducer;



