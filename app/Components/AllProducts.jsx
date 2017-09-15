import React, { Component } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import {Card, CardActions, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux';

import {fetchProducts, getProduct} from '../reducers';

export class AllProducts extends Component {
  render() {

    const products = this.props.products;

    return (
      <div className='all-products'>
<<<<<<< HEAD
        {products && products.map( product => (
          <Card key={product.id} className='single-product col-lg-4 col-md-4 col-sm-4'>
            <br />
            <NavLink value={product.id} to={`/products/${product.id}`}>
              <CardMedia>
                <img src={`/images/${product.imageName}`}
                    alt={`tasty image for ${product.title}`}
                    className='card-image'/>
              </CardMedia>
              <CardTitle title={product.title} subtitle={`Price: $${product.price}`} />
              <CardText>
                { product.description }
              </CardText>
              <CardActions>
                <FlatButton label="Buy Now" className='buy-button'/>
              </CardActions>
            </NavLink>
          </Card>
        ) )}
=======
        <div>
          {products && products.map( product => (
            <Card className='single-product col-lg-4 col-md-4 col-sm-4' key={product.id}>
              <br />
              <NavLink onClick = {this.props.handleClick} value={product.id} to={`/products/${product.id}`}>
                <CardMedia>
                  <img src={`/images/${product.imageName}`}
                      alt={`tasty image for ${product.title}`}
                      className='card-image'/>
                </CardMedia>
                <CardTitle title={product.title} subtitle={`Price: $${product.price}`} />
                <CardText>
                  { product.description }
                </CardText>
                <CardActions>
                  <FlatButton label="Buy Now" className='buy-button'/>
                </CardActions>
              </NavLink>
            </Card>
          ) )}
        </div>
>>>>>>> master
      </div>
    )
  }
}


const mapStateToProps = function (state) {
  return {
    products: state.products,
    currentUser: state.currentUser
  }
}

const mapDispatchToProps = function (dispatch) {
  return {
    handleClick: function(e) {
      dispatch(getProduct(e.value))
    }
  }
}

const ProductsContainer = connect(mapStateToProps, mapDispatchToProps)(AllProducts);

export default ProductsContainer;
