import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import GenericTable from "../../components/GenericTable";
import { showErrorToast, showSuccessToast } from "../../utils/utilFunctions";
import {
    Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, List,
    CircularProgress, Typography, ListItem, IconButton, ListItemText, Box, Chip
} from '@mui/material';
import { apiGetBoards, apiGetBoardsByWaiterId, apiDeleteBoard, apiAddProductToBoard, apiDeleteProductFromBoard, apiGetProductsByBoardId, apiAddBoard } from "../../api/boards";
import { apiSearchProduct } from "../../api/products";
import { RIGHTS_MAPPING } from "../../utils/utilConstants";

import dayjs from "dayjs";
import DeleteIcon from '@mui/icons-material/Delete';
import { addStyleToTextField } from "../../utils/utilFunctions";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

const colorMap = {
    free: 'green',
    reserved: 'red',

};
const columns = [

    { field: 'number', headerName: 'Numar masa', type: 'string' },
    { field: 'order_id', headerName: 'Numar comanda', type: 'string' },
    {
        field: 'status', headerName: 'Status', type: 'string', renderCell: ({ value }) => {
            const statusMap = {
                free: 'Libera',
                reserved: 'Rezervata',

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

                    }}

                />
            );
        }
    },
    { field: 'name', headerName: 'Nume', type: 'string' },
    {
        field: 'created_at', headerName: 'Data', type: 'date', renderCell: ({ value }) => {
            return dayjs(value).format('DD.MM.YYYY');
        }
    },

];
const Boards = ({ userRights }) => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [actions, setActions] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const [loading, setLoading] = useState(false);

    const [debounceTimeout, setDebounceTimeout] = useState(null);

    const [boardId, setBoardId] = useState(null);

    const [openAddProductDialog, setOpenAddProductDialog] = useState(false);

    const rightCode = userRights[0]?.right_code;

    const [openDialog, setOpenDialog] = useState(false);
    const [boardToDelete, setBoardToDelete] = useState(null);

    const [openAddBoardDialog, setOpenAddBoardDialog] = useState(false);
    const [boardToAdd, setBoardToAdd] = useState(null);
    const [formData, setFormData] = useState({
        number: '',

    });

    useEffect(() => {
        if (rightCode === RIGHTS_MAPPING.WAITER) {
            apiGetBoardsByWaiterId((response) => {
                console.log('response', response);
                setData(response.data)
            }, showErrorToast);

            let actionsTmp = [];

            actionsTmp = [
                { icon: (<AddCircleOutlineIcon color="success" />), color: 'black', onClick: (id) => handleFetchProducts(id) },

            ];
            setActions(actionsTmp);
        } else if (rightCode === RIGHTS_MAPPING.MANAGER) {
            apiGetBoards((response) => {
                setData(response.data)
            }, showErrorToast);

            let actionsTmp = [];

            actionsTmp = [

                { icon: <DeleteIcon />, color: 'red', onClick: handleOpenDialog },

            ];

            setActions(actionsTmp);
        }


    }, [data.length, rightCode]);




    const [selectedProducts, setSelectedProducts] = useState([]);

    const handleFetchProducts = (id) => {
        setBoardId(id);
        setSelectedProducts([]);

        apiGetProductsByBoardId((response) => {
            setSelectedProducts(response.data);

        }, showErrorToast, id);

        setOpenAddProductDialog(true)
    };

    //Function to fetch employees based on search term
    const fetchProductSearchResults = async (search) => {
        setLoading(true);
        try {
            await apiSearchProduct((products) => {
                setSearchResults(products);
            }, showErrorToast, search);

        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };
    // Function to handle search input change with debounce
    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        // Clear previous timeout
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }
        // Set a new timeout to wait before making the API request
        setDebounceTimeout(setTimeout(() => {
            if (value.trim()) {
                fetchProductSearchResults(value);
            } else {
                setSearchResults([]);
            }
        }, 500));
    }


    const handleAddProduct = (product) => {
        setSelectedProducts((prevProducts) => {

            console.log('prevProducts', prevProducts);
            // Check if the order is already in the list
            if (prevProducts.some((o) => o.id === product.id)) {

                return prevProducts;
            }
            return [...prevProducts, product];
        });
        setData((prevData) =>
            prevData.map((board) => {
                // Use the deliveryId from state if order.delivery_id is not set
                const targetBoardId = product.board_id || boardId;
                if (board.id === targetBoardId) {
                    // Avoid duplicate orders
                    if (board.boardItems && board.boardItems.some((o) => o.product_id === product.id)) {
                        return board;
                    }
                    return {
                        ...board,
                        boardItems: [...(board.boardItems || []), { ...product, board_id: targetBoardId }]
                    };
                }
                return board;
            })
        );



        apiAddProductToBoard((response) => {
            showSuccessToast(response.message);
        }, showErrorToast, boardId, product.id);



        setSearchResults([]);
        setSearchTerm('');
    };
    // Function to handle successful deletion
    const handleDeleteSuccess = (deletedProductId, response) => {
        // Remove the employee from the selectedEmployees list
        setSelectedProducts((prevProducts) =>
            prevProducts.filter((product) => product.product_id !== deletedProductId)
        );
        console.log('deletedProductId', deletedProductId);

        setData((prevData) =>
            prevData.map((board) => ({
                ...board,
                boardItems: board.boardItems
                    ? board.boardItems.filter((product) => product.product_id !== deletedProductId)
                    : []
            }))
        );
        showSuccessToast(response.message);
    };
    // Close the add employee dialog
    const handleCloseAddProductDialog = () => {
        setOpenAddProductDialog(false);
        setSearchTerm('');
        setSearchResults([]);
        apiGetBoardsByWaiterId((response) => {
            console.log('response', response);
            setData(response.data)
        }, showErrorToast);

    };


    const childrenData = data.reduce((acc, board) => {
        const boardId = board.id;

        if (!acc[boardId]) {
            acc[boardId] = [];
        }
        if (board.boardItems && Array.isArray(board.boardItems)) {
            acc[boardId].push(
                ...board.boardItems.map((boardItem, idx) => ({
                    id: boardItem.id || `${boardId}-${idx}`,
                    name: boardItem.name,
                    price: ` ${boardItem.price} lei`,
                    quantity: ` ${boardItem.quantity} grame`,
                    image: boardItem.image,

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


    const handleAddProductsToBoard = () => {

        setOpenAddProductDialog(false);

    }


    // Function to open the delete confirmation dialog
    const handleOpenDialog = (boardId) => {
        setBoardToDelete(boardId); // Store the seminar ID to be deleted
        setOpenDialog(true); // Open the dialog
    };


    const handleDeleteBoardRequest = () => {
        apiDeleteBoard((response) => {
            showSuccessToast(response.message);
            const updatedData = data.filter((board) => board.id !== boardToDelete);
            setData(updatedData);
            setOpenDialog(false);

        }, showErrorToast, boardToDelete);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    // Function to open the delete confirmation dialog
    const handleOpenAddBoardDialog = (boardId) => {
        setBoardToAdd(boardId); // Store the seminar ID to be deleted
        setOpenAddBoardDialog(true); // Open the dialog
    };


    const handleAddBoardRequest = () => {
        apiAddBoard((response) => {
            showSuccessToast(response.message);
            setOpenAddBoardDialog(false);

            const updatedData = data.filter((board) => board.id !== boardToAdd);
            setData(updatedData);


            apiGetBoards((response) => {
                console.log('response', response);
                setData(response.data)
            }, showErrorToast);



        }, showErrorToast, formData);


    };

    const handleCloseAddBoardDialog = () => {
        setOpenAddBoardDialog(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };


    return (
        <>
            <GenericTable
                actions={actions}
                title={"Mese"}
                buttonText={(rightCode === RIGHTS_MAPPING.WAITER || rightCode === RIGHTS_MAPPING.MANAGER) && "Adauga Masa"}
                buttonAction={() => {
                    if (rightCode === RIGHTS_MAPPING.WAITER || rightCode === RIGHTS_MAPPING.MANAGER) {
                        handleOpenAddBoardDialog();
                    }

                }}
                columns={columns}
                data={data}
                childrenColumns={childrenColumns}
                childrenData={childrenData}
                isExtendedTable={true}
            />

            {/* Add Employee Dialog */}
            <Dialog open={openAddProductDialog} onClose={handleCloseAddProductDialog} fullWidth maxWidth="sm">
                <DialogTitle>Adauga produse la masa</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Cauta produse"
                        variant="outlined"
                        fullWidth
                        value={searchTerm}
                        onChange={handleSearchChange}
                        sx={{ ...addStyleToTextField(searchTerm), mt: 1 }}
                    />

                    {loading ? <CircularProgress /> : (
                        <List sx={{ maxHeight: 200, overflow: 'auto' }}>
                            {searchResults.map((product) => (
                                <ListItem
                                    button
                                    key={product.id}
                                    onClick={() => handleAddProduct(product)}
                                >
                                    <RestaurantMenuIcon sx={{ mr: 1, color: '#343434' }} />

                                    {product.name}



                                    {` ${product.price} lei`}


                                    {` ${product.quantity} grame`}


                                    <AddCircleOutlineIcon color="success" sx={{ ml: 2 }} />

                                </ListItem>
                            ))}
                        </List>
                    )}

                    {selectedProducts.length > 0 && <Typography variant="h6" sx={{ marginTop: 2 }}>Produse selectate:</Typography>}
                    <List sx={{ maxHeight: 200, overflow: 'auto' }}>
                        {selectedProducts.map((product) => (
                            <ListItem
                                key={product.product_id}
                                secondaryAction={
                                    <IconButton edge="end" aria-label="delete" onClick={() => apiDeleteProductFromBoard(
                                        (response) => handleDeleteSuccess(product.product_id, response),
                                        showErrorToast,
                                        product.product_id,
                                        boardId
                                    )} style={{ color: 'red' }}>
                                        <RemoveCircleOutlineIcon />
                                    </IconButton>
                                }
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>

                                    <RestaurantMenuIcon sx={{ mr: 1, color: '#343434' }} />
                                    <ListItemText primary={product.name} />

                                    <ListItemText primary={`${product.price} lei`} sx={{ ml: 1 }} />

                                    <ListItemText primary={`${product.quantity} grame`} sx={{ ml: 1 }} />

                                </Box>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained"
                        onClick={handleAddProductsToBoard}
                        sx={{
                            backgroundColor: ' #343434', color: 'white'
                        }}
                    >
                        Finalizeaza
                    </Button>

                </DialogActions>
            </Dialog>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle></DialogTitle>
                <DialogContent>
                    Esti sigur ca vrei sa stergi masa?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} sx={{ backgroundColor: ' #343434', color: 'white' }}>
                        Anuleaza
                    </Button>
                    <Button onClick={handleDeleteBoardRequest} sx={{ backgroundColor: 'red', color: 'white' }}>
                        Sterge
                    </Button>
                </DialogActions>
            </Dialog>


            <Dialog open={openAddBoardDialog} onClose={handleCloseAddBoardDialog}>
                <DialogTitle>Adauga masa</DialogTitle>
                <DialogContent >

                    <Box sx={{ position: 'relative', width: '100%' }}>
                        <TextField
                            label="Numar"
                            name="number"
                            type='string'
                            value={formData.number || ''}
                            fullWidth
                            margin="normal"
                            onChange={handleChange}
                            sx={addStyleToTextField(formData.number)}
                        >
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions>


                    <Button onClick={handleAddBoardRequest} sx={{ backgroundColor: ' #343434', color: 'white', mb: 1, ml: 1 }}>
                        Adauga
                    </Button>

                    <Button onClick={handleCloseAddBoardDialog} variant="contained" color="error" sx={{ mb: 1, mr: 1 }}>
                        Anuleaza
                    </Button>

                </DialogActions>
            </Dialog>


        </>
    );
};
export default Boards;