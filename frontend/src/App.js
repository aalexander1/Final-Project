import React, { Component } from 'react';
import request from 'superagent';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      orderProducts: []
    }
// === GET all available products ===
    this.getAvailableProducts = this.getAvailableProducts.bind(this);

    this.getAvailableProducts();
  }

  getAvailableProducts() {
    request
      .get('http://localhost:8080/products')
      .then((res) => {

        this.setState({
          products: res.body
        });

      });
  }

// === POST Submit Order ===
  addToOrder = (productID) => {
    let orders = this.state.orderProducts;
    orders.push(productID);
    this.setState({orderProducts: orders})
  }

  submitOrder = () => {
    request
      .post('http://localhost:8080/submitOrder')
      .send({
        "orders": this.state.orderProducts
      })
      .then((res) => {

        this.setState({
          orderProducts: []
        });

      });
  }

  render() {
    return <div className="productListing">
      
       <ul>
      {this.state.products.map( (p, key) => 
        <li key={key}>{p.ProductName} - Price {p.Price} - 
          <button onClick={() => this.addToOrder(p.ProductID)}>Add to Order</button>
        </li>
        )
      }
      </ul>

      <button onClick={this.submitOrder}>Submit Order</button>
    </div>

  }

// === GET Specific Order ===

// === DELETE Delete Order ===



}

export default App;
