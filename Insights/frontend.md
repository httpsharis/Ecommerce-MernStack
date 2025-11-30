# 📚 MERN Stack E-Commerce Frontend Notes

## **Table of Contents**
1. [Project Structure](#1-project-structure)
2. [Redux Toolkit Setup](#2-redux-toolkit-setup)
3. [Authentication Flow](#3-authentication-flow)
4. [React Router Setup](#4-react-router-setup)
5. [API Calls with Axios](#5-api-calls-with-axios)
6. [Admin Panel Implementation](#6-admin-panel-implementation)
7. [Common Patterns & Best Practices](#7-common-patterns--best-practices)
8. [Error Handling](#8-error-handling)
9. [Tailwind CSS Tips](#9-tailwind-css-tips)
10. [Useful Code Snippets](#10-useful-code-snippets)

---

## **1. Project Structure**

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Admin/           # Admin-specific components
│   │   │   ├── UserManagement.jsx
│   │   │   ├── OrderManagement.jsx
│   │   │   ├── ProductManagement.jsx
│   │   │   └── EditProduct.jsx
│   │   ├── Common/          # Shared components
│   │   └── Layout/          # Layout components
│   ├── pages/               # Page components (routes)
│   ├── redux/               # Redux state management
│   │   ├── store.js         # Redux store configuration
│   │   └── slice/           # Redux slices
│   │       ├── authSlice.js
│   │       ├── adminSlice.js
│   │       ├── cartSlice.js
│   │       └── productSlice.js
│   ├── App.jsx              # Main app component
│   └── main.jsx             # Entry point
├── .env                     # Environment variables
└── package.json
```

---

## **2. Redux Toolkit Setup**

### **2.1 Store Configuration**

```javascript
// filepath: src/redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import adminReducer from './slice/adminSlice';
import cartReducer from './slice/cartSlice';
import productReducer from './slice/productSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,      // state.auth
        admin: adminReducer,    // state.admin
        cart: cartReducer,      // state.cart
        products: productReducer // state.products
    },
});

export default store;
```

### **2.2 Creating a Slice**

```javascript
// filepath: src/redux/slice/exampleSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 📌 Initial State - Define all state variables
const initialState = {
    items: [],
    selectedItem: null,
    loading: false,
    error: null,
};

// 📌 Async Thunk - For API calls
export const fetchItems = createAsyncThunk(
    'example/fetchItems',  // Action type prefix
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/items`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            return response.data;
        } catch (error) {
            // Return error message for rejected case
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// 📌 Slice - Contains reducers and extraReducers
const exampleSlice = createSlice({
    name: 'example',
    initialState,
    reducers: {
        // Synchronous actions
        clearError: (state) => {
            state.error = null;
        },
        clearSelectedItem: (state) => {
            state.selectedItem = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // 📌 Pending - When API call starts
            .addCase(fetchItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // 📌 Fulfilled - When API call succeeds
            .addCase(fetchItems.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            // 📌 Rejected - When API call fails
            .addCase(fetchItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, clearSelectedItem } = exampleSlice.actions;
export default exampleSlice.reducer;
```

### **2.3 Using Redux in Components**

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { fetchItems, clearError } from '../redux/slice/exampleSlice';

function MyComponent() {
    const dispatch = useDispatch();
    
    // 📌 Select state from Redux store
    const { items, loading, error } = useSelector((state) => state.example);
    
    // 📌 Dispatch actions
    useEffect(() => {
        dispatch(fetchItems());
    }, [dispatch]);
    
    // 📌 Handle async action results
    const handleAction = async () => {
        const result = await dispatch(someAsyncAction(data));
        
        if (result.type === 'example/someAction/fulfilled') {
            // Success!
            toast.success('Action completed!');
        } else {
            // Failed
            toast.error(result.payload || 'Action failed');
        }
    };
}
```

---

## **3. Authentication Flow**

### **3.1 Auth Slice Structure**

```javascript
// filepath: src/redux/slice/authSlice.js

const initialState = {
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

// Login Thunk
export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
                credentials
            );
            // Save token to localStorage
            localStorage.setItem('token', response.data.token);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Logout
export const logoutUser = createAsyncThunk(
    'auth/logout',
    async () => {
        localStorage.removeItem('token');
        return null;
    }
);
```

### **3.2 Protected Routes**

```javascript
// 📌 Check if user is admin before accessing admin routes
useEffect(() => {
    if (!user || user.role !== 'admin') {
        navigate('/');  // Redirect to home
    }
}, [user, navigate]);

// 📌 Check if user is logged in
useEffect(() => {
    if (!user) {
        navigate('/login');
    }
}, [user, navigate]);
```

### **3.3 Token in API Requests**

```javascript
// Always include token in protected API calls
const token = localStorage.getItem('token');

const response = await axios.get(url, {
    headers: {
        Authorization: `Bearer ${token}`,  // 📌 Bearer token format
    }
});
```

---

## **4. React Router Setup**

### **4.1 Basic Router Configuration**

```javascript
// filepath: src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Routes */}
                <Route path="/profile" element={<Profile />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="products" element={<ProductManagement />} />
                    <Route path="products/:id/edit" element={<EditProduct />} />
                    <Route path="orders" element={<OrderManagement />} />
                </Route>
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}
```

### **4.2 Navigation Hooks**

```javascript
import { useNavigate, useParams, useLocation } from 'react-router';

function MyComponent() {
    const navigate = useNavigate();  // 📌 For programmatic navigation
    const { id } = useParams();      // 📌 Get URL parameters (/products/:id)
    const location = useLocation();  // 📌 Get current location info
    
    // Navigate programmatically
    navigate('/admin/products');
    
    // Navigate with state
    navigate('/checkout', { state: { from: 'cart' } });
    
    // Go back
    navigate(-1);
}
```

### **4.3 Link Component**

```javascript
import { Link } from 'react-router';

// 📌 Use Link for navigation (not <a> tag)
<Link to="/products" className="text-blue-500 hover:underline">
    View Products
</Link>

// With dynamic ID
<Link to={`/products/${product._id}/edit`}>
    Edit
</Link>
```

---

## **5. API Calls with Axios**

### **5.1 GET Request**

```javascript
// Fetch all items
export const fetchItems = createAsyncThunk(
    'slice/fetchItems',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/items`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
```

### **5.2 POST Request**

```javascript
// Create new item
export const createItem = createAsyncThunk(
    'slice/createItem',
    async (itemData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/items`,
                itemData,  // 📌 Request body
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
```

### **5.3 PUT Request (Update)**

```javascript
// Update item
export const updateItem = createAsyncThunk(
    'slice/updateItem',
    async ({ itemId, itemData }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/items/${itemId}`,
                itemData,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
```

### **5.4 DELETE Request**

```javascript
// Delete item
export const deleteItem = createAsyncThunk(
    'slice/deleteItem',
    async (itemId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/items/${itemId}`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            return { itemId, ...response.data };  // 📌 Return ID for filtering
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
```

### **5.5 File Upload**

```javascript
const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);  // 📌 Key must match backend

    try {
        setUploading(true);
        const token = localStorage.getItem('token');
        const { data } = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',  // 📌 Important!
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        // Use data.url for the uploaded image URL
    } catch {
        toast.error('Failed to upload image');
    } finally {
        setUploading(false);
    }
};
```

---

## **6. Admin Panel Implementation**

### **6.1 User Management Pattern**

```javascript
function UserManagement() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);
    const { users = [], loading = false, error = null } = useSelector((state) => state.admin || {});

    // 📌 Form state for adding new user
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "customer"
    });

    // 📌 Fetch data on mount
    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    // 📌 Protect admin route
    useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate('/');
        }
    }, [user, navigate]);

    // 📌 Handle form input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // 📌 Handle form submit with validation
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name.trim() || !formData.email.trim()) {
            toast.error('Please fill in all fields');
            return;
        }

        const result = await dispatch(addUser(formData));

        if (result.type === 'admin/addUser/fulfilled') {
            toast.success('User added!');
            // Reset form
            setFormData({ name: "", email: "", password: "", role: "customer" });
        } else {
            toast.error(result.payload || 'Failed');
        }
    };

    // 📌 Handle delete with confirmation
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure?")) {
            const result = await dispatch(deleteUser(id));
            if (result.type === 'admin/deleteUser/fulfilled') {
                toast.success('Deleted!');
            }
        }
    };
}
```

### **6.2 Edit Page Pattern (with useParams)**

```javascript
function EditProduct() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();  // 📌 Get ID from URL

    const { selectedProduct, loading } = useSelector((state) => state.admin);

    const [productData, setProductData] = useState({
        name: "",
        price: "",
        // ... other fields
    });

    // 📌 Fetch item details on mount
    useEffect(() => {
        if (id) {
            dispatch(fetchProductDetails(id));
        }
    }, [dispatch, id]);

    // 📌 Populate form when data is loaded
    useEffect(() => {
        if (selectedProduct) {
            setProductData({
                name: selectedProduct.name || "",
                price: selectedProduct.price || "",
                // ... other fields
            });
        }
    }, [selectedProduct]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const result = await dispatch(updateProduct({
            productId: id,
            productData
        }));

        if (result.type === 'admin/updateProduct/fulfilled') {
            toast.success('Updated!');
            navigate('/admin/products');  // 📌 Redirect after success
        }
    };
}
```

### **6.3 Table with Actions**

```javascript
<table className="min-w-full text-left text-gray-500">
    <thead className="bg-gray-100 text-xs uppercase text-gray-700">
        <tr>
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Email</th>
            <th className="py-3 px-4">Role</th>
            <th className="py-3 px-4">Actions</th>
        </tr>
    </thead>
    <tbody>
        {items && items.length > 0 ? (
            items.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{item.name}</td>
                    <td className="p-4">{item.email}</td>
                    <td className="p-4">
                        {/* 📌 Inline select for quick updates */}
                        <select
                            value={item.role}
                            onChange={(e) => handleRoleChange(item._id, e.target.value)}
                            className="border rounded p-1"
                        >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                        </select>
                    </td>
                    <td className="p-4">
                        <Link
                            to={`/admin/items/${item._id}/edit`}
                            className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                        >
                            Edit
                        </Link>
                        <button
                            onClick={() => handleDelete(item._id)}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            ))
        ) : (
            <tr>
                <td colSpan={4} className="p-4 text-center">
                    No items found
                </td>
            </tr>
        )}
    </tbody>
