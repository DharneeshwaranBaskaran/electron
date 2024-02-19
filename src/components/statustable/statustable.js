import React from 'react';
import "./status.css";
const Statustable = ({ data, handleSelectChange, handleEdit }) => {
  return (
    <table className="purchase-history-table">
      <thead>
        <tr>
          <th>Id</th>
          <th>Topic</th>
          <th>Count</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.id}</td>
            <td>{item.topic}</td>
            <td>{item.count}</td>
            <td>
              <select
              className='status'
                onChange={(e) => handleSelectChange(index, e.target.value)}
               >
                <option value="">Current status: {item.status}</option>
                <option value="Order Placed">Order Placed</option>
                <option value="Shipping">Shipping</option>
              </select>
              <button className="cart-button" onClick={() => handleEdit(item.id, index)}>Edit</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Statustable;
