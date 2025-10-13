import React from 'react';
import './BrandWiseReportTemplate.css'; 
import { formatAmount } from '../utils/utils';

const BrandWiseReportTemplate = ({ reports }) => {
  return (
    <div>
      <table className="brandwise-table">
        <thead>
          <tr>
            <th rowSpan="2" scope="col">S.No</th>
            <th rowSpan="2" scope="col">Brand</th>
            <th colSpan="2" scope="colgroup">Q1</th>
            <th colSpan="2" scope="colgroup">Q2</th>
            <th colSpan="2" scope="colgroup">Q3</th>
            <th colSpan="2" scope="colgroup">Q4</th>
          </tr>
          <tr>
            <th scope="col">Qty</th>
            <th scope="col">Value</th>
            <th scope="col">Qty</th>
            <th scope="col">Value</th>
            <th scope="col">Qty</th>
            <th scope="col">Value</th>
            <th scope="col">Qty</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          {reports.length > 0 ? (
            reports.map((data, index) => (
              <tr key={data.brandid || index}>
                <td>{index + 1}</td>
                <td>{data.brand}</td>
                <td>{data.Q1qty}</td>
                <td>{formatAmount(data.Q1value)}</td>
                <td>{data.Q2qty}</td>
                <td>{formatAmount(data.Q2value)}</td>
                <td>{data.Q3qty}</td>
                <td>{formatAmount(data.Q3value)}</td>
                <td>{data.Q4qty}</td>
                <td>{formatAmount(data.Q4value)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" style={{ textAlign: 'center' }}>
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BrandWiseReportTemplate;