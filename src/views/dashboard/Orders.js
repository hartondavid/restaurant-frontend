import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import GenericTable from "../../components/GenericTable";
import { showErrorToast, showSuccessToast } from "../../utils/utilFunctions";
import {
    Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, List,
    CircularProgress, Typography, ListItem, IconButton, ListItemText, Box, Chip, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { apiGetOrders, apiGetOrdersByWaiterId, apiDeleteOrder, apiUpdateOrderStatus } from "../../api/orders";
import { RIGHTS_MAPPING } from "../../utils/utilConstants";

import dayjs from "dayjs";
import DeleteIcon from '@mui/icons-material/Delete';
import { addStyleToTextField } from "../../utils/utilFunctions";
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';

const colorMap = {
    new: 'green',
    pending: 'orange',
    prepared: 'blue',
    done: 'red'
};


const Orders = ({ userRights }) => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [actions, setActions] = useState([]);


    const rightCode = userRights[0]?.right_code;

    const [openDialog, setOpenDialog] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);
    const [openChangeStatusDialog, setOpenChangeStatusDialog] = useState(false);
    const [orderToUpdate, setOrderToUpdate] = useState(null);
    const [formData, setFormData] = useState({
        status: 'new'
    });


    useEffect(() => {
        if (rightCode === RIGHTS_MAPPING.WAITER) {
            apiGetOrdersByWaiterId((response) => {
                console.log('response', response);
                setData(response.data)
            }, showErrorToast);

        } else if (rightCode === RIGHTS_MAPPING.MANAGER) {
            apiGetOrders((response) => {
                setData(response.data)
            }, showErrorToast);

            let actionsTmp = [];

            actionsTmp = [

                { icon: <DeleteIcon />, color: 'red', onClick: handleOpenDialog },

            ];

            setActions(actionsTmp);
        } else if (rightCode === RIGHTS_MAPPING.CHEF) {
            apiGetOrders((response) => {
                setData(response.data)
            }, showErrorToast);
        }

    }, [data.length, rightCode]);


    const childrenData = data.reduce((acc, order) => {
        const orderId = order.id;

        if (!acc[orderId]) {
            acc[orderId] = [];
        }
        if (order.orderItems && Array.isArray(order.orderItems)) {
            acc[orderId].push(
                ...order.orderItems.map((orderItem, idx) => ({
                    id: orderItem.id || `${orderId}-${idx}`,
                    name: orderItem.name,
                    price: ` ${orderItem.price} lei`,
                    quantity: ` ${orderItem.quantity} grame`,
                    image: orderItem.image,

                }))
            );

        }
        return acc;
    }, {});


    console.log('childrenData', childrenData);



    const childrenColumns = [
        { field: 'name', headerName: 'Nume', type: 'string' },
        { field: 'image', headerName: 'Imagine', type: 'filepath' },
        { field: 'price', headerName: 'Pret', type: 'number' },
        { field: 'quantity', headerName: 'Cantitate', type: 'number' },


    ];

    // Function to open the delete confirmation dialog
    const handleOpenDialog = (orderId) => {
        setOrderToDelete(orderId); // Store the seminar ID to be deleted
        setOpenDialog(true); // Open the dialog
    };


    const handleDeleteOrderRequest = () => {
        apiDeleteOrder((response) => {
            showSuccessToast(response.message);
            const updatedData = data.filter((order) => order.id !== orderToDelete);
            setData(updatedData);
            setOpenDialog(false);

        }, showErrorToast, orderToDelete);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };


    // Function to open the delete confirmation dialog
    const handleOpenChangeStatusDialog = (orderId) => {
        setOrderToUpdate(orderId); // Store the seminar ID to be deleted
        setOpenChangeStatusDialog(true); // Open the dialog
    };


    const handleUpdateOrderStatusRequest = () => {
        apiUpdateOrderStatus((response) => {
            showSuccessToast(response.message);
            setOpenChangeStatusDialog(false);

            const updatedData = data.filter((order) => order.id !== orderToUpdate);
            setData(updatedData);

        }, showErrorToast, orderToUpdate, formData.status);

    };

    const handleCloseChangeStatusDialog = () => {
        setOpenChangeStatusDialog(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const columns = [
        { field: 'id', headerName: 'Numar comanda', type: 'string' },
        { field: 'board_number', headerName: 'Numar masa', type: 'string' },
        {
            field: 'status', headerName: 'Status', type: 'string', renderCell: ({ value, row }) => {
                const statusMap = {
                    new: 'Noua',
                    pending: 'In asteptare',
                    prepared: 'Preparata',
                    done: 'Servita'
                };

                const statusLabel = statusMap[value] || value;
                const color = colorMap[value] || 'default';

                return (
                    <Chip
                        label={statusLabel}
                        variant="outlined"
                        sx={{
                            fontWeight: 'bold',
                            fontSize: '14px',
                            color: color,
                            borderColor: color,

                        }}
                        onClick={() => {
                            if (rightCode === RIGHTS_MAPPING.WAITER || rightCode === RIGHTS_MAPPING.CHEF) {
                                handleOpenChangeStatusDialog(row.id);
                            }
                        }}

                    />
                );
            }
        },
        { field: 'waiter_name', headerName: 'Nume ospatar', type: 'string' },
        {
            field: 'created_at', headerName: 'Data', type: 'date', renderCell: ({ value }) => {
                return dayjs(value).format('DD.MM.YYYY');
            }
        },

    ];



    return (
        <>
            <GenericTable
                actions={actions}
                title={"Comenzi"}
                columns={columns}
                data={data}
                childrenColumns={childrenColumns}
                childrenData={childrenData}
                isExtendedTable={true}
            />



            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle></DialogTitle>
                <DialogContent>
                    Esti sigur ca vrei sa stergi comanda?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} sx={{ backgroundColor: '#343434', color: 'white' }}>
                        Anuleaza
                    </Button>
                    <Button onClick={handleDeleteOrderRequest} sx={{ backgroundColor: 'red', color: 'white' }}>
                        Sterge
                    </Button>
                </DialogActions>
            </Dialog>


            <Dialog open={openChangeStatusDialog} onClose={handleCloseChangeStatusDialog}>
                <DialogTitle>Schimba status</DialogTitle>
                <DialogContent >

                    <Box sx={{ position: 'relative', width: '100%' }}>
                        <FormControl fullWidth sx={{ ...addStyleToTextField(formData.status), mt: 1 }}>
                            <InputLabel id="status-label">Status</InputLabel>
                            <Select
                                label="Status"
                                labelId="status-label"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}

                            >
                                <MenuItem value={'new'}>Noua</MenuItem>
                                {rightCode === RIGHTS_MAPPING.WAITER && <MenuItem value={'pending'}>In asteptare</MenuItem>}
                                {rightCode === RIGHTS_MAPPING.CHEF && <MenuItem value={'prepared'}>Preparata</MenuItem>}
                                {rightCode === RIGHTS_MAPPING.WAITER && <MenuItem value={'done'}>Servita</MenuItem>}


                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>


                    <Button onClick={handleUpdateOrderStatusRequest} sx={{ backgroundColor: ' #343434', color: 'white', mb: 1, ml: 1 }}>
                        Schimba status
                    </Button>

                    <Button onClick={handleCloseChangeStatusDialog} variant="contained" color="error" sx={{ mb: 1, mr: 1 }}>
                        Anuleaza
                    </Button>

                </DialogActions>
            </Dialog>


        </>
    );
};
export default Orders;