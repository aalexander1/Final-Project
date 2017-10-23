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
    return <div>
       <ul>
      {this.state.products.map( (p, key) => 
        <li key={key}>{p.ProductName} - Price {p.Price} - 
          <button onClick={() => this.addToOrder(p.ProductID)}>Add to Orders</button>
        </li>
        )
      }
      </ul>

      <button onClick={this.submitOrder}>Submit</button>
    </div>

    // return (
    //   <div className="App">
    //     <header className="App-header">
    //       <img src={logo} className="App-logo" alt="logo" />
    //       <h1 className="App-title">Welcome to React</h1>
    //     </header>
    //     <p className="App-intro">
    //       To get started, edit <code>src/App.js</code> and save to reload.
    //     </p>
    //   </div>
    // );
  }
}

export default App;
