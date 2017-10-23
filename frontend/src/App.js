import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      products: [],
      orderProducts: []
    }
  }

  componentDidMount() {
    fetch('http://localhost:3001/products')
      .then( r => r.json())
      .then( r => this.setState({ products: r, loading: false}))
  }

  addToOrder = (productID) => {
    let orders = this.state.orderProducts;
    orders.push(productID);
    this.setState({orderProducts: orders})
  }

  submitOrder = () => {
    fetch('http://localhost:3001/products', {
      method: 'post',
       headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({orders: this.state.orderProducts})
    }).then(function(response) {
      return response.json();
    }).then(function(data) {
      alert(data.message);
    });
  }

  render() {
    if (this.state.loading) return <h1>loading ......</h1>;
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
