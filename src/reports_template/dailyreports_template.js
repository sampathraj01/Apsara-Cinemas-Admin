import React from 'react';
import './LedgerTemplate.css'; // Assuming you have a CSS file for styling
import moment from 'moment-timezone';

const DayBookTemplate = ({ reports }) => {
console.log(reports)
  return (
    <>
      {
        reports.map((employee, index) => 
        {
            return(
                <div key={index} className="ledger-customer">
                <h3>{employee.empname} - ({employee.date})</h3>
                <table className="ledger-table">
                    <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Description</th>
                        <th>Keypoints</th>
                        <th>Time</th>
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
                                                <td>{data.description}</td>
                                                <td>{data.keypoint}</td>
                                                <td>{moment(data.datetime).tz('Asia/Kolkata').format('hh:mm:ss A')}</td>
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

export default DayBookTemplate;