</table>
```

---

## **7. Common Patterns & Best Practices**

### **7.1 Default Values to Prevent Errors**

```javascript
// ❌ Bad - Can crash if state.admin is undefined
const { users, loading } = useSelector((state) => state.admin);

// ✅ Good - Safe with defaults
const { users = [], loading = false, error = null } = useSelector((state) => state.admin || {});
```

### **7.2 Optional Chaining**

```javascript
// ❌ Bad - Can crash if user is null
const userName = user.name;

// ✅ Good - Safe access
const userName = user?.name || 'N/A';

// For arrays
const firstItem = items?.[0]?.name;
```

### **7.3 Conditional Rendering**

```javascript
// Loading state
if (loading) return <p>Loading...</p>;

// Error state
if (error) return <p className="text-red-500">Error: {error}</p>;

// Empty state
{items.length === 0 && <p>No items found</p>}

// Conditional display
{user && <span>Welcome, {user.name}</span>}

// Ternary for two states
{isLoggedIn ? <Dashboard /> : <Login />}
```

### **7.4 Form Handling**

```javascript
// 📌 Controlled inputs with single handler
const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
});

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: value  // 📌 Dynamic key
    }));
};

// In JSX
<input
    type="text"
    name="name"  // 📌 Must match state key
    value={formData.name}
    onChange={handleChange}
