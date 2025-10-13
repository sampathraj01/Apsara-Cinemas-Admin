
import React, { useEffect , useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import MainCard from 'ui-component/cards/MainCard';
import { Button, Grid } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import { FormControl } from '@mui/material';
import { dispatch, useSelector } from '../store/index';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
// import '../mago_pages/style.css'
import { useTheme } from '@mui/material/styles';
import { CSVExport } from '../../src/views/forms/tables/TableExports';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Stack } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import moment from 'moment';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { FormHelperText } from '@mui/material';
import Loader from 'ui-component/Loader';
import '../assets/scss/styles.css'

import { getCustomerReports } from 'redux/actions/ReportsAction';
import { getCity   } from 'redux/actions/cityAction';
import { getState   } from 'redux/actions/stateActions';
import { getDistrict   } from 'redux/actions/DistrictAction';

import SnackbarAlert from '../../src/mago_pages/component/SnackbarAlert';
import axios from '../../src/utils/axios'

const API_URL = process.env.REACT_APP_LOCAL_API_URL;

const validationSchema = yup.object({ 
    state : yup.string().required('Please Select state'),
    district : yup.string().required('Please Select District'),
    city : yup.string().required('Please Select City'),
});


export default function CustomerReports() { 

    const { customerreports } = useSelector((data) => data.customerreport);
    const { cities } = useSelector((data) => data.city);
    const { states } = useSelector((data) => data.state);
    const { districts } = useSelector((data) => data.district);
    
    const [ rows, setRows] = useState([]);
    const [ columns, setColumns] = useState([]);

    const [ filterDistrict , setfilterDistrict ] = useState([])
    const [ filterCity , setFilterCity ] = useState([])

    const [ datas, setdatas ] = useState({})
    const [showload, setshowload] = React.useState(false);
    const [ contactview, setcontactview ] = useState(false);
    const [ contactinfo , setContactinfo ] = useState([]);
    const [ senddata , setsenddata ] = useState({})
    const [ show , setshow ] = useState(false);

    const [messageAlert, setMessageAlert] = useState(false);
    const [SnackBarmessage, SetSnackBarmessage] = useState({});
    
    const theme = useTheme();

    const companyid = localStorage.getItem('selectedCompany');
   // const accountyearid = localStorage.getItem('accountyear')

    useEffect(() => {
        dispatch(getCity());
        dispatch(getState())
        dispatch(getDistrict())
        
    }, []);
    


    useEffect(() => {
        console.log("states",states)
        console.log("cities",cities)
        console.log("districts",districts)
        console.log("customerreports",customerreports)
        addTableReportsGrid();
    }, [cities,states,customerreports,districts]);
    

    // const openMap = (longitude,latitude) => {
    //     const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    //     window.open(url, '_blank');
    // };

    const ViewContacts = (params) => {
        console.log("paramsparams",params.row)
        setcontactview(true)
        setContactinfo(customerreports.find(item => String(item._id) === String(params.row.id))?.contactperson)
    }

    const addTableReportsGrid = async () => {
        const modifiedRows = await Promise.all(
            customerreports.map((row, index) => ({
                id: row._id,
                sno : index+1,
                name: row.shopName,
                emailid: row.emailid,
                gstnumber: row.gstnumber,
                companyname: row.companyName,
                address1 : row.address1,
                address2 : row.address2,
                state : row.stateName,
                district : row.districtName,
                city : row.city,
                pincode : row.pincode,
                description : row.description,
                longitude : row.longitude,
                latitude : row.latitude,
                createdbyname : row.createdemployeename,
                createdtimestamp : moment(row.createdtimestamp).format('DD-MM-YYYY hh:mm:ss A'),
                updatedbyname : row.updatedemployeename ? row.updatedemployeename : '',
                updatedtimestamp : row.updatedtimestamp ? moment(row.updatedtimestamp).format('DD-MM-YYYY hh:mm:ss A') : '',
            }))
        );

        const modifiedColumns = [
            { field: 'sno', headerName: 'S.No.', width: 70 },
            // { field: 'companyname', headerName: 'Company Name', width: 200 },
            { field: 'name', headerName: 'Vendor Name', width: 200 },
            { field: 'emailid', headerName: 'Email Address', width: 200 },
            { field: 'gstnumber', headerName: 'GST Number', width: 200 },
            {
                field: 'address',
                headerName: 'Address',
                width: 300,
                renderCell: (params) => (
                    <>
                    <div>
                    {params.row.address1}, 
                    <br/>
                    {params.row.address2},
                    <br/>
                    {params.row.city} - {params.row.pincode}
                    <br/>
                    {params.row.district}, {params.row.state} 
                    </div>
                    </>
                )
            },
            // {
            //     field: 'longitude',
            //     headerName: 'Location',
            //     width: 170,
            //     renderCell: (params) => (
            //         <>
            //         <div>
            //         Logitude : {params.row.longitude}
            //         <br/>
            //         Latitude : {params.row.latitude}
            //         <br/>
            //         <a href="#" onClick={() => { openMap(params.row.longitude,params.row.latitude); }} target="_blank">Open a Map</a>
            //         </div>
            //         </>
            //     )
            // },
            // {
            //     field: 'description',
            //     headerName: 'Description',
            //     width: 230,
            //     renderCell: (params) => (
            //         <>
            //         <div style={{ whiteSpace: 'normal', wordWrap: 'break-word', overflowWrap: 'break-word', height: '100%', display: 'flex', alignItems: 'center' }}>
            //         {params.row.description}
            //         <br/>
            //         </div>
            //         </>
            //     )
            // },
            {
                headerName: 'Actions',
                width: 150,
                renderCell: (params) => (
                    <>
                        <button onClick={() => ViewContacts(params)} style={{ cursor: 'pointer', color: '#009900', border: 'none' }}>
                            <VisibilityIcon />
                        </button>
                        &nbsp;&nbsp;&nbsp;
                    </>
                )
            },
            {
                field: 'createdbyname',
                headerName: 'Created By',
                width: 190,
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
                width: 190,
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

    
    const handleClose = () => {
        setcontactview(false)
    }


    const Formik = useFormik({
        initialValues: {
            state : '',
            district : '',
            city : ''
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            const sendingdata = {
                stateid : values.state,
                districtid : values.district,
                cityid : values.city,
                companyid : companyid,
            }
            setsenddata(sendingdata)
            setdatas({
                state : states.find(item => String(item._id) === String(values.state))?.state,
                district : districts.find(item => String(item._id) === String(values.district))?.district,
                city : cities.find(item => String(item._id) === String(values.city))?.city
            })
            setshowload(true)
            dispatch(getCustomerReports(sendingdata)).then(()=>{
                setshow(true)
                setshowload(false)
            })
        }
    });

    const downloadPDF = async () => {
        setshowload(true)
        try {

            const response = await axios.post(`${API_URL}reportspdfstream/customerreportspdfstream`,
                {
                    stateid: senddata.stateid,
                    cityid: senddata.cityid,
                    districtid: senddata.districtid,
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
            link.setAttribute('download', `${datas.state}-${datas.district}-${datas.city}-VendorReport.pdf`);
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
    
    const getdistrictbystate = (id) => {
        const a =  districts.filter(item => String(item.stateId._id) === String(id))
        setfilterDistrict(a)
    }

    const getcitybydistrict = (id) => {
        const a =  cities.filter(item => String(item.districtId._id) === String(id))
        setFilterCity(a)
    }

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
                            <InputLabel id="demo-simple-select-label">State *</InputLabel>
                            <div className="row" style={{ marginTop: '10px' }}></div>
                            <FormControl fullWidth error={Boolean(Formik.errors.state)}>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="state"
                                    name="state"
                                    value={Formik.values.state}
                                    onChange={(event)=>{ 
                                        Formik.setFieldValue('district', ''),
                                        Formik.setFieldValue('city', ''),
                                        getdistrictbystate(event.target.value) , 
                                        Formik.handleChange(event) }}
                                    label="State"
                                >
                                    {states.map((row) => (
                                        <MenuItem key={row._id} value={row._id}>{row.state}</MenuItem>
                                    ))}
                                </Select>
                                {Formik.errors.state && (
                                    <FormHelperText error id="standard-weight-helper-text-email-login">
                                        {' '}
                                        {Formik.errors.state}{' '}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <InputLabel id="demo-simple-select-label">District *</InputLabel>
                            <div className="row" style={{ marginTop: '10px' }}></div>
                            <FormControl fullWidth error={Boolean(Formik.errors.district)}>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="district"
                                    name="district"
                                    value={Formik.values.district}
                                    onChange={(event)=>{ 
                                        Formik.setFieldValue('city', ''),
                                        getcitybydistrict(event.target.value) , 
                                        Formik.handleChange(event) }}
                                    label="State"
                                >
                                    {filterDistrict.map((row) => (
                                        <MenuItem key={row._id} value={row._id}>{row.district}</MenuItem>
                                    ))}
                                </Select>
                                {Formik.errors.district && (
                                    <FormHelperText error id="standard-weight-helper-text-email-login">
                                        {' '}
                                        {Formik.errors.district}{' '}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <InputLabel id="demo-simple-select-label">City *</InputLabel>
                            <div className="row" style={{ marginTop: '10px' }}></div>
                            <FormControl fullWidth error={Boolean(Formik.errors.city)}>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="city"
                                    name="city"
                                    value={Formik.values.city}
                                    onChange={Formik.handleChange}
                                    label="City"
                                >
                                    {filterCity.map((row) => (
                                        <MenuItem key={row._id} value={row._id}>{row.city}</MenuItem>
                                    ))}
                                </Select>
                                {Formik.errors.city && (
                                    <FormHelperText error id="standard-weight-helper-text-email-login">
                                        {' '}
                                        {Formik.errors.city}{' '}
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
                                    Selected State : <span style={{color:'#2196f3'}}> {datas.state} </span>
                                      &nbsp;&nbsp;&nbsp;&nbsp;
                                    Selected District : <span style={{color:'#2196f3'}}> {datas.district} </span>
                                      &nbsp;&nbsp;&nbsp;&nbsp;
                                    Selected City : <span style={{color:'#2196f3'}}> {datas.city} </span>
                                </div>
                            </div>

                            <div>
                            <Stack direction="row" spacing={2} alignItems="flex-start">
                                <CSVExport data={rows} filename={`${datas.state} - ${datas.district} - ${datas.city} -VendorReports.csv`} header={columns} />
                            
                                <button onClick={downloadPDF} className="pdficon">
                                    <PictureAsPdfIcon />
                                </button>
                                
                            </Stack>
                            </div>
                        </div>
                        <br/>
                        { customerreports.length > 0 
                        ?  
                        <>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                pageSize={5}
                                rowsPerPageOptions={[10]}
                                rowHeight={100} 
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
        <Dialog maxWidth="md" fullWidth="true" open={contactview} onClose={handleClose} aria-labelledby="form-dialog-title">
                {open && (
                    <>
                    <DialogTitle id="form-dialog-title"> Contact Details </DialogTitle>
                    <DialogContent>
                        <Box sx={{ flexGrow: 2 }}>
                        <Grid item xs={12} md={12}>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th> Designation </th>
                                        <th> Name </th>
                                        <th> Mobile No 1 </th>
                                        <th> Mobile No 2 </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {contactinfo.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.designation}</td>
                                            <td>{item.name}</td>
                                            <td>{item.mobileno1}</td>
                                            <td>{item.mobileno2}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </Grid>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ pr: 2.5 }}></DialogActions>
                    </>
                )}
            </Dialog>
            { showload ? <Loader /> : ''}
            <SnackbarAlert open={messageAlert} onClose={handleClickCloseAddAlert} message={SnackBarmessage.data} severity={SnackBarmessage.color} />
                      
        </MainCard>
    )
}