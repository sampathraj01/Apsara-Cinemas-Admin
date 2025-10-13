import React from 'react';
import './LedgerTemplate.css'; // Assuming you have a CSS file for styling

const ExpenseReportTemplate = ({ reports }) => {

  return (
    
    <>
   
      {
        reports.map((employee, index) => 
        {
            return(
                <div key={index} className="ledger-customer">
                <h3>{employee.empname} - ({employee.fromDate}) to ({employee.toDate})</h3>
                <table className="ledger-table">
                    <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Expense</th>
                        <th>Amount</th>
                        <th>Description</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        employee.report.length > 0 ? (
                            <>
                                {
                                    employee.report.map((data, dataIndex) => {
                                        return (
                                            <tr key={dataIndex}>
                                                <td>{dataIndex+1}</td>
                                                <td>{data.expensesData.name}</td>
                                                <td>{data.amount}</td>
                                                <td>{data.description}</td>
                                                <td>{data.status}</td>
                                            </tr>
                                        );
                                    })
                                }
                            </>
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center' }}>
                                    No data available
                                </td>
                            </tr>
                        )
                        }
                    </tbody>
                </table>
                </div>
            );
        })}
    </>
  );
}

export default ExpenseReportTemplate;
