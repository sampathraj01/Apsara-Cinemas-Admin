
// material-ui
import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { useFormik } from 'formik';
import * as yup from 'yup';
import MainCard from 'ui-component/cards/MainCard';
import moment from 'moment';
// import './style.css'

import {
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  FormHelperText,
  InputLabel
} from '@mui/material';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
 import { CSVExport } from '../../src/views/forms/tables/TableExports';
import DialogActions from '@mui/material/DialogActions';
import EditIcon from '@mui/icons-material/Edit';
import Switch from '@mui/material/Switch';
import { Stack } from '@mui/material';

import SnackbarAlert from "../apsara-pages/component/SnackbarAlert"
import Loader from 'ui-component/Loader';
import { dispatch, useSelector } from '../store/index';
import { addCombo } from 'redux/actions/comboActions';
import { getProducts, updateStockStatus,updateProduct  } from 'redux/actions/productActions';
import { getCategories } from 'redux/actions/categoryActions';


export default function Combo() {

    const { products } = useSelector((data) => data.product);
    const { categories } = useSelector((data) => data.category);
    const { combomessages } = useSelector((data) => data.combomessage);

    const [open, setOpen] = useState('')
    const [ EditOpen , setEditOpen ] = useState('')
     const [rows, setRows] = useState([]);
     const [columns, setColumns] = useState([]);
     const [SnackBarmessage, SetSnackBarmessage] = useState({});
     const [ editcombo  ,  SetEditCombo ] = useState([])
     const [MessageAlert, setMessageAlert] = React.useState(false);
     const [showload, setshowload] = React.useState(false);
    const theme = useTheme();

    useEffect(() => {
        dispatch(getProducts())
        dispatch(getCategories())
    }, []);

    useEffect(() => {
        addTableStatesGrid();
        console.log("combosssss", products);
    }, [products]);


    useEffect(() => {
        console.log("combomessagessssss", combomessages);
        if (combomessages) {
            if (combomessages.success) {
                handleClose()
                formik.resetForm();
                 setEditOpen(false)
            }
        }
        SetSnackBarmessage(combomessages)
    }, [combomessages]);
    
     const editCombos = (params) => {
        setEditOpen(true)
        setOpen(true)
        SetEditCombo(products.find(item => String(item.productid) === String(params.row.id)))
   } 

   const getValidationSchema = (EditOpen) =>
     yup.object({
       comboname: yup.string().required("Please Enter Comboname"),
       productsname: yup.array().min(1, "Please select at least two product"),
       price: yup.string().required("Price is required"),
       foodtype: yup.string().required(" Please Select the Foodtype"),

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
         if (combomessages) {
           SetSnackBarmessage({
             message: combomessages.message || "Stock status updated",
             color: combomessages.color || "success",
           });
           setMessageAlert(true);
         }
     
         // Refresh product list
         dispatch(getProducts());
       });
     };

    const addTableStatesGrid = async () => {
        const modifiedRows = await Promise.all(
            products.filter((row) => row.type === "combo") .map((row, index) => ({
                id:  row.productid ,
                sno: index + 1,
                comboname: row.productname,
                description: row.description,
                photo: row.photo ,
                foodtype: row.foodtype,
                price: row.price,
                stockstatus: typeof row.flag === "boolean" ? row.flag : true,
                createdbyname: typeof row.createdBy === "string" ? row.createdBy : row.createdBy?.name || "",
                createdtime: moment(row.createdtime).format('DD-MM-YYYY hh:mm:ss A'),
                updatedbyname : typeof row.updatedBy === "string" ? row.updatedBy : row.updatedBy?.name || "",
                 updatedtime : row.updatedtime ? moment(row.updatedtime).format("DD-MM-YYYY hh:mm:ss A")  : "",
            }))
        );

        const modifiedColumns = [
            { field: 'sno', headerName: 'S.No.', width: 70 },
            { field: 'comboname', headerName: 'Combo', width: 150 },
            { field: 'description', headerName: 'Description', width: 250 },
             {
              field: "photo",
              headerName: "Photo",
              width: 120,
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
            { field: 'foodtype', headerName: 'Foodtype', width: 100 },
            { field: 'price', headerName: 'Price', width: 100 },
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
                headerName: 'Actions',
                width: 100,
                renderCell: (params) => (
                    <>
                        <button onClick={() => editCombos(params)} style={{ cursor: 'pointer', color: '#009900', border: 'none' }}>
                            <EditIcon />
                        </button>
                        &nbsp;&nbsp;&nbsp;
                    </>
                )
            },
            {
                field: 'createdbyname',
                headerName: 'Created By',
                width: 140,
                renderCell: (params) => (
                    <div>
                        {params.row.createdbyname}
                        <br />
                        {params.row.createdtime}
                    </div>
                )
            },
            {
                field: 'updatedbyname',
                headerName: 'Updated By',
                width: 140,
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
    comboname: EditOpen ? editcombo?.productname || '' : '',
    category: EditOpen ? editcombo?.categoryid || '' : '',
    productsname: EditOpen ? editcombo?.productids || [] : [], // array of product IDs
    description: EditOpen ? editcombo?.description || '' : '',
    photo: EditOpen ? editcombo?.photo || '' : '',
    foodtype: EditOpen ? editcombo?.foodtype || '' : '',
    price: EditOpen ? editcombo?.price || '' : '',
  },
  validationSchema: getValidationSchema(EditOpen),
  enableReinitialize: true,
  onSubmit: async (values) => {
    try {
      setshowload(true);

      const sendData = async (photoBase64) => {
        const payload = {
          comboname: values.comboname,
          productids: values.productsname,       // array of product IDs
          categoryid: values.category,
          description: values.description,       // auto-generated string
          foodtype: values.foodtype,
          price: values.price,
          userid: window.localStorage.getItem('userid'),
          photo: photoBase64
            ? {
                base64: photoBase64,
                name: values.photo.name,
                type: values.photo.type,
              }
            : values.photo, // in edit, if photo not changed
        };

        if (EditOpen) {
          // 🔹 Edit combo
          payload.productid = editcombo.productid;
          dispatch(updateProduct(payload)).then(() => {
            setMessageAlert(true);
            setshowload(false);
            dispatch(getProducts()); // refresh list
            handleClose();
          });
        } else {
          // 🔹 Add combo
          dispatch(addCombo(payload)).then(() => {
            setMessageAlert(true);
            setshowload(false);
            dispatch(getProducts()); // refresh list
            handleClose();
          });
        }
      };

      // Handle photo file
      if (values.photo && values.photo instanceof File) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = reader.result.split(',')[1];
          sendData(base64Data);
        };
        reader.readAsDataURL(values.photo);
      } else {
        // No new photo selected (edit case)
        sendData(null);
      }
    } catch (error) {
      console.error('Error submitting combo:', error);
      setshowload(false);
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
                    <CSVExport data={rows} filename="Combo.csv" header={columns} />
                </Stack>
            }

        >
            {showload ? <Loader /> : ''}
                  <SnackbarAlert open={MessageAlert} onClose={handleClickCloseAddAlert} message={SnackBarmessage.message} severity={SnackBarmessage.color} />

            <Dialog maxWidth="xs" fullWidth="true" open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                {open && (
                    <>
                        <DialogTitle id="form-dialog-title">{EditOpen ? 'Edit Combo':'Add Combo'}</DialogTitle>
                        <DialogContent>
                        <Box sx={{ flexGrow: 1, p: 2 }}>
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
                                {/* Combo Name */}
                                <Grid item xs={12}>
                                <InputLabel>Combo Name *</InputLabel>
                                <TextField
                                    fullWidth
                                    id="comboname"
                                    name="comboname"
                                    placeholder="Enter combo name"
                                    value={formik.values.comboname}
                                    onChange={formik.handleChange}
                                    error={formik.touched.comboname && Boolean(formik.errors.comboname)}
                                    helperText={formik.touched.comboname && formik.errors.comboname}
                                    sx={{ mt: 1 }}
                                />
                                </Grid>

                                {/* Choose Products */}
                                <Grid item xs={12}>
                                <InputLabel>Choose Products *</InputLabel>
                                <FormControl
                                    fullWidth
                                    error={formik.touched.productsname && Boolean(formik.errors.productsname)}
                                    sx={{ mt: 1 }}
                                >
                                    <Select
                                    id="productsname"
                                    name="productsname"
                                    multiple
                                    value={formik.values.productsname || []}
                                    onChange={(event) => {
                                        const selectedValues = event.target.value;
                                        formik.setFieldValue('productsname', selectedValues);

                                        // Auto-generate description
                                        const selectedNames = selectedValues
                                        .map((id) => products.find((pro) => pro.productid === id)?.productname)
                                        .filter(Boolean)
                                        .join(' + ');

                                        formik.setFieldValue('description', selectedNames);
                                    }}
                                    onBlur={formik.handleBlur}
                                    renderValue={(selected) =>
                                        selected
                                        .map((id) => products.find((pro) => pro.productid === id)?.productname || id)
                                        .join(', ')
                                    }
                                    >
                                    {products.map((row) => (
                                        <MenuItem key={row.productid} value={row.productid}>
                                        <Checkbox checked={formik.values.productsname?.indexOf(row.productid) > -1} />
                                        <ListItemText primary={`${row.productname} - Rs. ${row.price}`} />
                                        </MenuItem>
                                    ))}
                                    </Select>

                                    {formik.touched.productsname && formik.errors.productsname && (
                                    <FormHelperText>{formik.errors.productsname}</FormHelperText>
                                    )}
                                </FormControl>
                                </Grid>

                                {/* Description (Auto-Filled) */}
                                <Grid item xs={12}>
                                <InputLabel>Description</InputLabel>
                               <TextField
                                fullWidth
                                id="description"
                                name="description"
                                placeholder="Auto-generated based on selected products"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                sx={{ mt: 1 }}
                                InputProps={{
                                    readOnly: true, // ✅ makes it non-editable
                                }}
                                />
                                </Grid>

                                {/* Food Type */}
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


                                {/* Upload Photo */}
                                <Grid item xs={12}>
                                <InputLabel>Upload Combo Photo *</InputLabel>
                                <Box sx={{ mt: 1 }}>
                                    <input
                                    accept="image/*"
                                    id="photo"
                                    name="photo"
                                    type="file"
                                    onChange={(event) => {
                                        const file = event.currentTarget.files[0];
                                        formik.setFieldValue('photo', file);
                                    }}
                                    />
                                </Box>

                                {formik.values.photo && (
                                    <Box mt={2}>
                                    <img
                                        src={
                                        formik.values.photo instanceof File
                                            ? URL.createObjectURL(formik.values.photo)
                                            : formik.values.photo
                                        }
                                        alt="preview"
                                        width="100%"
                                        style={{
                                        maxHeight: '200px',
                                        objectFit: 'contain',
                                        borderRadius: '8px',
                                        border: '1px solid #ccc'
                                        }}
                                    />
                                    </Box>
                                )}
                                </Grid>

                                {/* Price */}
                                <Grid item xs={12}>
                                <InputLabel>Price *</InputLabel>
                                <TextField
                                    fullWidth
                                    id="price"
                                    name="price"
                                    placeholder="Enter combo price"
                                    value={formik.values.price}
                                    onChange={formik.handleChange}
                                    error={formik.touched.price && Boolean(formik.errors.price)}
                                    helperText={formik.touched.price && formik.errors.price}
                                    sx={{ mt: 1 }}
                                />
                                </Grid>

                                {/* Buttons */}
                                <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
                                <Button variant="contained" disabled={showload} type="submit">
                                    SAVE
                                </Button>
                                <Button
                                    sx={{ color: theme.palette.error.dark }}
                                    onClick={handleClose}
                                    color="secondary"
                                >
                                    CANCEL
                                </Button>
                                </Grid>
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