/>
```

### **7.5 Array Operations in State**

```javascript
// 📌 Add item
state.items.push(newItem);
// or
state.items = [...state.items, newItem];

// 📌 Remove item
state.items = state.items.filter(item => item._id !== itemId);

// 📌 Update item
const index = state.items.findIndex(item => item._id === updatedItem._id);
if (index !== -1) {
    state.items[index] = { ...state.items[index], ...updatedItem };
}
```

---

## **8. Error Handling**

### **8.1 Try-Catch Pattern**

```javascript
const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        const result = await dispatch(someAction(data));
        
        if (result.type === 'slice/action/fulfilled') {
            toast.success('Success!');
        } else {
            toast.error(result.payload || 'Failed');
        }
    } catch {  // 📌 No variable if not using error
        toast.error('Something went wrong');
    }
};
```

### **8.2 ESLint: Unused Variables in Catch**

```javascript
// ❌ ESLint warning: 'error' is defined but never used
} catch (error) {
    toast.error('Failed');
}

// ✅ Fix: Remove the variable
} catch {
    toast.error('Failed');
}

// ✅ Or use the error
} catch (error) {
    console.error(error);
    toast.error(error.message || 'Failed');
}
```

### **8.3 Handling Different Response Formats**

```javascript
.addCase(fetchItems.fulfilled, (state, action) => {
    state.loading = false;
    
    // 📌 Handle different API response formats
    if (Array.isArray(action.payload)) {
        state.items = action.payload;
    } else if (action.payload.items) {
        state.items = action.payload.items;
    } else if (action.payload.data) {
        state.items = action.payload.data;
    } else {
        state.items = [];
    }
})
```

---

## **9. Tailwind CSS Tips**

### **9.1 Common Classes**

```javascript
// 📌 Layout
className="max-w-7xl mx-auto p-6"           // Centered container
className="flex items-center justify-between" // Flexbox
className="grid grid-cols-3 gap-4"           // Grid

