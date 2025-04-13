import React from 'react';

const Footer = () => {
  return (
    <footer className="customer-footer">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5>TPV Auto</h5>
            <p>Your trusted auto parts retailer.</p>
          </div>
          <div className="col-md-4 mb-3">
            <h5>Customer Links</h5>
            <ul className="list-unstyled">
              <li><a href="/register" className="text-white text-decoration-none">Register</a></li>
              <li><a href="/orders" className="text-white text-decoration-none">My Orders</a></li>
              <li><a href="/cart" className="text-white text-decoration-none">Cart</a></li>
            </ul>
          </div>
          <div className="col-md-4 mb-3">
            <h5>Contact Us</h5>
            <p>Email: support@tpvauto.com<br />Phone: (123) 456-7890</p>
          </div>
        </div>
        <div className="text-center border-top pt-3">
          <p>&copy; {new Date().getFullYear()} TPV Auto. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;