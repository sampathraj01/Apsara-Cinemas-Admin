
import React, { useEffect , useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import MainCard from 'ui-component/cards/MainCard';
import { Button, Grid , FormHelperText } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import { FormControl } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { dispatch, useSelector } from '../store/index';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import moment from 'moment';
import { CSVExport } from '../../src/views/forms/tables/TableExports';
import { Stack } from '@mui/material';
import '../assets/scss/styles.css'
import Loader from 'ui-component/Loader';

import SnackbarAlert from '../../src/mago_pages/component/SnackbarAlert';
import axios from '../../src/utils/axios'

import { getallEmpName } from 'redux/actions/manualattendanceAction';
import { getLocationReports } from 'redux/actions/ReportsAction';

const API_URL = process.env.REACT_APP_LOCAL_API_URL;

const validationSchema = yup.object({ 
    date : yup.string().required('Date is required'),
    empid : yup.string().required('Employee Name is required'),
});


export default function LocationReports() { 

    const { allempnames } = useSelector((data) => data.allempname);
    const { locationreports } = useSelector((data) => data.locationreport);
    const [showload, setshowload] = React.useState(false);
    const [ show , setshow ] = useState(false);
    const [ rows, setRows] = useState([]);
    const [ columns, setColumns] = useState([]);
    const [ datas, setdatas ] = useState({})
    const [ senddata , setsenddata ] = useState({})

    const [messageAlert, setMessageAlert] = useState(false);
    const [SnackBarmessage, SetSnackBarmessage] = useState({});
    
    const theme = useTheme();

    useEffect(() => {
        dispatch(getallEmpName())
    }, []);

    useEffect(() => {
        console.log("allempnames",allempnames)
        console.log("locationreports",locationreports)
        addTableReportsGrid();
    }, [allempnames,locationreports]);

    const openMap = (longitude,latitude) => {
        const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
        window.open(url, '_blank');
    };

    const addTableReportsGrid = async () => {
        const modifiedRows = await Promise.all(
            locationreports.map((row, index) => ({
                id : index+1,
                sno : index+1,
                company: row.companyname,
                type: row.table,
                customername: row.customername,
                //details: row.details,
                latitude: row.latitude,
                longitude: row.longitude,
                location: row.location,
                createdbyname : row.createdbyname,
                timestamp : row.timestamp,
            }))
        );

        const modifiedColumns = [
            { field: 'sno', headerName: 'S.No.', width: 70 },
            { field: 'company', headerName: 'Company Name', width: 200  },
            { field: 'type', headerName: 'Type', width: 150 },
            { field: 'customername', headerName: 'Vendor Name', width: 200 },
            // {
            //     field: 'details',
            //     headerName: 'Details',
            //     width: 350,
            //     renderCell: (params) => (
            //         <>
            //         <div style={{ whiteSpace: 'normal', wordWrap: 'break-word', overflowWrap: 'break-word', height: '100%', display: 'flex', alignItems: 'center' }}>
            //             {params.row.details}
            //         </div>
            //         </>
            //     )
            // },
            {
                field: 'longitude',
                headerName: 'Location',
                width: 250,
                renderCell: (params) => (
                    <>
                    <div>
                    Logitude : {params.row.longitude}
                    <br/>
                    Latitude : {params.row.latitude}
                    <br/>
                    Location : {params.row.location}
                    <br/>
                    <a href="#" onClick={() => { openMap(params.row.longitude,params.row.latitude); }} target="_blank">Open a Map</a>
                    </div>
                    </>
                )
            },
            { field: 'timestamp', headerName: 'Created Time', width: 150  },
        ];

        setRows(modifiedRows);
        setColumns(modifiedColumns);
    };

    const downloadPDF = async () => {
        setshowload(true)
        try {

            const response = await axios.post(`${API_URL}reportspdfstream/locationreportspdfstream`,
                {
                    empid: senddata.empid,
                    date: senddata.date,
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
            link.setAttribute('download', `${datas.date}-${datas.empname}.pdf`);
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
    
    
    const Formik = useFormik({
        initialValues: {
            date :  '',
            empid :  ''
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            const sendingdata = {
                date : values.date,
                empid : values.empid,
            }
            setsenddata(sendingdata)
            setdatas({
                date : moment(values.date).format('DD-MM-YYYY'),
                empname : allempnames.find(item => String(item._id) === String(values.empid))?.fullName
            })
            setshowload(true)
            dispatch(getLocationReports(sendingdata)).then(()=>{
                setshowload(false)
                setshow(true)
            })
        }
    });

    

    return (
        <MainCard
            content={false}
            title={
                <>
                  <form onSubmit={Formik.handleSubmit} id="validation-forms">
                    <Grid container spacing={3}>

                    <Grid item xs={12} md={3}>
                        <InputLabel id="demo-simple-select-label">Date *</InputLabel>
                        <div className='row' style={{ marginTop: '10px' }}></div>
                        <TextField
                            id="date"
                            name="date"
                            label="Date (DD/MM/YYYY)"
                            type="date"
                            InputLabelProps={{ shrink: true, }}
                            fullWidth
                            value={Formik.values.date}
                            onChange={Formik.handleChange}
                            error={Formik.touched.date && Boolean(Formik.errors.date)}
                            helperText={Formik.touched.date && Formik.errors.date}
                            inputProps={{
                                min: moment(localStorage.getItem('fromdate')).format('YYYY-MM-DD'),
                                max: moment(localStorage.getItem('todate')).format('YYYY-MM-DD')
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <InputLabel id="demo-simple-select-label">Select Employee *</InputLabel>
                        <div className='row' style={{ marginTop: '10px' }}></div>
                        <FormControl fullWidth error={Boolean(Formik.errors.empid)}>
                            <Autocomplete
                                id="shoprefid"
                                options={allempnames}
                                getOptionLabel={(option) => option.fullName}
                                isOptionEqualToValue={(option, value) => option._id === value}
                                value={allempnames.find(data => data._id === Formik.values.empid) || null}
                                onChange={(event, newValue) => {
                                    if (newValue) {
                                        Formik.setFieldValue("empid", newValue._id);
                                    } else {
                                        Formik.setFieldValue("empid", "");
                                    }
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Choose Employee"
                                        error={Boolean(Formik.errors.empid)}
                                    />
                                )}
                            />
                            {Formik.errors.empid && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {Formik.errors.empid}
                                </FormHelperText>
                            )}
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
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ marginRight: '20px' }}> 
                                    Selected Date : <span style={{color:'#2196f3'}}> {datas.date} </span>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    Selected Employee : <span style={{color:'#2196f3'}}> {datas.empname} </span>
                                </div>
                            </div>

                            <div>
                            <Stack direction="row" spacing={2} alignItems="flex-start">
                                <CSVExport data={rows} filename={`${datas.date} & ${datas.empname}-LocationReports.csv`} header={columns} />
                                
                                <button onClick={downloadPDF} className="pdficon">
                                    <PictureAsPdfIcon />
                                </button>

                            </Stack>
                            </div>
                        </div>
                        <br/>
                        { locationreports.length > 0 
                        ?
                        <>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[10]}
                            rowHeight={100} 
                        />
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