// 📌 Typography
className="text-2xl font-bold mb-6"          // Heading
className="text-gray-500"                     // Muted text
className="text-red-500"                      // Error text

// 📌 Form Inputs
className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"

// 📌 Buttons
className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50"
className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"

// 📌 Table
className="min-w-full text-left text-gray-500"
className="bg-gray-100 text-xs uppercase text-gray-700"
className="border-b hover:bg-gray-50"

// 📌 Cards/Containers
className="bg-white shadow-md rounded-lg p-6"
className="overflow-x-auto shadow-md sm:rounded-lg"
```

### **9.2 Responsive Design**

```javascript
// 📌 Mobile first approach
className="w-full md:w-1/2 lg:w-1/3"  // Full on mobile, half on tablet, third on desktop
className="hidden md:block"            // Hidden on mobile, visible on tablet+
className="text-sm md:text-base"       // Smaller text on mobile
```

### **9.3 States**

```javascript
// 📌 Hover, Focus, Disabled
className="hover:bg-blue-600"
className="focus:ring-2 focus:ring-blue-500"
className="disabled:opacity-50 disabled:cursor-not-allowed"
```

---

## **10. Useful Code Snippets**

### **10.1 Complete CRUD Slice Template**

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL;

const initialState = {
    items: [],
    selectedItem: null,
    loading: false,
    error: null,
};

// GET all
export const fetchItems = createAsyncThunk(
    'items/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${API_URL}/api/items`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// GET one
