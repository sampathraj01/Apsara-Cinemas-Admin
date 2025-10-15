import React from 'react';
import { Button, TextField, Grid } from '@mui/material';
import moment from 'moment';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Datefilter= ({ getReport , clearForm }) => {

  // Formik initialization
  const formik = useFormik({
    initialValues: {
      fromdate: '',
      todate: ''
    },
    validationSchema: Yup.object({
      fromdate: Yup.date().required('From Date is required'),
      todate: Yup.date()
        .required('To Date is required')
        .min(Yup.ref('fromdate'), 'To Date cannot be before From Date')
    }),
    onSubmit: (values) => {
        getReport(values)
    }
  });

  const FormClear = () => {
    formik.resetForm()
    clearForm()
  }

  return (
    <form onSubmit={formik.handleSubmit} id="validation-forms">
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <TextField 
              id="fromdate"
              name="fromdate"
              label="Date (DD/MM/YYYY)"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formik.values.fromdate}
              onChange={formik.handleChange}
              error={formik.touched.fromdate && Boolean(formik.errors.fromdate)}
              helperText={formik.touched.fromdate && formik.errors.fromdate}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              id="todate"
              name="todate"
              label="Date (DD/MM/YYYY)"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: moment(localStorage.getItem('fromdate')).format('YYYY-MM-DD'),
                max: moment(localStorage.getItem('todate')).format('YYYY-MM-DD')
              }}
              value={formik.values.todate}
              onChange={formik.handleChange}
              error={formik.touched.todate && Boolean(formik.errors.todate)}
              helperText={formik.touched.todate && formik.errors.todate}
            />
          </Grid>

          <Grid item xs={12} md={2} container spacing={2} direction="row" alignItems="center">
            <Grid item>
              <Button variant="contained" size="small" type="submit">
                GO
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="warning" size="small" type="button" onClick={FormClear}>
                Clear
              </Button>
            </Grid>
          </Grid>
        </Grid>
    </form>
  );
};

export default Datefilter;
