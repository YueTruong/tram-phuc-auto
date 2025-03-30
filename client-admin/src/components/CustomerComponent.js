import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class Customer extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      orders: [],
      order: null
    };
  }

  render() {
    const customers = this.state.customers.map((item) => (
      <tr key={item._id} className="border-b hover:bg-gray-100 cursor-pointer" onClick={() => this.trCustomerClick(item)}>
        <td className="p-3">{item._id}</td>
        <td className="p-3">{item.username}</td>
        <td className="p-3">{item.password}</td>
        <td className="p-3">{item.name}</td>
        <td className="p-3">{item.email}</td>
        <td className="p-3">{item.active ? 'Active' : 'Inactive'}</td>
        <td className="p-3">
          {item.active === 0 ? (
            <button className="text-blue-500 hover:underline" onClick={() => this.lnkEmailClick(item)}>EMAIL</button>
          ) : (
            <button className="text-red-500 hover:underline" onClick={() => this.lnkDeactiveClick(item)}>DEACTIVE</button>
          )}
        </td>
      </tr>
    ));

    const orders = this.state.orders.map((item) => (
      <tr key={item._id} className="border-b hover:bg-gray-100 cursor-pointer" onClick={() => this.trOrderClick(item)}>
        <td className="p-3">{item._id}</td>
        <td className="p-3">{new Date(item.cdate).toLocaleString()}</td>
        <td className="p-3">{item.customer.name}</td>
        <td className="p-3">{item.total}</td>
        <td className="p-3">{item.status}</td>
      </tr>
    ));

    return (
      <div className="content">
        <h2 className="text-2xl font-bold text-center ">Customer List</h2>
        <div className="overflow-x-auto">
          <table className="w-full border rounded-lg shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Username</th>
                <th className="p-3">Password</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Active</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>{customers}</tbody>
          </table>
        </div>
        {this.state.orders.length > 0 && (
          <div className="mt-5">
            <h2 className="text-2xl font-bold text-center">Order List</h2>
            <div className="overflow-x-auto">
              <table className="w-full border rounded-lg shadow-md">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Creation Date</th>
                    <th className="p-3">Customer Name</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>{orders}</tbody>
              </table>
            </div>
          </div>
        )}

        {this.state.order && (
          <div className="mt-5">
            <h2 className="text-2xl font-bold text-center mb-4">Order Detail</h2>
            <table className="min-w-full bg-white border rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="py-2 px-4">No.</th>
                  <th className="py-2 px-4">Product ID</th>
                  <th className="py-2 px-4">Product Name</th>
                  <th className="py-2 px-4">Image</th>
                  <th className="py-2 px-4">Price</th>
                  <th className="py-2 px-4">Quantity</th>
                  <th className="py-2 px-4">Amount</th>
                </tr>
              </thead>
              <tbody>
                {this.state.order.items.map((item, index) => (
                  <tr key={item.product._id} className="border-b">
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">{item.product._id}</td>
                    <td className="py-2 px-4">{item.product.name}</td>
                    <td className="py-2 px-4">
                      <img src={`data:image/jpg;base64,${item.product.image}`} width="50" height="50" alt={item.product.name} className="rounded" />
                    </td>
                    <td className="py-2 px-4">${item.product.price}</td>
                    <td className="py-2 px-4">{item.quantity}</td>
                    <td className="py-2 px-4">${item.product.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  componentDidMount() {
    this.apiGetCustomers();
  }

  trCustomerClick(item) {
    this.setState({ orders: [], order: null });
    this.apiGetOrdersByCustID(item._id);
  }
  trOrderClick(item) {
    this.setState({ order: item });
  }
  lnkDeactiveClick(item) {
    this.apiPutCustomerDeactive(item._id, item.token);
  }
  lnkEmailClick(item) {
    this.apiGetCustomerSendmail(item._id);
  }

  apiGetCustomers() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/customers', config).then((res) => {
      this.setState({ customers: res.data });
    });
  }
  apiGetOrdersByCustID(cid) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/orders/customer/' + cid, config).then((res) => {
      this.setState({ orders: res.data });
    });
  }
  apiPutCustomerDeactive(id, token) {
    const body = { token: token };
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/customers/deactive/' + id, body, config).then((res) => {
      if (res.data) {
        this.apiGetCustomers();
      } else {
        alert('Error! An error occurred. Please try again later.');
      }
    });
  }
  apiGetCustomerSendmail(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/customers/sendmail/' + id, config).then((res) => {
      alert(res.data.message);
    });
  }
}

export default Customer;