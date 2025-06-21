import { getToken } from '../utils/utilFunctions';

export const apiAddProduct = async (successCallback, errorCallback, reqData) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const formData = new FormData();

        formData.append('name', reqData.name);
        formData.append('price', reqData.price);
        formData.append('description', reqData.description);
        formData.append('quantity', reqData.quantity);
        if (reqData.image) {
            formData.append('image', reqData.image); // Make sure `reqData.image_path` is a File object
        }

        const response = await fetch(`${apiUrl}/api/products/addProduct`, {
            method: 'POST',
            headers: {
                // 'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        const data = await response.json();
        if (!data.success) {
            errorCallback(data.message);
        } else {
            successCallback(data);
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback({ success: false, message: "Failed to add product" });
    }
};

export const apiUpdateProduct = async (successCallback, errorCallback, productId, reqData) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {

        const formData = new FormData();

        formData.append('name', reqData.name);
        formData.append('price', reqData.price);
        formData.append('description', reqData.description);
        formData.append('quantity', reqData.quantity);
        if (reqData.image) {
            formData.append('image', reqData.image); // Make sure `reqData.image_path` is a File object
        }
        const response = await fetch(`${apiUrl}/api/products/updateProduct/${productId}`, {
            method: 'PUT',
            headers: {
                // 'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        const data = await response.json();
        if (!data.success) {
            errorCallback(data.message);
        } else {
            successCallback(data);
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback({ success: false, message: "Failed to update product" });
    }
};

export const apiDeleteProduct = async (successCallback, errorCallback, productId) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/products/deleteProduct/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (!data.success) {
            errorCallback(data.message);
        } else {
            successCallback(data);
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback({ success: false, message: "Failed to delete product" });
    }
};


export const apiGetProductById = async (successCallback, errorCallback, productId) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/products/getProduct/${productId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (!data.success) {
            errorCallback(data.message);
        } else {
            successCallback(data);
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback({ success: false, message: "Failed to fetch product" });
    }
};

export const apiGetProducts = async (successCallback, errorCallback) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/products/getProducts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });


        const data = await response.json();
        if (!data.success) {
            // errorCallback(data.message);
        } else {
            successCallback(data);
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback({ success: false, message: "Failed to fetch products" });
    }
};
// export const apiGetProductsForBoard = async (successCallback, errorCallback, boardId) => {
//     const apiUrl = process.env.REACT_APP_API_URL;
//     const token = getToken();
//     try {
//         const response = await fetch(`${apiUrl}/api/products/getProductsForBoard/${boardId}`, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             }
//         });


//         const data = await response.json();
//         if (!data.success) {
//             // errorCallback(data.message);
//         } else {
//             successCallback(data);
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         errorCallback({ success: false, message: "Failed to fetch products" });
//     }
// };


export const apiSearchProduct = async (successCallback, errorCallback, searchField) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/products/searchProduct?searchField=${searchField}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.status === 204) {
            successCallback([])
        } else {
            const data = await response.json();
            if (!data.success) {
                errorCallback(data.message);
            } else {
                successCallback(data.data);
            }
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback({ success: false, message: "Failed to fetch products" });
    }
};

export const apiGetPayments = async (successCallback, errorCallback) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/products/getPaymentsByMonth`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (!data.success) {
            errorCallback(data.message);
        } else {
            successCallback(data);
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback({ success: false, message: "Failed to fetch payments" });
    }
};

