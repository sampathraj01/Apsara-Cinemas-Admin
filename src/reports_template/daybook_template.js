import React from 'react';
import './LedgerTemplate.css'; // Assuming you have a CSS file for styling
import moment from 'moment-timezone';
import { formatAmount } from '../../src/utils/utils'

const DayBookTemplate = ({ reports }) => {

  return (
    <>
      {
        reports.map((customer, index) => 
        {
            return(
                <div key={index} className="ledger-customer">
                <h3>{moment(customer[0].date).format('DD-MM-YYYY')} - DayBook Report</h3>
                <table className="ledger-table">
                    <thead>
                    <tr>
                        <th>company Name</th>
                        <th>Type</th>
                        <th>Customer Name</th>
                        <th>Details</th>
                        <th>Debit (Rs.)</th>
                        <th>Credit (Rs.)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                    customer.length > 3 ? (
                    customer.map((data, dataIndex) => {
                        console.log("datadata",data,dataIndex)
                        const isBold =  dataIndex >= customer.length - 2; 
                        const isLastIndex = dataIndex === customer.length - 1;

                        return (
                            <tr key={dataIndex}>
                                <td>{data.companyname}</td>
                                <td style={{ fontWeight: isBold ? 'bold' : 'normal' }}>{data.type}</td>
                                <td style={{ fontWeight: isBold ? 'bold' : 'normal' }}>{data.customername}</td>
                                <td style={{ fontWeight: isBold ? 'bold' : 'normal' }}>{data.detail}</td>
                                <td style={{ 
                                    fontWeight: isBold ? 'bold' : 'normal', 
                                    color: isLastIndex ? 'red' : 'inherit' 
                                }}>
                                    {formatAmount(data.debit)}
                                </td>
                                <td style={{ 
                                    fontWeight: isBold ? 'bold' : 'normal', 
                                    color: isLastIndex ? 'green' : 'inherit' 
                                }}>
                                    {formatAmount(data.credit)}
                                </td>
                            </tr>
                        );
                    })
                    )  :
                    <>
                    <tr>
                        <td colSpan="6" style={{textAlign:'center'}}>
                            No data available
                        </td>
                    </tr>
                    </>
                    }
                    </tbody>
                </table>
                </div>
            );
        })}
    </>
  );
}

export default DayBookTemplate;
