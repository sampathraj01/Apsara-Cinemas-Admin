
import React, { useEffect , useState  } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import MainCard from 'ui-component/cards/MainCard';
import { Button, Grid } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import { FormControl , FormHelperText } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { dispatch, useSelector } from '../store/index';
import moment from 'moment-timezone';
// import '../mago_pages/style.css'
import DailyReportEntriesTemplate from '../reports_template/dailyreports_template'

import { Stack } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Loader from 'ui-component/Loader';
import '../assets/scss/styles.css'
const API_URL = process.env.REACT_APP_LOCAL_API_URL;

import { getallEmpName } from 'redux/actions/manualattendanceAction';
import { getDailyEntriesReports } from 'redux/actions/ReportsAction';

import SnackbarAlert from '../../src/mago_pages/component/SnackbarAlert';
import axios from '../../src/utils/axios'

// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';

// pdfMake.vfs = pdfFonts.pdfMake.vfs;

const validationSchema = yup.object({ 
    fromdate : yup.string().required('Fromdate is required'),
});


export default function LocationReports() { 

    const { allempnames } = useSelector((data) => data.allempname);
    const { dailyentriesreports } = useSelector((data) => data.dailyentriesreport);
    const [showload, setshowload] = React.useState(false);
    const [ senddata , setsenddata ] = useState({})
    const [ show , setshow ] = useState(false);

    const [messageAlert, setMessageAlert] = useState(false);
    const [SnackBarmessage, SetSnackBarmessage] = useState({});

    // const [ datas, setdatas ] = useState({})
    
    // const companyid = localStorage.getItem('selectedCompany');

    useEffect(() => {
        dispatch(getallEmpName())
    }, []);
    
    useEffect(() => {
        console.log("allempnames",allempnames)
        console.log("dailyentriesreports",dailyentriesreports)
    }, [allempnames,dailyentriesreports]);


    const Formik = useFormik({
        initialValues: {
            fromdate :  moment().tz('Asia/Kolkata').format('YYYY-MM-DD'),
            employeeid :  ''
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            const sendingdata = {
                fromdate : values.fromdate,
                employeeid : values.employeeid,
                accountyear : localStorage.getItem('accountyear')
            }
            setsenddata(sendingdata)
            // setdatas({
            //     fromdate : moment(values.fromdate).format('DD-MM-YYYY'),
            //     todate : moment(values.todate).format('DD-MM-YYYY'),
            //     customerid : moment(values.customerid).format('DD-MM-YYYY'),
            // })
            setshowload(true)
            dispatch(getDailyEntriesReports(sendingdata)).then(()=>{
                setshowload(false)
                setshow(true)
            })
        }
    });

    const downloadPDF = async () => {
        setshowload(true)
        try {

            const response = await axios.post(`${API_URL}dailyentryreport/dailyentriesreportpdfstream`,
                {
                    fromdate :senddata.fromdate,
                    employeeid : senddata.employeeid,
                    accountyear : localStorage.getItem('accountyear'),
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
            link.setAttribute('download', `dailyentriesreport.pdf`);
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
                        <InputLabel id="demo-simple-select-label"> Date *</InputLabel>
                        <div className='row' style={{ marginTop: '10px' }}></div>
                        <TextField
                            id="fromdate"
                            name="fromdate"
                            label="Date (DD/MM/YYYY)"
                            type="date"
                            InputLabelProps={{ shrink: true, }}
                            fullWidth
                            inputProps={{
                                min: moment(localStorage.getItem('fromdate')).format('YYYY-MM-DD'),
                                max: moment(localStorage.getItem('todate')).format('YYYY-MM-DD')
                            }}
                            value={Formik.values.fromdate}
                            onChange={Formik.handleChange}
                            error={Formik.touched.fromdate && Boolean(Formik.errors.fromdate)}
                            helperText={Formik.touched.fromdate && Formik.errors.fromdate}
                        />
                    </Grid>
                    

                    <Grid item xs={12} md={3}>
                        <InputLabel id="demo-simple-select-label">Choose Employee</InputLabel>
                        <div className="row" style={{ marginTop: '10px' }}></div>
                        <FormControl fullWidth error={Boolean(Formik.errors.employeeid)}>
                            <Autocomplete
                                id="shoprefid"
                                options={allempnames}
                                getOptionLabel={(option) => option.fullName}
                                isOptionEqualToValue={(option, value) => option._id === value}
                                value={allempnames.find(data => data._id === Formik.values.employeeid) || null}
                                onChange={(event, newValue) => {
                                    if (newValue) {
                                        Formik.setFieldValue("employeeid", newValue._id);
                                                 
                                    } else {
                                        Formik.setFieldValue("employeeid", "");
                                    }
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Choose Employee"
                                        error={Boolean(Formik.errors.employeeid)}
                                    />
                                )}
                            />
                            {Formik.errors.employeeid && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {Formik.errors.employeeid}
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
                </>
                }
        >
        { showload ? <Loader /> : ''}
        <SnackbarAlert open={messageAlert} onClose={handleClickCloseAddAlert} message={SnackBarmessage.data} severity={SnackBarmessage.color} />         
        { 
        show && dailyentriesreports.length>0 
        ?
        <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' ,paddingRight: 20, paddingTop:10 }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                    <button onClick={downloadPDF} className="pdficon">
                        <PictureAsPdfIcon />
                    </button>
                </Stack>
            </div>
            <div style={{ padding: 30 }}>
                <DailyReportEntriesTemplate reports={dailyentriesreports} />
            </div>
        </>
        :
        ''
        }
        </MainCard>
    )
}