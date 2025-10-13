import React from 'react';
import './LedgerTemplate.css'; // Assuming you have a CSS file for styling
import moment from 'moment-timezone';
import { formatAmount } from '../../src/utils/utils'

const StockReportTemplate = ({ reports }) => {

  return (
    <>
      {
        reports.map((product, index) => {
            const totalQty = product.orderdetails.reduce((sum, data) => sum + data.qty, 0);
            const totalPrice = product.orderdetails.reduce((sum, data) => sum + data.price, 0);

            return (
                <div key={index} className="ledger-customer">
                    <h3>{product?.brandRefId?.name} - {product?.categoryRefId?.name} - {product?.producttypeRefId?.name} - {product?.productName}</h3>
                    <table className="ledger-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Order No</th>
                                <th>Rate (Rs.)</th>
                                <th>Quantity</th>
                                <th>Price (Rs.)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                            product.orderdetails.length > 0 ? (
                                <>
                                    {
                                        product.orderdetails.map((data, dataIndex) => {
                                            return (
                                                <tr key={dataIndex}>
                                                    <td>{moment(data.orderdate).format('DD-MM-YYYY')}</td>
                                                    <td>{data.orderno}</td>
                                                    <td>{formatAmount(data.rate)}</td>
                                                    <td>{data.qty}</td>
                                                    <td>{formatAmount(data.price)}</td>
                                                </tr>
                                            );
                                        })
                                    }
                                    {/* Add a row for the totals */}
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total:</td>
                                        <td style={{ fontWeight: 'bold' }}>{totalQty}</td>
                                        <td style={{ fontWeight: 'bold' }}>{formatAmount(totalPrice)}</td>
                                    </tr>
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
        })
    }
    </>
  );
}

export default StockReportTemplate;
