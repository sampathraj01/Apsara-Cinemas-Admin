
// material-ui
import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MainCard from 'ui-component/cards/MainCard';
import moment from 'moment';
// import './style.css'

import { DataGrid } from '@mui/x-data-grid';
import { CSVExport } from '../../src/views/forms/tables/TableExports';
import { Stack } from '@mui/material';

import SnackbarAlert from "../apsara-pages/component/SnackbarAlert"
import Loader from 'ui-component/Loader';
import { dispatch, useSelector } from '../store/index';
import Datefilter from './component/Datefilter';
import { getOrder} from 'redux/actions/orderActions';

export default function Order() {


    const { orders } = useSelector((data) => data.order);
    const { ordermessages } = useSelector((data) => data.ordermessage);
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);
    const [SnackBarmessage, SetSnackBarmessage] = useState({});
    const [MessageAlert, setMessageAlert] = React.useState(false);
    const [showload, setshowload] = React.useState(false);
    const theme = useTheme();

    useEffect(() => {
        dispatch(getOrder())
    }, []);

    useEffect(() => {
        addTableOrderGrid();
        console.log("orderiesssss", orders);
    }, [orders]);


    useEffect(() => {
        console.log("ordermessages", ordermessages);
        if (ordermessages) {
            if (ordermessages.success) {
                handleClose()
                formik.resetForm();
            }
        }
        SetSnackBarmessage(ordermessages)
    }, [ordermessages]);
    

    const addTableOrderGrid = async () => {
        const modifiedRows = await Promise.all(
            orders.map((row, index) => ({
                id:  row.orderid ,
                sno: index + 1,
                orderno: row.orderNo,
                date: row.orderdate,
                phonenumber:row.phoneNumber,
                name: row.name,
                Paymentstatus: row.paymentstatus,
                orderstatus: row.orderstatus,
                createdtime: moment(row.createdtime).format('DD-MM-YYYY hh:mm:ss A'),
            }))
        );

        const modifiedColumns = [
            { field: 'sno', headerName: 'S.No.', width: 70 },
            { field: 'orderno', headerName: 'order No', width: 200 },
            { field: 'date', headerName: 'Order Date', width: 100},
            { field: 'phonenumber', headerName: 'Phone Number', width: 100},
            { field: 'name', headerName: 'Name', width: 100},
            { field: 'Paymentstatus', headerName: 'Payment Status', width: 100},
            { field: 'orderstatus', headerName: 'Order Status', width: 100},
            // {
            //     headerName: 'Actions',
            //     width: 200,
            //     renderCell: (params) => (
            //         <>
            //             <button onClick={() => editCategory(params)} style={{ cursor: 'pointer', color: '#009900', border: 'none' }}>
            //                 <EditIcon />
            //             </button>
            //             &nbsp;&nbsp;&nbsp;
            //         </>
            //     )
            // },
            {
                field: 'createdtime',
                headerName: 'Created Time',
                width: 230,
                renderCell: (params) => (
                    <div>
                        {params.row.createdtime}
                    </div>
                )
            },
        ];

        setRows(modifiedRows);
        setColumns(modifiedColumns);
    };

    const handleClickCloseAddAlert = () => {
        setMessageAlert(false);
    };

    const filter = (values) => {
        setFilterValues(values); 
        setshowload(true)
        dispatch(getOrder({
            fromdate : values.fromdate,
            todate : values.todate,
        })).finally(()=>{
            setshowload(false)
        })
    }

    const clearForm = () => {
        setshowload(true)
        dispatch(getOrder({
            companyid : companyid,
            accountyearid : accountyearid,
        })).finally(()=>{
            setshowload(false)
        })
    }

    return (
        <MainCard
            content={false}
            title={
                <>
                  <Datefilter filter={filter} clearForm={clearForm} />
                </>
            }
                 secondary={
                <Stack direction="row" spacing={2} alignItems="flex-start">
                    <CSVExport data={rows} filename="order.csv" header={columns} />
                </Stack>
            }

        >
            {showload ? <Loader /> : ''}
                  <SnackbarAlert open={MessageAlert} onClose={handleClickCloseAddAlert} message={SnackBarmessage.message} severity={SnackBarmessage.color} />


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

                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                />

            </Box>
        </MainCard >
    )
}