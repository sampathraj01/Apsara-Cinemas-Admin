
// material-ui
import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { useFormik } from 'formik';
import * as yup from 'yup';
import MainCard from 'ui-component/cards/MainCard';
import moment from 'moment';
// import './style.css'

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import { CSVExport } from '../../src/views/forms/tables/TableExports';
import DialogActions from '@mui/material/DialogActions';
import EditIcon from '@mui/icons-material/Edit';
import { Stack } from '@mui/material';

import SnackbarAlert from "../apsara-pages/component/SnackbarAlert"
import Loader from 'ui-component/Loader';
import { dispatch, useSelector } from '../store/index';
import { getCategories, addCategory,updateCategory } from 'redux/actions/categoryActions';


const validationSchema = yup.object({
    categoryname: yup.string().required('Category Name is required'),
    iconName: yup
        .string()
        .test(
            'fileType',
            'Only PNG or SVG files are allowed',
            (value) => {
                if (!value) return true; // skip if no file uploaded
                const ext = value.split('.').pop().toLowerCase();
                return ext === 'png' || ext === 'svg';
            }
        ),
});


export default function Category() {

    const { categories } = useSelector((data) => data.category);
    const { categorymessages } = useSelector((data) => data.categorymessage);

    const [open, setOpen] = useState('')
    const [ EditOpen , setEditOpen ] = useState('')
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);
    const [SnackBarmessage, SetSnackBarmessage] = useState({});
    const [ editcategory  ,  SetEditCategory ] = useState([])
    const [MessageAlert, setMessageAlert] = React.useState(false);
    const [showload, setshowload] = React.useState(false);
    const theme = useTheme();

    useEffect(() => {
        dispatch(getCategories())
    }, []);

    useEffect(() => {
        addTableCategoryGrid();
        console.log("categoriesssss", categories);
    }, [categories]);


    useEffect(() => {
        console.log("categorymessagesstatemessages", categorymessages);
        if (categorymessages) {
            if (categorymessages.success) {
                handleClose()
                formik.resetForm();
                 setEditOpen(false)
            }
        }
        SetSnackBarmessage(categorymessages)
    }, [categorymessages]);
    
     const editCategory = (params) => {
        setEditOpen(true)
        setOpen(true)
        SetEditCategory(categories.find(item => String(item.categoryid) === String(params.row.id)))
   } 

    const addTableCategoryGrid = async () => {
        const modifiedRows = await Promise.all(
            categories.map((row, index) => ({
                id:  row.categoryid ,
                sno: index + 1,
                Category: row.categoryname,
                icon: row.icon ,
                createdbyname: typeof row.createdBy === "string" ? row.createdBy : row.createdBy?.name || "",
                createdtime: moment(row.createdtime).format('DD-MM-YYYY hh:mm:ss A'),
                updatedbyname : typeof row.updatedBy === "string" ? row.updatedBy : row.updatedBy?.name || "",
                 updatedtime : row.updatedtime ? moment(row.updatedtime).format("DD-MM-YYYY hh:mm:ss A")  : "",
            }))
        );

        const modifiedColumns = [
            { field: 'sno', headerName: 'S.No.', width: 70 },
            { field: 'Category', headerName: 'Category', width: 200 },
            {
                field: 'icon',
                headerName: 'Icon',
                width: 100,
                renderCell: (params) => (
                    <img 
                        src={params.row.icon  || '/default-icon.png'} // fallback if null
                        alt="Icon"
                        style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 4 }}
                    />
                )
            },
            {
                headerName: 'Actions',
                width: 200,
                renderCell: (params) => (
                    <>
                        <button onClick={() => editCategory(params)} style={{ cursor: 'pointer', color: '#009900', border: 'none' }}>
                            <EditIcon />
                        </button>
                        &nbsp;&nbsp;&nbsp;
                    </>
                )
            },
            {
                field: 'createdbyname',
                headerName: 'Created By',
                width: 230,
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
                width: 230,
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
        categoryname: EditOpen ? editcategory.categoryname : '',
        iconBase64: '',               // for uploaded image
        iconName: '',                 // filename
        iconPreview: EditOpen ? editcategory.icon || '' : '', // preview
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
        console.log("valuesvalues", values);

        // Attach icon fields if available
        const sendingdata = {
            categoryname: values.categoryname,
            userid: window.localStorage.getItem('userid'),
            iconBase64: values.iconBase64 || null,
            iconName: values.iconName || null,
        };

        if (EditOpen) {
            sendingdata.id = editcategory.categoryid;
            setshowload(true);
            dispatch(updateCategory(sendingdata)).then(() => {
                setMessageAlert(true);
                setshowload(false);
                dispatch(getCategories());
            });
        } else {
            setshowload(true);
            await dispatch(addCategory(sendingdata)).then(() => {
                setMessageAlert(true);
                setshowload(false);
                dispatch(getCategories());
            });
        }
    }
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
                    <CSVExport data={rows} filename="Category.csv" header={columns} />
                </Stack>
            }

        >
            {showload ? <Loader /> : ''}
                  <SnackbarAlert open={MessageAlert} onClose={handleClickCloseAddAlert} message={SnackBarmessage.message} severity={SnackBarmessage.color} />

            <Dialog maxWidth="xs" fullWidth="true" open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                {open && (
                    <>
                        <DialogTitle id="form-dialog-title">{EditOpen ? 'Edit Category':'Add Category'}</DialogTitle>
                        <DialogContent>
                            <Box sx={{ flexGrow: 2 }}>
                                <form onSubmit={formik.handleSubmit} id="validation-forms">
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={12}>
                                            <InputLabel id="demo-simple-select-label">Category Name</InputLabel>
                                            <div className="row" style={{ marginTop: '10px' }}></div>
                                            <TextField
                                                fullWidth
                                                id="categoryname"
                                                name="categoryname"
                                                label="Category Name"
                                                inputProps={{
                                                    autoComplete: 'none'
                                                }}
                                                value={formik.values.categoryname}
                                                onChange={formik.handleChange}
                                                error={formik.touched.categoryname && Boolean(formik.errors.categoryname)}
                                                helperText={formik.touched.categoryname && formik.errors.categoryname}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                    <InputLabel id="icon-label">Category Icon</InputLabel>
                                    <div className="row" style={{ marginTop: '10px' }}></div>
                                    <input
                                        accept=".png,.svg"
                                        id="icon"
                                        name="icon"
                                        type="file"
                                        onChange={(event) => {
                                        const file = event.currentTarget.files[0];
                                        if (!file) return;

                                        // Validate file type
                                        if (!['image/png', 'image/svg+xml'].includes(file.type)) {
                                            alert('Only PNG or SVG images are allowed');
                                            return;
                                        }

                                        // Set Formik value for upload
                                        formik.setFieldValue('iconFile', file);

                                        // Preview image
                                        formik.setFieldValue('iconPreview', URL.createObjectURL(file));

                                        // Convert to Base64 for backend upload
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            const base64 = reader.result.split(',')[1]; // remove "data:*/*;base64,"
                                            formik.setFieldValue('iconBase64', base64);
                                            formik.setFieldValue('iconName', file.name);
                                        };
                                        reader.readAsDataURL(file);
                                        }}
                                    />
                                    {formik.values.iconPreview && (
                                        <Box mt={2}>
                                        <img
                                            src={formik.values.iconPreview}
                                            alt="preview"
                                            style={{
                                            width: 100,
                                            height: 100,
                                            objectFit: 'contain',
                                            borderRadius: '8px',
                                            border: '1px solid #ccc',
                                            }}
                                        />
                                        </Box>
                                    )}
                                    </Grid>


                                    <br />
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