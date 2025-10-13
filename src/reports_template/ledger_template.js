import React from 'react';
import './LedgerTemplate.css'; // Assuming you have a CSS file for styling
import { formatAmount } from '../../src/utils/utils'

const LedgerTemplate = ({ ledgerreports }) => {
  return (
    <>
      {
        ledgerreports.map((customer, index) => 
        {
            return(
                <div key={index} className="ledger-customer">
                <h3>{customer[0].type} - Ledger Report</h3>
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
                </table>
                </div>
            );
        })}
    </>
  );
}

export default LedgerTemplate;
