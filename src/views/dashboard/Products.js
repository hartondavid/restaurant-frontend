import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import GenericTable from "../../components/GenericTable";
import { showErrorToast, showSuccessToast } from "../../utils/utilFunctions";
import {
    Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, List,
    ListItemText, Box, ListItemButton
} from '@mui/material';
import { apiGetProducts, apiDeleteProduct } from "../../api/products";
import { RIGHTS_MAPPING } from "../../utils/utilConstants";
import dayjs from "dayjs";

import DeleteIcon from '@mui/icons-material/Delete';

const columns = [
    { field: 'id', headerName: 'Nr.', type: 'string' },
    { field: 'name', headerName: 'Nume', type: 'string' },
    { field: 'image', headerName: 'Imagine', type: 'filepath' },
    { field: 'description', headerName: 'Descriere', type: 'string' },
    {
        field: 'price', headerName: 'Pret', type: 'string', renderCell: ({ value }) => {
            return <ListItemText primary={`${value} lei`} sx={{ ml: 1 }} />;
        }
    },
    {
        field: 'quantity', headerName: 'Cantitate', type: 'string', renderCell: ({ value }) => {
            return <ListItemText primary={`${value} grame`} sx={{ ml: 1 }} />;
        }
    },
    {
        field: 'created_at', headerName: 'Data', type: 'date', renderCell: ({ value }) => {
            return dayjs(value).format('DD.MM.YYYY');
        }
    },

];

const Products = ({ userRights }) => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [actions, setActions] = useState([]);

    const rightCode = userRights[0]?.right_code;

    const [openDialog, setOpenDialog] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    useEffect(() => {
        if (rightCode === RIGHTS_MAPPING.MANAGER) {
            apiGetProducts((response) => {
                setData(response.data)

            }, showErrorToast);

            let actionsTmp = [];

            actionsTmp = [
                { icon: (<DeleteIcon color="error" />), color: 'black', onClick: (id) => handleOpenDialog(id) },


            ];

            setActions(actionsTmp);
        }


    }, [data.length, rightCode]);


    const handleCloseDialog = () => {
        setOpenDialog(false);
    }

    const handleDeleteProduct = () => {
        apiDeleteProduct((response) => {
            showSuccessToast(response.message);
            const updatedData = data.filter((item) => item.id !== productToDelete);
            setData(updatedData);
        }, showErrorToast, productToDelete);
        setOpenDialog(false);
    }

    const handleOpenDialog = (productId) => {
        setProductToDelete(productId);
        setOpenDialog(true);
    }


    return (
        <>
            <GenericTable
                actions={rightCode === RIGHTS_MAPPING.MANAGER && actions}
                title={"Meniu"}
                columns={columns}
                data={data}
                buttonText={"Adauga produs"}
                buttonAction={() => navigate("/dashboard/addEditProduct/0")}
                edit={true}
                onEdit={(id) => navigate(`/dashboard/addEditProduct/${id}`)}

            />


            <Dialog open={openDialog} onClose={handleCloseDialog}>

                <DialogTitle>Sterge produs</DialogTitle>
                <DialogContent>
                    Esti sigur ca vrei sa stergi produsul?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} sx={{ backgroundColor: '#343434', color: 'white' }} >
                        Anuleaza
                    </Button>
                    <Button sx={{ backgroundColor: 'red', color: 'white' }} onClick={handleDeleteProduct}>
                        Sterge
                    </Button>
                </DialogActions>

            </Dialog>


        </>
    );
};
export default Products;