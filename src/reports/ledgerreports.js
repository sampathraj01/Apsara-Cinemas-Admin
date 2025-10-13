
import React, { useEffect , useState  } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import MainCard from 'ui-component/cards/MainCard';
import { Button, Grid } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import { FormControl } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { dispatch, useSelector } from '../store/index';
import moment from 'moment';
// import '../mago_pages/style.css'
import LedgerTemplate from '../reports_template/ledger_template'

import { Stack } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Loader from 'ui-component/Loader';
import '../assets/scss/styles.css'
const API_URL = process.env.REACT_APP_LOCAL_API_URL;

import SnackbarAlert from '../../src/mago_pages/component/SnackbarAlert';
import axios from '../../src/utils/axios'

import { getAllCustomerName } from 'redux/actions/CommonAction';
import { getLedgerReports } from 'redux/actions/ReportsAction';

// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';

// pdfMake.vfs = pdfFonts.pdfMake.vfs;

const validationSchema = yup.object({ 
    fromdate : yup.string().required('Fromdate is required'),
    todate : yup.string().required('Todate is required'),
});


export default function LocationReports() { 

    const { allcustomers } = useSelector((data) => data.allcustomer);
    const { ledgerreports } = useSelector((data) => data.ledgerreport);

    const [messageAlert, setMessageAlert] = useState(false);
    const [SnackBarmessage, SetSnackBarmessage] = useState({});

    const [showload, setshowload] = React.useState(false);
    const [ senddata , setsenddata ] = useState({})
    const [ show , setshow ] = useState(false);

    // const [ datas, setdatas ] = useState({})
    
    const companyid = localStorage.getItem('selectedCompany');

    useEffect(() => {
        dispatch(getAllCustomerName(companyid))
    }, []);

    useEffect(() => {
        console.log("allcustomers",allcustomers)
        console.log("ledgerreports",ledgerreports)
    }, [allcustomers,ledgerreports]);

    const defprops = {
        options: allcustomers.map((option) => ({ names: option.shopName, valuess: option._id })),
        getOptionLabel: (options) => options.names
    }


    const Formik = useFormik({
        initialValues: {
            fromdate :  moment(localStorage.getItem('fromdate')).format('YYYY-MM-DD'),
            todate :  moment(localStorage.getItem('todate')).format('YYYY-MM-DD'),
            customerid :  ''
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            const sendingdata = {
                fromdate : values.fromdate,
                todate : values.todate,
                customerid : values.customerid,
                companyid : companyid,
                accountyear : localStorage.getItem('accountyear')
            }
            setsenddata(sendingdata)
            // setdatas({
            //     fromdate : moment(values.fromdate).format('DD-MM-YYYY'),
            //     todate : moment(values.todate).format('DD-MM-YYYY'),
            //     customerid : moment(values.customerid).format('DD-MM-YYYY'),
            // })
            setshowload(true)
            dispatch(getLedgerReports(sendingdata)).then(()=>{
                setshowload(false)
                setshow(true)
            })
        }
    });

    const downloadPDF = async () => {
        setshowload(true)
        try {

             const response = await axios.post(`${API_URL}ledgerreports/ledgerreportpdfstream`,
                {
                    fromdate :senddata.fromdate,
                    todate :senddata.todate,
                    customerid : senddata.customerid,
                    companyid : companyid,
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
            link.setAttribute('download', `LedgerReports.pdf`);
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
                        <InputLabel id="demo-simple-select-label">To Date *</InputLabel>
                        <div className='row' style={{ marginTop: '10px' }}></div>
                        <TextField
                            id="todate"
                            name="todate"
                            label="Date (DD/MM/YYYY)"
                            type="date"
                            InputLabelProps={{ shrink: true,}}
                            fullWidth
                            inputProps={{
                                min: moment(localStorage.getItem('fromdate')).format('YYYY-MM-DD'),
                                max: moment(localStorage.getItem('todate')).format('YYYY-MM-DD')
                            }}
                            value={Formik.values.todate}
                            onChange={Formik.handleChange}
                            error={Formik.touched.todate && Boolean(Formik.errors.todate)}
                            helperText={Formik.touched.todate && Formik.errors.todate}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <InputLabel id="demo-simple-select-label">Select Customer Name </InputLabel>
                        <FormControl sx={{ m: 1, minWidth: 250 }}>
                            <Autocomplete
                                {...defprops}
                                renderInput={(params) => <TextField
                                    label="Customer Name"
                                    {...params}
                                />}
                                onChange={(event, newValue) => {
                                    if (newValue) {
                                        Formik.setFieldValue("customerid",  newValue.valuess);
                                    } else {
                                        Formik.setFieldValue("customerid", "");
                                    }
                                }}
                                // onChange={(event, value) => {
                                //     Formik.setFieldValue('customerid', value.valuess ); 
                                // }}
                                error={Formik.touched.customerid && Boolean(Formik.errors.customerid)}
                                helperText={Formik.touched.customerid && Formik.errors.customerid}
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
                </>
                }
        >
        { showload ? <Loader /> : ''}
        <SnackbarAlert open={messageAlert} onClose={handleClickCloseAddAlert} message={SnackBarmessage.data} severity={SnackBarmessage.color} />                 
        {
        show && ledgerreports.length>0 
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
                <LedgerTemplate ledgerreports={ledgerreports} />
            </div>
        </>
        :
        ''
        }
        </MainCard>
    )
}