
import React, { useEffect , useState  } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import MainCard from 'ui-component/cards/MainCard';
import { Button, Grid } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import { dispatch, useSelector } from '../store/index';
import moment from 'moment-timezone';
import { Autocomplete, TextField, FormHelperText, FormControl } from "@mui/material";
import { getbrand , getcategory , getproducttype , getProduct  } from 'redux/actions/productAction';
import StockReportTemplate from '../reports_template/stockreports_template'

import { Stack } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Loader from 'ui-component/Loader';
import '../assets/scss/styles.css'
const API_URL = process.env.REACT_APP_LOCAL_API_URL;

import SnackbarAlert from '../../src/mago_pages/component/SnackbarAlert';
import axios from '../../src/utils/axios'

import { getStockReports } from 'redux/actions/ReportsAction';

// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';

// pdfMake.vfs = pdfFonts.pdfMake.vfs;


const validationSchema = yup.object({ 
    fromdate : yup.string().required('Fromdate is required'),
    todate : yup.string().required('Todate is required'),
    // brand : yup.string().required('Brand is required'),
    // category : yup.string().required('Category is required'),
    // producttype : yup.string().required('Producttype is required'),
    // product : yup.string().required('Product is required'),
});


export default function LocationReports() { 

    const { stockreports } = useSelector((data) => data.stockreport);
    const [showload, setshowload] = React.useState(false);
    const [ senddata , setsenddata ] = useState({})
    const [ show , setshow ] = useState(false);
    const [ mindate , setminDate ] = useState(moment(localStorage.getItem('fromdate')).format('YYYY-MM-DD'));

    const { products } = useSelector((data) => data.product);
    const { brandsdropdown } = useSelector((data) => data.branddropdown);
    const { categoriesdropdown } = useSelector((data) => data.categorydropdown);
    const { producttypesdropdown } = useSelector((data) => data.producttypedropdown);

    const [messageAlert, setMessageAlert] = useState(false);
    const [SnackBarmessage, SetSnackBarmessage] = useState({});

    const [ Allproduct,  setAllProduct ] = useState([])
    const [ AllBrands,  setAllBrands ] = useState([])
    const [ AllCategories ,  setAllCategories ] = useState([])
    const [ Allproducttype ,  setAllproducttype ] = useState([])


    const companyid = localStorage.getItem('selectedCompany');

    useEffect(() => {
        dispatch(getbrand(companyid));
        dispatch(getcategory(companyid));
        dispatch(getproducttype(companyid));
        dispatch(getProduct(companyid))
    }, []);

    useEffect(() => {
        setAllProduct(products)
        setAllBrands(brandsdropdown)
        setAllCategories(categoriesdropdown)
        setAllproducttype(producttypesdropdown)
    }, [products,brandsdropdown,categoriesdropdown,producttypesdropdown]);

      useEffect(() => {
        console.log("stockreports",stockreports)
    }, [stockreports]);


    const Formik = useFormik({
        initialValues: {
            fromdate: moment().tz('Asia/Kolkata').format('YYYY-MM-DD'),
            todate :  moment().tz('Asia/Kolkata').format('YYYY-MM-DD'),
            brand : '',
            category : '',
            producttype : '',
            product : ''
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            const sendingdata = {
                fromdate : values.fromdate,
                todate : values.todate,
                brand : values.brand,
                category :values.category,
                producttype : values.producttype,
                product : values.product,
                accountyear : localStorage.getItem('accountyear')
            }
            setsenddata({
                fromdate : values.fromdate,
                todate : values.todate,
                brand : values.brand,
                category :values.category,
                producttype : values.producttype,
                product : values.product,
                customerid : moment(values.customerid).format('DD-MM-YYYY'),
            })
            setshowload(true)
            dispatch(getStockReports(sendingdata)).then(()=>{
                setshowload(false)
                setshow(true)
            })
        }
    });

    const downloadPDF = async () => {
        setshowload(true)
        try {
            const response = await axios.post(`${API_URL}stockreports/stockreportpdfstream`,
                {
                    fromdate :senddata.fromdate,
                    todate :senddata.todate,
                    brand : senddata.brand,
                    category :senddata.category,
                    producttype : senddata.producttype,
                    product : senddata.product,
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
            link.setAttribute('download', `${moment(senddata.fromdate).format('DD-MM-YYYY')} - ${moment(senddata.todate).format('DD-MM-YYYY')} stockreports.pdf`);
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
                            <InputLabel id="demo-simple-select-label">Choose Brand</InputLabel>
                            <div className="row" style={{ marginTop: '10px' }}></div>
                            <FormControl fullWidth error={Boolean(Formik.errors.brand)}>
                                <Autocomplete
                                    id="brand"
                                    options={AllBrands}
                                    getOptionLabel={(option) => option.name}
                                    isOptionEqualToValue={(option, value) => option._id === value}
                                    value={AllBrands.find(brand => brand._id === Formik.values.brand) || null}
                                    onChange={(event, newValue) => {
                                        if (newValue) {
                                            Formik.setFieldValue("brand", newValue._id);
                                            Formik.setFieldValue("category", "");
                                            Formik.setFieldValue("producttype", "");
                                            Formik.setFieldValue("product", "");
                                            const a = categoriesdropdown.filter(item => String(item.brandRefId) === String(newValue._id))
                                            setAllCategories(a)
                                            setAllproducttype([])
                                            setAllProduct([])
                                        } else {
                                            Formik.setFieldValue("brand", "");
                                            Formik.setFieldValue("category", "");
                                            Formik.setFieldValue("producttype", "");
                                            Formik.setFieldValue("product", "");
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Choose Brand"
                                            error={Boolean(Formik.errors.brand)}
                                        />
                                    )}
                                />
                                {Formik.errors.brand && (
                                    <FormHelperText error id="standard-weight-helper-text-email-login">
                                        {Formik.errors.brand}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <InputLabel id="demo-simple-select-label">Choose Category</InputLabel>
                            <div className="row" style={{ marginTop: '10px' }}></div>
                            <FormControl fullWidth error={Boolean(Formik.errors.category)}>
                                <Autocomplete
                                    id="category"
                                    options={AllCategories}
                                    getOptionLabel={(option) => option.name}
                                    isOptionEqualToValue={(option, value) => option._id === value}
                                    value={AllCategories.find(category => category._id === Formik.values.category) || null}
                                    onChange={(event, newValue) => {
                                        if (newValue) {
                                            Formik.setFieldValue("category", newValue._id);
                                            Formik.setFieldValue("producttype", "");
                                            Formik.setFieldValue("product", "");
                                            const a = producttypesdropdown.filter(item => String(item.categoryRefId) === String(newValue._id))
                                            setAllproducttype(a)
                                            setAllProduct([])
                                        } else {
                                            Formik.setFieldValue("category", "");
                                            Formik.setFieldValue("producttype", "");
                                            Formik.setFieldValue("product", "");
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Choose category"
                                            error={Boolean(Formik.errors.category)}
                                        />
                                    )}
                                />
                                {Formik.errors.category && (
                                    <FormHelperText error id="standard-weight-helper-text-email-login">
                                        {Formik.errors.category}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <InputLabel id="demo-simple-select-label">Choose Producttype</InputLabel>
                            <div className="row" style={{ marginTop: '10px' }}></div>
                            <FormControl fullWidth error={Boolean(Formik.errors.producttype)}>
                                <Autocomplete
                                    id="Producttype"
                                    options={Allproducttype}
                                    getOptionLabel={(option) => option.name}
                                    isOptionEqualToValue={(option, value) => option._id === value}
                                    value={Allproducttype.find(Producttype => Producttype._id === Formik.values.producttype) || null}
                                    onChange={(event, newValue) => {
                                        if (newValue) {
                                            Formik.setFieldValue("producttype", newValue._id);
                                            Formik.setFieldValue("product", "");
                                            const a = products.filter(item => String(item.producttypeRefId) === String(newValue._id))
                                            setAllProduct(a)
                                        } else {
                                            Formik.setFieldValue("producttype", "");
                                            Formik.setFieldValue("product", "");
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Choose Producttype"
                                            error={Boolean(Formik.errors.producttype)}
                                        />
                                    )}
                                />
                                {Formik.errors.producttype && (
                                    <FormHelperText error id="standard-weight-helper-text-email-login">
                                        {Formik.errors.producttype}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <InputLabel id="demo-simple-select-label">Choose Product</InputLabel>
                            <div className="row" style={{ marginTop: '10px' }}></div>
                            <FormControl fullWidth error={Boolean(Formik.errors.product)}>
                                <Autocomplete
                                    id="product"
                                    options={Allproduct}
                                    getOptionLabel={(option) => option.productName}
                                    isOptionEqualToValue={(option, value) => option._id === value}
                                    value={products.find(product => product._id === Formik.values.product) || null}
                                    onChange={(event, newValue) => {
                                        if (newValue) {
                                            Formik.setFieldValue("product", newValue._id);
                                        } else {
                                            Formik.setFieldValue("product", "");
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Choose product"
                                            error={Boolean(Formik.errors.product)}
                                        />
                                    )}
                                />
                                {Formik.errors.product && (
                                    <FormHelperText error id="standard-weight-helper-text-email-login">
                                        {Formik.errors.product}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                    </Grid>
                    <br/>
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
                            onChange={(e)=>{setminDate(e.target.value),Formik.handleChange(e)}}
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
                                min: mindate,
                                max: moment(localStorage.getItem('todate')).format('YYYY-MM-DD')
                            }}
                            value={Formik.values.todate}
                            onChange={Formik.handleChange}
                            error={Formik.touched.todate && Boolean(Formik.errors.todate)}
                            helperText={Formik.touched.todate && Formik.errors.todate}
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
                </>
                }
        >
        { showload ? <Loader /> : ''}
        <SnackbarAlert open={messageAlert} onClose={handleClickCloseAddAlert} message={SnackBarmessage.data} severity={SnackBarmessage.color} />                 
        {
        show && stockreports 
        ?
        <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' ,paddingRight: 20, paddingTop:10 }}>
                <Stack style={{display:'none'}} direction="row" spacing={2} alignItems="flex-start">
                    <button onClick={downloadPDF} className="pdficon">
                        <PictureAsPdfIcon />
                    </button>
                </Stack>
            </div>
            <div style={{ padding: 30 }}>
                { stockreports.length>0 ? 
                <StockReportTemplate reports={stockreports} /> : 'No Data Available' }
            </div>
        </>
        :
        ''
        }
        </MainCard>
    )
}