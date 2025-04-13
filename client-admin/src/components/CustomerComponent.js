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
      <tr key={item._id} onClick={() => this.trCustomerClick(item)}>
        <td>{item._id}</td>
        <td>{item.username}</td>
        <td>{item.name}</td>
        <td>{item.email}</td>
        <td>{item.active ? 'Active' : 'Inactive'}</td>
        <td>
          {item.active === 0 ? (
            <button
              className="btn btn-link text-primary action-btn"
              onClick={() => this.lnkEmailClick(item)}
            >
              Email
            </button>
          ) : (
            <button
              className="btn btn-link text-danger action-btn"
              onClick={() => this.lnkDeactiveClick(item)}
            >
              Deactivate
            </button>
          )}
        </td>
      </tr>
    ));

    const orders = this.state.orders.map((item) => (
      <tr key={item._id} onClick={() => this.trOrderClick(item)}>
        <td>{item._id}</td>
        <td>{new Date(item.cdate).toLocaleString()}</td>
        <td>{item.customer.name}</td>
        <td>${item.total.toFixed(2)}</td>
        <td>{item.status}</td>
      </tr>
    ));

    return (
      <div className="customer-management">
        <h2 className="text-primary mb-4">Customer List</h2>
        <div className="table-responsive">
          <table className="table table-hover customer-table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Username</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Active</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>{customers}</tbody>
          </table>
        </div>

        {this.state.orders.length > 0 && (
          <div className="mt-4">
            <h2>Order List</h2>
            <div className="table-responsive">
              <table className="table table-hover order-table">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Creation Date</th>
                    <th scope="col">Customer Name</th>
                    <th scope="col">Total</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>{orders}</tbody>
              </table>
            </div>
          </div>
        )}

        {this.state.order && (
          <div className="mt-4">
            <h2>Order Detail</h2>
            <div className="table-responsive">
              <table className="table order-detail-table">
                <thead>
                  <tr>
                    <th scope="col">No.</th>
                    <th scope="col">Product ID</th>
                    <th scope="col">Product Name</th>
                    <th scope="col">Image</th>
                    <th scope="col">Price</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.order.items.map((item, index) => (
                    <tr key={item.product._id}>
                      <td>{index + 1}</td>
                      <td>{item.product._id}</td>
                      <td>{item.product.name}</td>
                      <td>
                        <img
                          src={`data:image/jpg;base64,${item.product.image}`}
                          width="50"
                          height="50"
                          alt={item.product.name}
                        />
                      </td>
                      <td>${item.product.price.toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td>${(item.product.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
    }).catch((error) => {
      console.error('Error fetching customers:', error);
      alert('Failed to fetch customers. Please try again.');
    });
  }

  apiGetOrdersByCustID(cid) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/orders/customer/' + cid, config).then((res) => {
      this.setState({ orders: res.data });
    }).catch((error) => {
      console.error('Error fetching orders:', error);
      this.setState({ orders: [] });
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
    }).catch((error) => {
      console.error('Error deactivating customer:', error);
      alert('Failed to deactivate customer. Please try again.');
    });
  }

  apiGetCustomerSendmail(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/customers/sendmail/' + id, config).then((res) => {
      if (res.data) {
        alert('Verification email sent successfully.');
      } else {
        alert('Error! Could not send verification email.');
      }
    }).catch((error) => {
      console.error('Error sending verification email:', error);
      alert('Failed to send verification email. Please try again.');
    });
  }
}

export default Customer;