export const fetchItemById = createAsyncThunk(
    'items/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${API_URL}/api/items/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// POST
export const createItem = createAsyncThunk(
    'items/create',
    async (itemData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post(`${API_URL}/api/items`, itemData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// PUT
export const updateItem = createAsyncThunk(
    'items/update',
    async ({ id, itemData }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.put(`${API_URL}/api/items/${id}`, itemData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// DELETE
export const deleteItem = createAsyncThunk(
    'items/delete',
    async (id, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/api/items/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return { id };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const itemsSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {
        clearError: (state) => { state.error = null; },
        clearSelectedItem: (state) => { state.selectedItem = null; },
    },
    extraReducers: (builder) => {
        builder
            // Fetch All
            .addCase(fetchItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchItems.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items || action.payload;
            })
            .addCase(fetchItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch By ID
            .addCase(fetchItemById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchItemById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedItem = action.payload.item || action.payload;
            })
            .addCase(fetchItemById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createItem.pending, (state) => {
                state.loading = true;
            })
            .addCase(createItem.fulfilled, (state, action) => {
                state.loading = false;
                const newItem = action.payload.item || action.payload;
                state.items.push(newItem);
            })
            .addCase(createItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateItem.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateItem.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload.item || action.payload;
                const index = state.items.findIndex(i => i._id === updated._id);
                if (index !== -1) state.items[index] = updated;
            })
            .addCase(updateItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteItem.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteItem.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter(i => i._id !== action.payload.id);
            })
            .addCase(deleteItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, clearSelectedItem } = itemsSlice.actions;
export default itemsSlice.reducer;
```

### **10.2 Complete Management Component Template**

```javascript
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { fetchItems, createItem, deleteItem } from '../redux/slice/itemsSlice';
import { toast } from 'sonner';

function ItemManagement() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { user } = useSelector((state) => state.auth);
    const { items = [], loading = false, error = null } = useSelector((state) => state.items || {});
    
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    // Fetch on mount
    useEffect(() => {
        dispatch(fetchItems());
    }, [dispatch]);

    // Protect route
    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            toast.error('Name is required');
            return;
        }

        const result = await dispatch(createItem(formData));
        
        if (result.type.endsWith('/fulfilled')) {
            toast.success('Item created!');
            setFormData({ name: "", description: "" });
        } else {
            toast.error(result.payload || 'Failed to create');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure?")) {
            const result = await dispatch(deleteItem(id));
            if (result.type.endsWith('/fulfilled')) {
                toast.success('Deleted!');
            } else {
                toast.error('Failed to delete');
            }
        }
    };

    if (loading) return <p className="text-center p-6">Loading...</p>;
    if (error) return <p className="text-center p-6 text-red-500">Error: {error}</p>;

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Item Management</h2>
            
            {/* Add Form */}
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-6">
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                >
                    {loading ? 'Adding...' : 'Add Item'}
                </button>
            </form>
            
            {/* Table */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left">Name</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length > 0 ? items.map((item) => (
                            <tr key={item._id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3">{item.name}</td>
                                <td className="px-4 py-3">
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={2} className="px-4 py-3 text-center text-gray-500">
                                    No items found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ItemManagement;
```

---

## **Quick Reference Cheat Sheet**

| Task | Code |
|------|------|
| Get state | `useSelector((state) => state.sliceName)` |
| Dispatch action | `dispatch(actionName(payload))` |
| Navigate | `navigate('/path')` |
| Get URL param | `const { id } = useParams()` |
| Form input | `name="field"` + `value={state.field}` + `onChange={handler}` |
| Async result check | `result.type.endsWith('/fulfilled')` |
| Safe access | `object?.property \|\| 'default'` |
| Delete confirm | `if (window.confirm("Sure?")) { ... }` |
| Toast success | `toast.success('Message')` |
| Toast error | `toast.error('Message')` |

---

## **Environment Variables**

```env
# filepath: frontend/.env

VITE_BACKEND_URL=http://localhost:7000
```

**Access in code:**
```javascript
const API_URL = import.meta.env.VITE_BACKEND_URL;
```

---

**📝 Note:** Always prefix Vite environment variables with `VITE_` to make them accessible in the frontend!

---

## **Key Takeaways**

1. **Redux Toolkit** simplifies state management with slices and async thunks
2. **createAsyncThunk** handles pending/fulfilled/rejected states automatically
3. **useSelector** reads state, **useDispatch** triggers actions
4. **Optional chaining** (`?.`) prevents crashes from undefined values
5. **Default values** in destructuring prevent undefined errors
6. **Protected routes** check user authentication/role before rendering
7. **Bearer tokens** are sent in Authorization header for protected APIs
8. **FormData** is used for file uploads with `multipart/form-data`
9. **Toast notifications** provide user feedback for actions
10. **Tailwind CSS** utility classes make styling fast and consistent

---

**Happy Coding! 🚀**