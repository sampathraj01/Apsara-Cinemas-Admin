
import React, { useEffect , useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import MainCard from 'ui-component/cards/MainCard';
import { Button, Grid } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import { dispatch, useSelector } from '../store/index';
// import '../mago_pages/style.css'
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import moment from 'moment';
import { CSVExport } from '../../src/views/forms/tables/TableExports';
import { Stack } from '@mui/material';

import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Loader from 'ui-component/Loader';
import '../assets/scss/styles.css'
const API_URL = process.env.REACT_APP_LOCAL_API_URL;

import SnackbarAlert from '../../src/mago_pages/component/SnackbarAlert';
import axios from '../../src/utils/axios'

import { getPunchinReports } from 'redux/actions/ReportsAction';

const validationSchema = yup.object({ 
    date : yup.string().required('date is required'),
});


export default function OrderReports() { 

    const { punchinreports } = useSelector((data) => data.punchinreport);
    const [ rows, setRows] = useState([]);
    const [ columns, setColumns] = useState([]);
    const [showload, setshowload] = React.useState(false);
    const [ senddata , setsenddata ] = useState({})

    const [messageAlert, setMessageAlert] = useState(false);
    const [SnackBarmessage, SetSnackBarmessage] = useState({});
    
    const theme = useTheme();
    const currentdate = new Date()
    const formatteddate = moment(currentdate).format('YYYY-MM-DD')
    
    const [ datas, setdatas ] = useState({
        date : moment(currentdate).format('DD-MM-YYYY')
    })

    useEffect(() => {
       setshowload(true)
       setsenddata({
            date : formatteddate
       })
       dispatch(getPunchinReports(formatteddate)).then(()=>{
            setshowload(false)
       })
    }, []);

    useEffect(() => {
        console.log("punchinreports",punchinreports)
        addTableReportsGrid();
    }, [punchinreports]);


    const openMap = (longitude,latitude) => {
        const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
        window.open(url, '_blank');
    };

    const addTableReportsGrid = async () => {
        const modifiedRows = await Promise.all(
            punchinreports.map((row, index) => ({
                id: row._id,
                sno : index+1,
                empname : row.employeeName,
                punchintime : row.punchInTime,
                punchouttime : row.punchOutTime ?  row.punchOutTime : '-',
                punchinlatitude : row.punchInLatitude,
                punchinlongitude : row.punchInLongitude,
                punchinlocation : row.punchInLocation,
                punchoutlatitude : row.punchOutLatitude,
                punchoutlongitude : row.punchOutLongitude,
                punchoutlocation : row.punchOutLocation,
            }))
        );

        const modifiedColumns = [
            { field: 'sno', headerName: 'S.No.', width: 70 },
            { field: 'empname', headerName: 'Employee Name', width: 200 },
            { field: 'punchintime', headerName: 'Punch In Time', width: 140 },
            { field: 'punchouttime', headerName: 'Punch Out Time', width: 140 },
            {
                field: 'punchinlatitude',
                headerName: 'Punch In',
                width: 300,height: 200,
                renderCell: (params) => (
                    <>
                    <div>
                    { (params.row.punchinlatitude !== null)
                    ?
                    <>
                        Latitude : {params.row.punchinlatitude}
                        <br/>
                        Longitude : {params.row.punchinlongitude}
                        <br/>
                        Location : {params.row.punchinlocation}
                        <br/>
                        <a href="#" onClick={() => { openMap(params.row.punchinlongitude,params.row.punchinlatitude); }} target="_blank">Open a Map</a>
                    </>
                    :
                    <>
                        {params.row.punchinlocation ? params.row.punchinlocation : '-'}
                    </>
                    }
                    </div>
                    </>
                )
            },
            {
                field: 'punchoutlatitude',
                headerName: 'Punch Out',
                width: 300,height: 200,
                renderCell: (params) => (
                    <>
                    <div>
                    { (params.row.punchoutlongitude)
                    ?
                    <>
                    Latitude : {params.row.punchoutlatitude}
                    <br/>
                    Longitude : {params.row.punchoutlongitude}
                    <br/>
                    Location : {params.row.punchoutlocation}
                    <br/>
                    <a href="#" onClick={() => { openMap(params.row.punchoutlongitude,params.row.punchoutlatitude); }} target="_blank">Open a Map</a>
                    </>
                    :
                    <>
                        {params.row.punchoutlocation ? params.row.punchoutlocation : '-'}
                    </>
                    }
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
            date :  formatteddate,
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            setdatas({
                date : moment(values.date).format('DD-MM-YYYY'),
            })
            setsenddata({
                date : values.date
           })
            setshowload(true)
            dispatch(getPunchinReports(values.date)).then(()=>{
                    setshowload(false)
            })
        }
    });

    const downloadPDF = async () => {
        setshowload(true)
        try {

            const response = await axios.post(`${API_URL}reportspdfstream/punchinreportspdfstream`,
                {
                    date : senddata.date,
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
            link.setAttribute('download', `${datas.date}-PunchinReports.pdf`);
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
                                    Selected Date : <span style={{color:'#2196f3'}}> {datas.date} </span>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                </div>
                            </div>

                            <div>
                            <Stack direction="row" spacing={2} alignItems="flex-start">
                                <CSVExport data={rows} filename={`${datas.date}-punchinReports.csv`} header={columns} />
                            
                                <button onClick={downloadPDF} className="pdficon">
                                    <PictureAsPdfIcon />
                                </button>
                            </Stack>
                            </div>
                        </div>
                        <br/>
                        
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                pageSize={5}
                                rowHeight={100} 
                            />
                            <br/><br/>
                    
                    </Box>
                    
        </>
            }
        >
        { showload ? <Loader /> : ''}
        <SnackbarAlert open={messageAlert} onClose={handleClickCloseAddAlert} message={SnackBarmessage.data} severity={SnackBarmessage.color} />                 
        </MainCard>
    )
}