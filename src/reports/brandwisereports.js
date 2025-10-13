
import React, { useEffect , useState   } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { dispatch, useSelector } from '../store/index';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import BarChartIcon from '@mui/icons-material/BarChart';

import BrandWiseReportTemplate from '../reports_template/brandwiseReport_template'


import { Stack , Button } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Loader from 'ui-component/Loader';
import '../assets/scss/styles.css'
import axios from '../../src/utils/axios'
const API_URL = process.env.REACT_APP_LOCAL_API_URL;

import { getBrandWiseReports } from 'redux/actions/ReportsAction';
import BrandWiseBarChart from '../../src/mago_pages/brandwiseBarchart/index';
import SnackbarAlert from '../../src/mago_pages/component/SnackbarAlert';

// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';

// pdfMake.vfs = pdfFonts.pdfMake.vfs;



export default function LocationReports() { 

    const { brandwisereports } = useSelector((data) => data.brandwisereport);
    const [showload, setshowload] = React.useState(false);

    
    const [chartOpen, setchartOpen] = React.useState(false);

    const [messageAlert, setMessageAlert] = useState(false);
    const [SnackBarmessage, SetSnackBarmessage] = useState({});

    const companyid = localStorage.getItem('selectedCompany');
    const accountyearid = localStorage.getItem('accountyear')

     useEffect(() => {
        dispatch(getBrandWiseReports({
            companyid , accountyearid
        }))
    }, []);

    useEffect(() => {
        console.log("brandwisereports",brandwisereports)
    }, [brandwisereports]);


    const downloadPDF = async () => {
        setshowload(true)
        try {

            const response = await axios.post(`${API_URL}brandwisereport/brandwisereportspdfstream`,
                {
                    accountyearid : accountyearid ,
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
            link.setAttribute('download', `brandwiseReports.pdf`);
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
    
    const ConfirmationhandleClose = () => {
        setchartOpen(false)
    }

    const showChart = () => {
        setchartOpen(true)
    }


    return (
        <MainCard content={false}
            title={
                <>
                   <Button variant="contained" color="primary" startIcon={<BarChartIcon />} onClick={showChart} >
                        Target & Achieved BarChart
                    </Button>
                </>
            }
        >
        { showload ? <Loader /> : ''}
        <SnackbarAlert open={messageAlert} onClose={handleClickCloseAddAlert} message={SnackBarmessage.data} severity={SnackBarmessage.color} />
        <Dialog maxWidth="md" fullWidth="true" open={chartOpen} onClose={ConfirmationhandleClose} aria-labelledby="form-dialog-title">
               <DialogTitle id="form-dialog-title"></DialogTitle>    
                <DialogContent>
                    <BrandWiseBarChart/>
                </DialogContent>
        </Dialog>   
        { brandwisereports.length>0 
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
                <BrandWiseReportTemplate reports={brandwisereports} />
            </div>
        </>
        :
        ''
        }
        </MainCard>
    )
}