import React, { Component } from 'react';

class Footer extends Component {
  render() {
    return (
      <footer className="admin-footer bg-dark text-white py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-3">
              <h5>TPV Auto Admin</h5>
              <p>Manage customers, orders, and products with ease.</p>
            </div>
            <div className="col-md-4 mb-3">
              <h5>Quick Links</h5>
              <ul className="list-unstyled">
                <li><a href="/admin/customer" className="text-white text-decoration-none">Customers</a></li>
                <li><a href="/admin/order" className="text-white text-decoration-none">Orders</a></li>
                <li><a href="/admin/product" className="text-white text-decoration-none">Products</a></li>
              </ul>
            </div>
            <div className="col-md-4 mb-3">
              <h5>Contact Us</h5>
              <p>Email: admin@tpvauto.com<br />Phone: (123) 456-7890</p>
            </div>
          </div>
          <div className="text-center border-top pt-3 mt-3">
            <p>&copy; {new Date().getFullYear()} TPV Auto. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;