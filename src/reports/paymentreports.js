
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import MainCard from 'ui-component/cards/MainCard';
import { Button, Grid } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import { dispatch, useSelector } from '../store/index';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import moment from 'moment';
import { CSVExport } from '../../src/views/forms/tables/TableExports';
import { Stack } from '@mui/material';

import { getPaymentReports } from 'redux/actions/ReportsAction';

import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Loader from 'ui-component/Loader';
import '../assets/scss/styles.css'
const API_URL = process.env.REACT_APP_LOCAL_API_URL;

import SnackbarAlert from '../../src/mago_pages/component/SnackbarAlert';
import axios from '../../src/utils/axios'

const validationSchema = yup.object({
    fromdate: yup.string().required('FromDate is required'),
    todate: yup.string().required(' ToDate is required'),
});


export default function PaymentReports() {

    const { paymentreports } = useSelector((data) => data.paymentreport);
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);
    const [datas, setdatas] = useState({})
    const [showload, setshowload] = React.useState(false);
    const [show, setshow] = useState(false);
    const [senddata, setsenddata] = useState({})

    const [messageAlert, setMessageAlert] = useState(false);
    const [SnackBarmessage, SetSnackBarmessage] = useState({});

    const theme = useTheme();

    const companyid = localStorage.getItem('selectedCompany');

    useEffect(() => {
        console.log("paymentreports", paymentreports)
        addTableReportsGrid();
    }, [paymentreports]);

    // const openMap = (longitude,latitude) => {
    //     const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    //     window.open(url, '_blank');
    // };

    const addTableReportsGrid = async () => {
        const modifiedRows = await Promise.all(
            paymentreports.map((row, index) => ({
                id: index,
                sno: index + 1,
                name: row.shopName,
                date: moment(row.date).format('DD-MM-YYYY'),
                companyname: row.companyName,
                paymentmode: row.paymentmode,
                amount: `Rs.${row.amount}`,
                chqno: row.chqno ? row.chqno : null,
                chqdate: row.chqdate ? moment(row.chqdate).format('DD-MM-YYYY') : null,
                upi: row.upi ? row.upi : null,
                description: row.description ? row.description : null,
                longitude: row.longitude,
                latitude: row.latitude,
                location: row.location,
                createdbyname: row.createdemployeename,
                createdtimestamp: moment(row.createdtimestamp).format('DD-MM-YYYY hh:mm:ss A'),
                updatedbyname: row.updatedemployeename ? row.updatedemployeename : '',
                updatedtimestamp: row.updatedtimestamp ? moment(row.updatedtimestamp).format('DD-MM-YYYY hh:mm:ss A') : '',
            }))
        );

        const modifiedColumns = [
            { field: 'sno', headerName: 'S.No.', width: 70 },
            { field: 'companyname', headerName: 'Company Name', width: 200 },
            { field: 'name', headerName: 'Vendor Name', width: 200 },
            { field: 'date', headerName: 'Payment Date', width: 200 },
            { field: 'paymentmode', headerName: 'Payment Mode', width: 150 },
            { field: 'amount', headerName: 'Amount', width: 120 },
            {
                field: 'details',
                headerName: 'Payment Details',
                width: 250, height: 250,
                renderCell: (params) => (
                    <>
                        <div>
                            {params.row.paymentmode === 'Cash In Hand' ?
                                '-'
                                :
                                ''
                            }
                            <br />
                            {params.row.paymentmode === 'Cheque' ?
                                <>
                                    Cheque No : {params.row.chqno}
                                    <br />
                                    Cheque Date : {params.row.chqdate}
                                </>
                                :
                                ''
                            }
                            {params.row.paymentmode === 'NetBanking/UPI' ?
                                <>
                                    UPI ID : {params.row.upi}
                                    <br />
                                </>
                                :
                                ''
                            }
                        </div>
                    </>
                )
            },
            // {
            //     field: 'longitude',
            //     headerName: 'Location',
            //     width: 350,
            //     renderCell: (params) => (
            //         <>
            //         <div>
            //         Logitude : {params.row.longitude}
            //         <br/>
            //         Latitude : {params.row.latitude}
            //         <br/>
            //         Location : {params.row.location}
            //         <br/>
            //         <a href="#" onClick={() => { openMap(params.row.longitude,params.row.latitude); }} target="_blank">Open a Map</a>
            //         </div>
            //         </>
            //     )
            // },
            {
                field: 'createdbyname',
                headerName: 'Created By',
                width: 200, height: 250,
                renderCell: (params) => (
                    <>
                        <div>
                            {params.row.createdbyname}
                            <br />
                            {params.row.createdtimestamp}
                            <br />
                        </div>
                    </>
                )
            },
            {
                field: 'updatedbyname',
                headerName: 'Updated By',
                width: 200, height: 200,
                renderCell: (params) => (
                    <>
                        <div>
                            {params.row.updatedbyname}
                            <br />
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
            fromdate: '',
            todate: ''
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            const sendingdata = {
                fromDate: values.fromdate,
                toDate: values.todate,
                companyid: companyid
            }
            setsenddata(sendingdata)
            setdatas({
                fromdate: moment(values.fromdate).format('DD-MM-YYYY'),
                todate: moment(values.todate).format('DD-MM-YYYY')
            })
            setshowload(true)
            dispatch(getPaymentReports(sendingdata)).then(() => {
                setshowload(false)
                setshow(true)
            })
        }
    });

    const downloadPDF = async () => {
        setshowload(true)
        try {

            const response = await axios.post(`${API_URL}reportspdfstream/paymentreportspdfstream`,
                {
                    fromDate: senddata.fromDate,
                    toDate: senddata.toDate,
                    companyid: companyid
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
            link.setAttribute('download', `${datas.fromdate}-${datas.todate}-PaymentReports.pdf`);
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


                            <Grid item xs={12} md={2}>
                                <div className='row' style={{ marginTop: '40px' }}></div>
                                <Button variant="contained" size="small" type="submit">
                                    Submit
                                </Button>

                            </Grid>
                        </Grid>
                    </form>
                    <br />
                    <hr />
                    {
                        show
                            ?
                            <>
                                <Box
                                    sx={{
                                        height: 700,
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
                                                Selected From Date : <span style={{ color: '#2196f3' }}> {datas.fromdate} </span>
                                                &nbsp;&nbsp;&nbsp;&nbsp;
                                                Selected To Date : <span style={{ color: '#2196f3' }}> {datas.todate} </span>
                                            </div>
                                        </div>

                                        <div>
                                            <Stack direction="row" spacing={2} alignItems="flex-start">
                                                <CSVExport data={rows} filename={`${datas.fromdate} to ${datas.todate}-PaymentReports.csv`} header={columns} />

                                                <button onClick={downloadPDF} className="pdficon">
                                                    <PictureAsPdfIcon />
                                                </button>
                                            </Stack>
                                        </div>
                                    </div>
                                    <br />
                                    {paymentreports.length > 0
                                        ?
                                        <>
                                            <DataGrid
                                                rows={rows}
                                                columns={columns}
                                                pageSize={5}
                                                rowsPerPageOptions={[10]}
                                                rowHeight={100}
                                            />
                                            <br /><br />
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
        {showload ? <Loader /> : ''}
        <SnackbarAlert open={messageAlert} onClose={handleClickCloseAddAlert} message={SnackBarmessage.data} severity={SnackBarmessage.color} />                 
        </MainCard>
    )
}