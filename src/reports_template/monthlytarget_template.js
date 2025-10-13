import React from 'react';
import './LedgerTemplate.css'; // Assuming you have a CSS file for styling
import { formatAmount } from 'utils/utils';

const LedgerTemplate = ({  ledgerreports }) => {
  return (
    <>
      {
        ledgerreports.map((customer, index) => 
        {
            // const { totaldebit, totalcredit } = customer.reduce(
            //     (totals, entry) => {
            //       totals.totaldebit += parseFloat(entry.debit) || 0;
            //       totals.totalcredit += parseFloat(entry.credit) || 0;
            //       return totals;
            //     },
            //     { totaldebit: 0, totalcredit: 0 }
            //   );

            return(
                <div key={index} className="ledger-customer">
                <h3> {customer[0].type} </h3>
                <table className="ledger-table">
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Details</th>
                        <th>Debit (Rs.)</th>
                        <th>Credit (Rs.)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {customer.map((data, dataIndex) => {
                        const isBold = dataIndex === 0 || dataIndex >= customer.length - 2; 
                        const isLastIndex = dataIndex === customer.length - 1;

                        return (
                            <tr key={dataIndex}>
                                <td>{data.date}</td>
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
                    })}
                    </tbody>
                    {/* <tr>
                    <td></td>
                    <td><strong>Total</strong></td>
                    <td><strong>{totaldebit}</strong></td>
                    <td><strong>{totalcredit}</strong></td>
                    </tr>
                    <tr>
                    <td></td>
                    <td style={{color:  totaldebit > totalcredit ? 'red' : 'green' , fontWeight:'bold' }}> 
                    { totalcredit >= totaldebit ?  'Target amount achieved with an excess' : 'Target amount not yet achieved' }    
                    </td>
                    <td colSpan="2" style={{ 
                        color:  totaldebit > totalcredit ? 'red' : 'green',
                        fontWeight:'bold'
                        }}>
                        { totaldebit > totalcredit  ? totaldebit-totalcredit : totalcredit - totaldebit }
                    </td>
                    </tr> */}
                </table>
                </div>
            );
        })}
    </>
  );
}

export default LedgerTemplate;
