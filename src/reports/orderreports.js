
import React, { useEffect , useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import MainCard from 'ui-component/cards/MainCard';
import { Button, Grid } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import { dispatch, useSelector } from '../store/index';
// import '../mago_pages/style.css'
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import moment from 'moment';
import { CSVExport } from '../../src/views/forms/tables/TableExports';
import { Autocomplete, TextField,  FormControl } from "@mui/material";
import { Stack } from '@mui/material';

import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Loader from 'ui-component/Loader';
import '../assets/scss/styles.css'
const API_URL = process.env.REACT_APP_LOCAL_API_URL;

import SnackbarAlert from '../../src/mago_pages/component/SnackbarAlert';
import axios from '../../src/utils/axios'

import { getOrderReports } from 'redux/actions/ReportsAction';
import { getCustomerDropdown  } from 'redux/actions/customerAction';

const validationSchema = yup.object({ 
    fromdate : yup.string().required('FromDate is required'),
    todate : yup.string().required(' ToDate is required'),
});


export default function OrderReports() { 

    const { orderreports } = useSelector((data) => data.orderreport);
    const { customers } = useSelector((data) => data.customer);
    const [ rows, setRows] = useState([]);
    const [ columns, setColumns] = useState([]);
    const [ datas, setdatas ] = useState({})
    const [showload, setshowload] = React.useState(false);
    const [ show , setshow ] = useState(false);
    const [ senddata , setsenddata ] = useState({})

    const [messageAlert, setMessageAlert] = useState(false);
    const [SnackBarmessage, SetSnackBarmessage] = useState({});
    
    const theme = useTheme();
    const companyid = localStorage.getItem('selectedCompany');


    useEffect(() => {
        dispatch(getCustomerDropdown(companyid));
    }, []);

    useEffect(() => {
        console.log("customers",customers)
    }, [customers]);

    useEffect(() => {
        console.log("orderreports",orderreports)
        addTableReportsGrid();
    }, [orderreports]);

    // const openMap = (longitude,latitude) => {
    //     const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    //     window.open(url, '_blank');
    // };

    const showcustomerdetails = (customerrefid) => {
        const a =  customers.filter(item => String(item._id) === String(customerrefid))
        console.log("Customer ID",customerrefid)
        console.log("Customer Details",a[0])
        
    }

    const addTableReportsGrid = async () => {
        const modifiedRows = await Promise.all(
            orderreports.map((row, index) => ({
                id: row.id,
                sno : index+1,
                companyname : row.companyname,
                customername : row.customername,
                orderdate : row.orderdate,
                orderno : row.orderno,
                productname : row.productname,
                productprice : row.productprice,
                qty : row.qty,
                total : row.total,
                createdbyname : row.createdemployeename,
                createdtimestamp : row.createdtimestamp ? row.createdtimestamp : '',
                updatedbyname : row.updatedemployeename ? row.updatedemployeename : '',
                updatedtimestamp :  row.updatedtimestamp ? row.updatedtimestamp : '', 
            }))
        );

        const modifiedColumns = [
            { field: 'sno', headerName: 'S.No.', width: 70 },
            { field: 'companyname', headerName: 'Company Name', width: 200 },
            { field: 'customername', headerName: 'Vendor Name', width: 200 },
            { field: 'orderdate', headerName: 'Order Date', width: 160 },
            { field: 'orderno', headerName: 'Order No', width: 200 },
            { field: 'productname', headerName: 'Product Name', width: 200 },
            {
                field: 'productprice',
                headerName: 'Product Price',
                width: 200,
                renderCell: (params) => (
                    <>
                    <div>
                    Rs.{params.row.productprice}
                    <br/>
                    </div>
                    </>
                )
            },
            { field: 'qty', headerName: 'Quantity', width: 150 },
            {
                field: 'total',
                headerName: 'Total Price',
                width: 200,
                renderCell: (params) => (
                    <>
                    <div>
                    Rs.{params.row.total}
                    <br/>
                    </div>
                    </>
                )
            },
            
            {
                field: 'createdbyname',
                headerName: 'Created By',
                width: 200,height: 250,
                renderCell: (params) => (
                    <>
                    <div>
                    {params.row.createdbyname}
                    <br/>
                    {params.row.createdtimestamp}
                    <br/>
                    </div>
                    </>
                )
            },
            {
                field: 'updatedbyname',
                headerName: 'Updated By',
                width: 200,height: 200,
                renderCell: (params) => (
                    <>
                    <div>
                    {params.row.updatedbyname}
                    <br/>
                    {params.row.updatedtimestamp}
                    </div>
                    </>
                )
            },
        ];

        setRows(modifiedRows);
        setColumns(modifiedColumns);
    };


    const Formik = useFormik({
        initialValues: {
            fromdate :  '',
            todate :  '',
            customerid : ''
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            const sendingdata = {
                fromDate : values.fromdate,
                toDate : values.todate,
                customerid : values.customerid,
                companyid : companyid,
            }
            setsenddata(sendingdata)
            setdatas({
                fromdate : moment(values.fromdate).format('DD-MM-YYYY'),
                todate : moment(values.todate).format('DD-MM-YYYY')
            })
            setshowload(true)
            dispatch(getOrderReports(sendingdata)).then(()=>{
                setshowload(false)
                setshow(true)
            })
        }
    });

    const downloadPDF = async () => {
        setshowload(true)
        try {

            const response = await axios.post(`${API_URL}reportspdfstream/orderreportspdfstream`,
                {
                    fromDate: senddata.fromDate,
                    toDate: senddata.toDate,
                    customerid : senddata.customerid,
                    companyid : companyid,
                    createdempid : window.localStorage.getItem('empid'),
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    responseType: 'blob',
                }
            );

            if (response.status !== 200) {
                throw new Error('Network response was not ok.');
            }
            
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${datas.fromdate}-${datas.todate}-OrderReports.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url); // Cleanup
            setshowload(false)
        } catch (error) {
            setMessageAlert(true);
            SetSnackBarmessage({
                data: error.response?.data?.message || error.message || 'Failed to generate PDF',
                color: 'error',
            });
            setshowload(false);
        }
    };

    const handleClickCloseAddAlert = () => {
        setMessageAlert(false);
    };

    return (
        <MainCard
            content={false}
            title={
                <>
                  <form onSubmit={Formik.handleSubmit} id="validation-forms">
                    <Grid container spacing={3}>

                    <Grid item xs={12} md={3}>
                        <InputLabel id="demo-simple-select-label">From Date *</InputLabel>
                        <div className='row' style={{ marginTop: '10px' }}></div>
                        <TextField
                            id="fromdate"
                            name="fromdate"
                            label="Date (DD/MM/YYYY)"
                            type="date"
                            InputLabelProps={{ shrink: true, }}
                            fullWidth
                            value={Formik.values.fromdate}
                            onChange={Formik.handleChange}
                            error={Formik.touched.fromdate && Boolean(Formik.errors.fromdate)}
                            helperText={Formik.touched.fromdate && Formik.errors.fromdate}
                            inputProps={{
                                min: moment(localStorage.getItem('fromdate')).format('YYYY-MM-DD'),
                                max: moment(localStorage.getItem('todate')).format('YYYY-MM-DD')
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <InputLabel id="demo-simple-select-label">To Date *</InputLabel>
                        <div className='row' style={{ marginTop: '10px' }}></div>
                        <TextField
                            id="todate"
                            name="todate"
                            label="Date (DD/MM/YYYY)"
                            type="date"
                            InputLabelProps={{ shrink: true, }}
                            fullWidth
                            value={Formik.values.todate}
                            onChange={Formik.handleChange}
                            error={Formik.touched.todate && Boolean(Formik.errors.todate)}
                            helperText={Formik.touched.todate && Formik.errors.todate}
                            inputProps={{
                                min: moment(localStorage.getItem('fromdate')).format('YYYY-MM-DD'),
                                max: moment(localStorage.getItem('todate')).format('YYYY-MM-DD')
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <InputLabel id="demo-simple-select-label">Choose Vednor</InputLabel>
                        <div className="row" style={{ marginTop: '10px' }}></div>
                        <FormControl fullWidth>
                            <Autocomplete
                                id="customer"
                                options={customers}
                                getOptionLabel={(option) => option.shopName}
                                isOptionEqualToValue={(option, value) => option._id === value}
                                value={customers.find(customer => customer._id === Formik.values.customerid) || null}
                                onChange={(event, newValue) => {
                                    if (newValue) {
                                        Formik.setFieldValue("customerid", newValue._id);
                                        showcustomerdetails(newValue._id);
                                    } else {
                                        Formik.setFieldValue("customerid", "");
                                    }
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Choose Vendor"
                                        error={Boolean(Formik.errors.customerid)}
                                    />
                                )}
                            />
                        </FormControl>
                    </Grid>



                    <Grid item xs={12} md={2}>
                        <div className='row' style={{ marginTop: '40px' }}></div>
                        <Button variant="contained" size="small" type="submit">
                            Submit
                        </Button>
                        
                    </Grid>
                    </Grid>
                    </form>  
                    <br/>
                    <hr/>
                    {
                    show
                    ?
                    <>
                    <Box
                        sx={{
                            height: 600,
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
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ marginRight: '20px' }}> 
                                    Selected From Date : <span style={{color:'#2196f3'}}> {datas.fromdate} </span>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    Selected To Date : <span style={{color:'#2196f3'}}> {datas.todate} </span>
                                </div>
                            </div>

                            <div>
                            <Stack direction="row" spacing={2} alignItems="flex-start">
                                <CSVExport data={rows} filename={`${datas.fromdate} to ${datas.todate}-OrderReports.csv`} header={columns} />
                            
                                <button onClick={downloadPDF} className="pdficon">
                                    <PictureAsPdfIcon />
                                </button>
                            </Stack>
                            </div>
                        </div>
                        <br/>
                        { orderreports.length > 0 
                        ?  
                        <>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                pageSize={5}
                                rowsPerPageOptions={[10]}
                                rowHeight={80} 
                            />
                            <br/><br/>
                        </>
                        :
                        'No Data'
                        }
                    </Box>
                    </>
                    :
                    ''
                    }
        </>
            }
        >
         
        { showload ? <Loader /> : ''}
        <SnackbarAlert open={messageAlert} onClose={handleClickCloseAddAlert} message={SnackBarmessage.data} severity={SnackBarmessage.color} />                 
            
        </MainCard>
    )
}