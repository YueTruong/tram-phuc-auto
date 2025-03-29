import React, { Component } from "react";
import axios from "axios";

class Customer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customers: [],
            loading: true,
        };
    }

    componentDidMount() {
        this.fetchCustomers();
    }

    fetchCustomers = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("/api/admin/customers", {
                headers: { Authorization: `Bearer ${token}` },
            });
            this.setState({ customers: response.data, loading: false });
        } catch (error) {
            console.error("Error fetching customers:", error);
            this.setState({ customers: [], loading: false });
        }
    };

    render() {
        return (
            <div className="container mt-4">
                <h2>Customer Management</h2>
                {this.state.loading ? (
                    <p>Loading customers...</p>
                ) : this.state.customers.length === 0 ? (
                    <p>No customers found.</p>
                ) : (
                    <table className="table table-bordered">
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.customers.map((customer) => (
                                <tr key={customer._id}>
                                    <td>{customer._id}</td>
                                    <td>{customer.name}</td>
                                    <td>{customer.email}</td>
                                    <td>{customer.phone}</td>
                                    <td>{customer.active ? "Active" : "Inactive"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        );
    }
}

export default Customer;