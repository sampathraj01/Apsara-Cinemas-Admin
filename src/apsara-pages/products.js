import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { DataGrid } from '@mui/x-data-grid';
import MainCard from 'ui-component/cards/MainCard';
 import { dispatch, useSelector } from '../store/index';
import moment from 'moment';
// import './style.css'

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, Grid } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import { FormControl } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { FormHelperText } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { CSVExport } from '../../src/views/forms/tables/TableExports';
import Switch from '@mui/material/Switch';
import { Stack } from '@mui/material';
 import Loader from 'ui-component/Loader';

 import { getProducts , addProduct ,updateProduct,updateStockStatus   } from 'redux/actions/productActions';
 import { getCategories } from 'redux/actions/categoryActions';

 import SnackbarAlert from "../apsara-pages/component/SnackbarAlert"

export default function Product() {

   const { categories } = useSelector((data) => data.category);
    const { products } = useSelector((data) => data.product);
    const { productmessages } = useSelector((data) => data.productmessage);
    
    
    const [ rows, setRows] = useState([]);
    const [ columns, setColumns] = useState([]);
    const [ open , setOpen ] = useState('')
    const [ EditOpen , setEditOpen ] = useState('')
    
    const [ MessageAlert , setMessageAlert ] = React.useState(false);
      const [SnackBarmessage, SetSnackBarmessage] = useState({});
    const [showload, setshowload] = React.useState(false);
    const [ editProduct, setEditProduct ] = useState([])

    
    const theme = useTheme();

    
    useEffect(() => {
        dispatch(getCategories())
        dispatch(getProducts())
    }, []);

    useEffect(() => {
        console.log("products",products)
         addTableProductGrid();
     }, [products]);

    useEffect(() => {
        console.log("categorymessagesstatemessages", productmessages);
        if (productmessages) {
            if (productmessages.success) {
                handleClose()
                formik.resetForm();
                 setEditOpen(false)
            }
        }
        SetSnackBarmessage(productmessages)
    }, [productmessages]);

    const editProducts = (params) => {
        setEditOpen(true)
        setOpen(true)
        setEditProduct(products.find(item => String(item.productid) === String(params.row.id)))
   } 

   const getValidationSchema = (EditOpen) =>
  yup.object({
    category: yup.string().required("Please Select category"),
    product: yup.string().required("Product is required"),
    price: yup.string().required("Price is required"),
    foodtype: yup.string().required("Please Select food type"),
    //  Conditionally require photo only when adding (not editing)
    photo: !EditOpen
      ? yup
          .mixed()
          .required("Photo is required")
          .test("fileSize", "File too large (max 2MB)", (value) => {
            return value && value.size <= 2000000;
          })
          .test("fileType", "Unsupported file format", (value) => {
            return (
              value &&
              ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(value.type)
            );
          })
      : yup.mixed().nullable(),
  });

 const handleStockToggle = (productid, newValue) => {
  // Optimistic UI update
  setRows((prevRows) =>
    prevRows.map((row) =>
      row.id === productid ? { ...row, stockstatus: newValue } : row
    )
  );

  // Dispatch Redux action
  dispatch(updateStockStatus(productid, newValue)).then(() => {
    // snackbar relies on Redux state
    if (productmessages) {
      SetSnackBarmessage({
        message: productmessages.message || "Stock status updated",
        color: productmessages.color || "success",
      });
      setMessageAlert(true);
    }

    // Refresh product list
    dispatch(getProducts());
  });
};



    const addTableProductGrid = async () => {
        const modifiedRows = await Promise.all(
            products.map((row, index) => ({
                id: row.productid,
                sno : index+1,
                category: row.categoryname,
                product: row.productname,
                foodtype: row.foodtype,
                photo: row.photo?.url || row.photo || '',
                price: `Rs. ${row.price}`,
                stockstatus: typeof row.flag === "boolean" ? row.flag : true,
                createdbyname : typeof row.createdBy === "string" ? row.createdBy : row.createdBy?.name || "",
                createdtime : moment(row.createdtime).format('DD-MM-YYYY hh:mm:ss A'),
                updatedbyname : typeof row.updatedBy === "string" ? row.updatedBy : row.updatedBy?.name || "",
                updatedtime : row.updatedtime ? moment(row.updatedtime).format("DD-MM-YYYY hh:mm:ss A")  : "",
            }))
        );

        const modifiedColumns = [
            { field: 'sno', headerName: 'S.No.', width: 70 },
            { field: 'category', headerName: 'Category', width: 150 },
            { field: 'product', headerName: 'Product', width: 150 },
            {
              field: "photo",
              headerName: "Photo",
              width: 130,
              renderCell: (params) =>
                params.row.photo ? (
                <img
                    src={params.row.photo}
                    alt="product"
                    style={{
                    width: "45px",
                    height: "45px",
                    objectFit: "contain",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                    padding: "2px",
                    background: "#fff",
                    }}
                />
                ) : (
                <span style={{ color: "#999" }}>No image</span>
                ),
            },
            { field: 'foodtype', headerName: 'foodtype', width: 100 },
            { field: 'price', headerName: 'Price', width: 100 },
            {
                headerName: 'Actions',
                width: 140,
                renderCell: (params) => (
                    <>
                        <button onClick={() => editProducts(params)} style={{ cursor: 'pointer', color: '#009900', border: 'none' }}>
                            <EditIcon />
                        </button>
                        &nbsp;&nbsp;&nbsp;
                    </>
                )
            },
            {
            field: 'stockstatus',
            headerName: 'Stock Status',
            width: 150,
            renderCell: (params) => (
                <Switch
                checked={params.row.stockstatus}
                onChange={(e) => handleStockToggle(params.row.id, e.target.checked)}
                color="success"
                inputProps={{ 'aria-label': 'stock status toggle' }}
                />
            ),
            },
            {
                field: 'createdbyname',
                headerName: 'Created By',
                width: 180,
                renderCell: (params) => (
                    <>
                    <div>
                    {params.row.createdbyname}
                    <br/>
                    {params.row.createdtime}
                    <br/>
                    </div>
                    </>
                )
            },
            {
                field: 'updatedbyname',
                headerName: 'Updated By',
                width: 180,
                renderCell: (params) => (
                    <>
                    <div>
                    {params.row.updatedbyname}
                    <br/>
                    {params.row.updatedtime}
                    </div>
                    </>
                )
            },
        ];

        setRows(modifiedRows);
        setColumns(modifiedColumns);
    };

    const formik = useFormik({
  initialValues: {
    category: EditOpen ? editProduct?.categoryid || '' : '',
    product: EditOpen ? editProduct?.productname || '' : '',
    photo: EditOpen ? editProduct?.photo || '' : '',
    foodtype: EditOpen ? editProduct?.foodtype || '' : '',
    price: EditOpen ? editProduct?.price || '' : '',
  },
  validationSchema: getValidationSchema(EditOpen),
  enableReinitialize: true,
  onSubmit: async (values) => {
    console.log("Form Values:", values);

    if (EditOpen) {
      // 🔹 Edit existing product (no file upload here)
      const sendingdata = {
        productid: editProduct.productid,
        categoryid: values.category,
        product: values.product,
        price: values.price,
        foodtype: values.foodtype,
        userid: window.localStorage.getItem("userid"),
      };

      setshowload(true);
      dispatch(updateProduct(sendingdata)).then(() => {
        setMessageAlert(true);
        setshowload(false);
        dispatch(getProducts());
      });
    } else {
      // 🔹 Add new product (handle file upload)
      const file = values.photo;

      if (!file) {
        alert("Please select a photo");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result.split(",")[1];
        const sendingdata = {
          categoryid: values.category,
          product: values.product,
          foodtype: values.foodtype,
          price: values.price,
          userid: window.localStorage.getItem("userid"),
          photo: {
            base64: base64Data,
            name: file.name,
            type: file.type,
          },
        };

        setshowload(true);
        dispatch(addProduct(sendingdata)).then(() => {
          setMessageAlert(true);
          setshowload(false);
          dispatch(getProducts());
        });
      };

      // ✅ Trigger FileReader to start
      reader.readAsDataURL(file);
    }
  },
});



    const handleClickCloseAddAlert = () => {
        setMessageAlert(false);
    };

    const handleClickOpen = () => {
        setOpen(true)
         setEditOpen(false)
    }

    const handleClose = () => {
        setOpen(false)
        setEditOpen(false)
    }

    return (
        <MainCard
            content={false}
            title={
                <>
                    <Button variant="contained" color="warning" size="medium" onClick={handleClickOpen}>
                        <b>+</b>
                    </Button>
                </>
            }
            secondary={
                <Stack direction="row" spacing={2} alignItems="flex-start">
                    <CSVExport data={rows} filename="products.csv" header={columns} />
                </Stack>
            }
        >
             { showload ? <Loader /> : ''} 
              <SnackbarAlert open={MessageAlert} onClose={handleClickCloseAddAlert} message={SnackBarmessage.message} severity={SnackBarmessage.color} /> 

            <Dialog maxWidth="xs" fullWidth="true" open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                    {open && (
                        <>
                        <DialogTitle id="form-dialog-title">  {EditOpen ? 'Edit Product':'Add Product'}</DialogTitle>
                        <DialogContent>
                            <Box sx={{ flexGrow: 2 }}>
                                <form onSubmit={formik.handleSubmit} id="validation-forms">
                                    <Grid container spacing={3}>
                                    <Grid item xs={12} md={12}>
                                        <InputLabel id="demo-simple-select-label">Category *</InputLabel>
                                        <div className="row" style={{ marginTop: '10px' }}></div>
                                        <FormControl
                                            fullWidth
                                            error={formik.touched.category && Boolean(formik.errors.category)}
                                            >
                                            <InputLabel id="category-label">Category *</InputLabel>
                                            <Select
                                                labelId="category-label"
                                                id="category"
                                                name="category"
                                                value={formik.values.category}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur} // ✅ important for formik.touched
                                                label="Category *"
                                            >
                                            {categories.map((row) => (
                                                <MenuItem key={row.categoryid} value={row.categoryid}>
                                                    {row.categoryname}
                                                </MenuItem>
                                                ))}

                                            </Select>

                                            {formik.touched.category && formik.errors.category && (
                                                <FormHelperText>
                                                {formik.errors.category}
                                                </FormHelperText>
                                            )}
                                            </FormControl>

                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <InputLabel id="demo-simple-select-label">Product *</InputLabel>
                                            <div className="row" style={{ marginTop: '10px' }}></div>
                                            <TextField
                                                fullWidth
                                                id="product"
                                                name="product"
                                                label="Product"
                                                inputProps={{
                                                    autoComplete: 'none'
                                                }}
                                                value={formik.values.product}
                                                onChange={formik.handleChange}
                                                error={formik.touched.product && Boolean(formik.errors.product)}
                                                helperText={formik.touched.product && formik.errors.product}
                                            />
                                        </Grid>
                                         <Grid item xs={12}>
                                            <InputLabel id="foodtype-label">Food Type *</InputLabel>
                                            <FormControl
                                                fullWidth
                                                sx={{ mt: 1 }}
                                                error={formik.touched.foodtype && Boolean(formik.errors.foodtype)}
                                            >
                                                <Select
                                                labelId="foodtype-label"
                                                id="foodtype"
                                                name="foodtype"
                                                value={formik.values.foodtype}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                >
                                                <MenuItem value="Veg">Veg</MenuItem>
                                                <MenuItem value="Non-Veg">Non-Veg</MenuItem>
                                                </Select>
                                                {formik.touched.foodtype && formik.errors.foodtype && (
                                                <FormHelperText>{formik.errors.foodtype}</FormHelperText>
                                                )}
                                            </FormControl>
                                            </Grid>
                                        <Grid item xs={12} md={12}>
                                            <InputLabel id="photo-label">Upload Product Photo *</InputLabel>
                                            <div className="row" style={{ marginTop: '10px' }}></div>
                                            <input
                                            accept="image/*"
                                            id="photo"
                                            name="photo"
                                            type="file"
                                            onChange={(event) => {
                                                const file = event.currentTarget.files[0];
                                                formik.setFieldValue("photo", file);
                                            }}
                                            />
                                           {formik.values.photo && (
                                            <Box mt={2}>
                                                <img
                                                src={
                                                    formik.values.photo instanceof File
                                                    ? URL.createObjectURL(formik.values.photo) // file upload
                                                    : formik.values.photo // existing image URL
                                                }
                                                alt="preview"
                                                width="100%"
                                                style={{
                                                    maxHeight: "200px",
                                                    objectFit: "contain",
                                                    borderRadius: "8px",
                                                    border: "1px solid #ccc"
                                                }}
                                                />
                                            </Box>
                                            )}

                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <InputLabel id="demo-simple-select-label">Price *</InputLabel>
                                            <div className="row" style={{ marginTop: '10px' }}></div>
                                            <TextField
                                                fullWidth
                                                id="price"
                                                name="price"
                                                label="Price"
                                                inputProps={{
                                                    autoComplete: 'none'
                                                }}
                                                value={formik.values.price}
                                                onChange={formik.handleChange}
                                                error={formik.touched.price && Boolean(formik.errors.price)}
                                                helperText={formik.touched.price && formik.errors.price}
                                            />
                                        </Grid>
                                    </Grid>
                                    <br/>
                                    <Grid item xs={12} md={3}>
                                        <Button variant="contained" disabled={showload} size="small" type="submit">
                                            SAVE
                                        </Button>
                                        <Button sx={{ color: theme.palette.error.dark }} onClick={handleClose} color="secondary">
                                            CANCEL
                                        </Button>
                                    </Grid>
                                </form>
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ pr: 2.5 }}></DialogActions>
                        </>
                    )}
                </Dialog>

            <Box
                sx={{
                    height: 670,
                    width: '100%',
                    '& .MuiDataGrid-root': {
                        border: 'none',
                        '& .MuiDataGrid-cell': {
                            borderColor: theme.palette.mode === 'dark' ? theme.palette.text.primary + 15 : 'grey.200'
                        },
                        '& .MuiDataGrid-columnsContainer': {
                            color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900',
                            borderColor: theme.palette.mode === 'dark' ? theme.palette.text.primary + 15 : 'grey.200'
                        },
                        '& .MuiDataGrid-columnSeparator': {
                            color: theme.palette.mode === 'dark' ? theme.palette.text.primary + 15 : 'grey.200'
                        }
                    }
                }}
            >
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                />
            </Box>
        </MainCard >
    )
}