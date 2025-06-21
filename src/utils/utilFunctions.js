import { toast } from "react-toastify";
import { menus } from "./menus";

export const NEEDS_UPDATE_STRING = 'needs_update';

export const storeToken = (token) => {
    localStorage.setItem('token', token);
}

export const removeToken = () => {
    localStorage.removeItem('token');
}

export const getToken = () => {
    return localStorage.getItem('token');
}

export const showErrorToast = (message) => {
    toast.error(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
}

export const showSuccessToast = (message) => {
    toast.success(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
}


export const shouldShowMenu = (userRights, menu) => {
    let shouldShow = true;

    //    console.log('userRights', userRights);
    if (userRights.length > 0) {
        const right_code = userRights[0].right_code

        if (menu.rights && menu.rights.length !== 0 && !menu.rights.includes(right_code)) {
            shouldShow = false;
        }
    }


    return shouldShow;
}


export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
}

export const addStyleToTextField = (hasValue) => {
    return {
        '& .MuiInputLabel-root': {

            '&.Mui-focused': {
                color: ' #343434'
            },
            '&.MuiInputLabel-shrink': {
                color: ' #343434'
            },

        },
        '& .MuiInputBase-input': {
            color: 'black'
        },
        '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
                borderColor: ' #343434',
            },
            '&:hover fieldset': {
                borderColor: ' #343434'
            }

        },
        ...(hasValue && {
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: ' #343434',
            },
            '& .MuiInputLabel-root': {
                color: ' #343434',
            },
        }),
    }
}
