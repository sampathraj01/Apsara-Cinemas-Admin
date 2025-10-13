
import React, { useEffect , useState } from 'react';
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
import axios from '../../src/utils/axios'

import { CSVExport } from '../../src/views/forms/tables/TableExports';
import { Stack } from '@mui/material';

import { getAttendanceReports } from 'redux/actions/ReportsAction';

import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Loader from 'ui-component/Loader';
import '../assets/scss/styles.css'
const API_URL = process.env.REACT_APP_LOCAL_API_URL;
import SnackbarAlert from '../../src/mago_pages/component/SnackbarAlert';

const validationSchema = yup.object({ 
    fromdate : yup.string().required('FromDate is required'),
    todate : yup.string().required(' ToDate is required'),
});


export default function PaymentReports() { 

    const { attendancereports } = useSelector((data) => data.attendancereport);
    const [ rows, setRows] = useState([]);
    const [ columns, setColumns] = useState([]);

    const [showload, setshowload] = React.useState(false);

    const [messageAlert, setMessageAlert] = useState(false);
    const [SnackBarmessage, SetSnackBarmessage] = useState({});

    const getCurrentMonthStartDate = () => {
        const now = new Date();
        const year = now.getUTCFullYear(); 
        const month = now.getUTCMonth(); 
        const startOfMonth = new Date(Date.UTC(year, month, 1));
        return startOfMonth.toISOString().split('T')[0];
    };

    const getCurrentDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    const [ datas, setdatas ] = useState({
        fromdate : getCurrentMonthStartDate(),
        todate :getCurrentDate()
    })
    
    const theme = useTheme();

    useEffect(() => {
        setshowload(true);
        dispatch(getAttendanceReports({
            fromDate: datas.fromdate,
            toDate: datas.todate,
        })).finally(() => {
            setshowload(false);
        });
    }, [datas.fromdate, datas.todate]);

    useEffect(() => {
        console.log("attendancereports",attendancereports)
        if(attendancereports.empAttendanceDetails && attendancereports.dayDateData )
            addTableReportsGrid(attendancereports.empAttendanceDetails , attendancereports.dayDateData);
    }, [attendancereports]);

    // const openMap = (longitude,latitude) => {
    //     const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    //     window.open(url, '_blank');
    // };

    const addTableReportsGrid = async (employee,daysreport) => {

        const modifiedRowsPromise = Promise.all(
            employee.map((row, index) => ({
                id: index + 1,
                employeeName: row.employeeName,
                ...row.attendanceDetails.reduce((acc, detail) => {
                    acc[`dayStatus${detail.day, detail.date}`] = detail.attendance;
                    return acc;
                }, {}),
            }))
        );

        const modifiedColumnsPromise = Promise.all(
            daysreport.map((day,index) => ({
                id: index + 1,
                field: `dayStatus${day.day, day.date}`,
                headerName: (
                    <>
                        <div style={{ marginTop: '8px' }}></div>
                        {day.day}
                        <br />
                        <div style={{ marginTop: '-29px' }}></div>
                        {moment(day.date, 'YYYY/MM/DD').format('DD/MM/YYYY')}
                    </>
                ),
                width: 140,
                height: 700
            }))
        );

        const [ modifiedRows , modifiedColumns ] = await Promise.all([
            modifiedRowsPromise,
            modifiedColumnsPromise
        ]);

        const combinedRows = modifiedRows.map((row) => ({
            ...row,
            ...modifiedColumns.reduce((acc, column) => {
                acc[column.field] = row[column.field];
                return acc;
            }, {}),
        }));

        const dynamicColumns = [
            { field: 'id', headerName: 'S.No.', width: 70 },
            { field: 'employeeName', headerName: 'Employee Name', width: 170 },
            ...modifiedColumns,
            // { field: 'lopCount', headerName: 'Lop Count', width: 200 },
        ];

        setRows(combinedRows);
        setColumns(dynamicColumns);
    };

    const downloadPDF = async () => {
        setshowload(true)
        try {
            const response = await axios.post(`${API_URL}reportspdfstream/monthattendancereportspdfstream`,
                {
                    fromDate: datas.fromdate,
                    toDate: datas.todate,
                    createdempid: window.localStorage.getItem('empid'),
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
            link.setAttribute('download', `${datas.fromdate} - ${datas.todate} - MonthattendanceReports.pdf`);
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


    const Formik = useFormik({
        initialValues: {
            fromdate :  '',
            todate :  ''
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            const sendingdata = {
                fromDate : values.fromdate,
                toDate : values.todate,
            }
            setdatas({
                fromdate : values.fromdate,
                todate : values.todate
            })
            setshowload(true)
            dispatch(getAttendanceReports(sendingdata)).then(()=>{
                setshowload(false)
            })
        }
    });

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
                    <br/>
                    <hr/>
                    
                       
                    <Box
                        sx={{
                            height: 650,
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
                                    Selected From Date : <span style={{color:'#2196f3'}}> {moment(datas.fromdate).format('DD-MM-YYYY')} </span>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    Selected To Date : <span style={{color:'#2196f3'}}> {moment(datas.todate).format('DD-MM-YYYY')}</span>
                                </div>
                            </div>

                            <div>
                                <Stack direction="row" spacing={2} alignItems="flex-start">
                                    <CSVExport data={rows} filename={`${datas.fromdate} & ${datas.todate}-AttendanceReports.csv`} header={columns} />
                                    
                                    <button onClick={downloadPDF} className="pdficon">
                                        <PictureAsPdfIcon />
                                    </button>

                                </Stack>
                            </div>
                        </div>
                        <br/>
                        { attendancereports
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
                        ''
                        }
                    </Box>
                    
        </>
            }
        >
        { showload ? <Loader /> : ''}
        <SnackbarAlert open={messageAlert} onClose={handleClickCloseAddAlert} message={SnackBarmessage.data} severity={SnackBarmessage.color} />
                 
        </MainCard>
    )
}