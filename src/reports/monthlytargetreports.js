
import React, { useEffect , useState    } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import MainCard from 'ui-component/cards/MainCard';
import { Button, Grid , FormHelperText } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import { FormControl } from '@mui/material';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { Stack } from '@mui/material';
import 'react-datepicker/dist/react-datepicker.css';
import Autocomplete from '@mui/material/Autocomplete';
import { dispatch, useSelector } from '../store/index';

import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Loader from 'ui-component/Loader';
import '../assets/scss/styles.css'
const API_URL = process.env.REACT_APP_LOCAL_API_URL;

import SnackbarAlert from '../../src/mago_pages/component/SnackbarAlert';
import axios from '../../src/utils/axios'

import MonthlytargetTemplate from '../reports_template/monthlytarget_template'

import { getallEmpName } from 'redux/actions/manualattendanceAction';
import { getTargetReports } from 'redux/actions/ReportsAction';


const validationSchema = yup.object({ 
    monthyear : yup.string().required('Month & year is required'),
    empid : yup.string().required('Employee Name is required'),
});


export default function LocationReports() { 

    const { allempnames } = useSelector((data) => data.allempname);
    const { targetreports } = useSelector((data) => data.targetreport);

    const [startDate, setStartDate] = useState(new Date());
    const [ datas, setdatas ] = useState({})
    const [ senddata , setsenddata ] = useState({})
    const [showload, setshowload] = React.useState(false);
    const [show, setshow] = React.useState(false);

    const [messageAlert, setMessageAlert] = useState(false);
    const [SnackBarmessage, SetSnackBarmessage] = useState({});
    

    useEffect(() => {
        dispatch(getallEmpName())
    }, []);

    useEffect(() => {
        console.log("allempnames",allempnames)
        console.log("targetreports",targetreports)
    }, [allempnames,targetreports]);

    const Formik = useFormik({
        initialValues: {
            monthyear :startDate,
            empid :  ''
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            const sendingdata = {
                empid : values.empid,
                month: moment(startDate).month() + 1,
                year: moment(startDate).year(),
            }
            setsenddata(sendingdata)
            setdatas({
                empname : allempnames.find(item => String(item._id) === String(values.empid))?.fullName,
                monthyear :  `${moment(startDate).format('MMMM')}, ${moment(startDate).year()}`
            })
            setshowload(true)
            dispatch(getTargetReports(sendingdata)).then(()=>{
                setshowload(false)
                setshow(true)
            })
        }
    });


    const downloadPDF = async () => {
        setshowload(true)
        try {

            const response = await axios.post(`${API_URL}monthlytargetreports/monthlytargetreportpdfstream`,
                {
                    month: senddata.month,
                    year: senddata.year,
                    empid : senddata.empid,
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
            link.setAttribute('download', `${datas.monthyear} - ${datas.empname} - MonthlyTargetReports.pdf`);
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
                        <InputLabel id="demo-simple-select-label">Select Month Year *</InputLabel>
                        <DatePicker
                            customInput={
                            <TextField
                                fullWidth
                                sx={{ m: 1, minWidth: 250 }}
                            />
                            }
                            selected={startDate}
                            onChange={(date) => { setStartDate(date), Formik.setFieldValue('monthyear', date) }  }
                            dateFormat="MM/yyyy"
                            InputLabelProps={{ shrink: true, }}
                            showMonthYearPicker
                            showFullMonthYearPicker
                            scrollableYearDropdown
                            yearDropdownItemNumber={15}
                            error={Formik.touched.monthyear && Boolean(Formik.errors.monthyear)}
                            helperText={Formik.touched.monthyear && Formik.errors.monthyear}
                            inputProps={{
                                min: moment(localStorage.getItem('fromdate')).format('YYYY-MM-DD'),
                                max: moment(localStorage.getItem('todate')).format('YYYY-MM-DD')
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <InputLabel id="demo-simple-select-label">Select Employee Name *</InputLabel>
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
                </>
                }
        >
        { showload ? <Loader /> : ''}
        <SnackbarAlert open={messageAlert} onClose={handleClickCloseAddAlert} message={SnackBarmessage.data} severity={SnackBarmessage.color} />                 
        { show && targetreports.length > 0 
        ?  
        <>
            <div style={{ marginLeft: '35px' , marginTop:'20px' ,  display: 'flex', justifyContent: 'space-between', alignItems: 'center' ,paddingRight: 20, paddingTop:10  }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginRight: '20px' , fontSize:18 , fontWeight:'bold' }}> 
                        Selected : <span style={{color:'#2196f3'}}> {datas.monthyear} </span>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                        Selected Employee : <span style={{color:'#2196f3'}}> {datas.empname} </span>
                    </div>
                </div>

                <div>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                    <button onClick={downloadPDF} className="pdficon">
                        <PictureAsPdfIcon />
                    </button>
                </Stack>
                </div>
            </div>
            <div style={{ padding: 30 }}>
                <MonthlytargetTemplate ledgerreports={targetreports} />
            </div>
        </>
        :
        ''
        }
        </MainCard>
    )
}