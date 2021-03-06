import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Review from './Review'

import { fetchProducts, getProduct, createNewCart, updateCart, updateProductAsAdmin } from '../reducers';

export class SingleProduct extends Component {
	constructor(props) {
		super(props);
		this.state = {
			chosenQty: 1,
			inventoryArr: [],
			open: false,
			goToCheckoutOpen: false,
			title: '',
			description: '',
			inventory: '',
			imageName: ''
		}
		this.createInventoryArr = this.createInventoryArr.bind(this);
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.onSubmit = this.onSubmit.bind(this);
		this.handleOpen = this.handleOpen.bind(this);
		this.onChange = this.onChange.bind(this);
		this.handleGoToCheckoutOpen = this.handleGoToCheckoutOpen.bind(this);

	}

	createInventoryArr(inventory) {
		let inventoryArr = [];
		for (let i = 1; i <= inventory; i++) {
			inventoryArr.push(i);
		}
		return inventoryArr;
	}


	handleOpen(event) {
		this.setState({ open: true });
	}

	handleGoToCheckoutOpen(event) {
		this.setState({ goToCheckoutOpen: true });
	}

	onChange(event) {
		if (event.target.name === "inventory") {
			this.setState({ [event.target.name]: event.target.value, inventoryArr: this.createInventoryArr(event.target.value) })
		}
		else this.setState({ [event.target.name]: event.target.value })
	}

	onSubmit(event) {
		event.preventDefault();
		const product = { title: this.state.title, description: this.state.description, inventory: this.state.inventory, imageName: this.state.imageName };
		this.props.updateProductAsAdmin(product);
		this.setState({ open: false })
	}

	componentDidMount() {
		const productId = this.props.match.params.productId;

		this.props.updateChosenProduct(productId)
			.then(() => {
				const inventoryArr = this.createInventoryArr(this.props.currentProduct.inventory);
				this.setState({ inventoryArr })
			});
	};

	// need to update link to go to a particular users id


	render() {
		const style = { marginLeft: 20};
		const formStyle = { marginRight: 5}
		let unavailMess = ''
		let modStyle={visibility:''};
		if (this.props.currentProduct.inventory <= 0) unavailMess = "Currently Unavailable"
		if (this.props.currentUser.isAdmin === false || !Object.keys(this.props.currentUser).length) {
			modStyle.visibility = "hidden";
		}

		return (
			<div className="container">
				<div className="row product-container">
					<div className="col-sm-6 col-md-6 col-lg-6 product-image">
						<h2 className="text-center">{this.props.currentProduct.title} </h2>
						<br />
						<img src={`/images/${this.props.currentProduct.imageName}`} className='img-responsive'/>
					</div>
					<div className="col-sm-6 col-md-6 col-lg-6 product-description">
						<div>
							<b>Description:  </b>
							{this.props.currentProduct.description}
						</div>
						<div>
							<b>Price: </b>$
							{this.props.currentProduct.price}
						</div>
						<div>
							<form
								onSubmit={this.handleSubmit}
							>
								<div className="form-group">
									<label>
										<b>Quantity: </b>
										<br />
										{unavailMess.length ? 'Item currently unavailable' : ''}
										<select
											className="form-control"
											name="qty"
											value={this.state.chosenQty}
											onChange={this.handleChange}
										>
											{
												this.state.inventoryArr.map(num => {
													return (
														<option key={num} value={num}>{num}</option>
													)
												})
											}
										</select>
									</label>
									<br />
								</div>
								<div className="form-group">
								{unavailMess.length ? <RaisedButton className="raised-button--inline" primary={true} disabled label="Add to Cart" onClick={this.handleSubmit} /> : <RaisedButton className="raised-button--inline" primary={true} label="Add to Cart" onClick={this.handleSubmit} />}
									<Dialog modal={false} open={this.state.goToCheckoutOpen} modal={false}>
									<NavLink to='/cart'>
										<RaisedButton label="Proceed to Cart" />
									</NavLink>
									<br />
									<br />
									<NavLink to='/'>
										<RaisedButton label="Continue Shopping" />
									</NavLink>
									</Dialog>
								</div>
							</form>
							<div>
							</div>
						</div>

						<div>
							<RaisedButton className="raised-button--inline" secondary={true} label="Modify" onClick={this.handleOpen} style={modStyle}/>
							<Dialog modal={false} open={this.state.open} modal={false} onClick={this.handleClose} >
								<form onSubmit={this.onSubmit}>
									<label style={formStyle}>Title:  </label><TextField name="title" hintText={this.props.currentProduct.title} onChange={this.onChange} /><br />
									<label style={formStyle}>Description:  </label><TextField name="description" hintText={this.props.currentProduct.description} onChange={this.onChange} /> <br />
									<label style={formStyle}>Inventory:  </label><TextField name="inventory" hintText={this.props.currentProduct.inventory} onChange={this.onChange} /> <br />
									<label style={formStyle}>Image URL:  </label><TextField name="imageName" hintText={this.props.currentProduct.imageName} onChange={this.onChange} /> <br />
									<RaisedButton type="submit" label="submit" primary={true} />
								</form>
							</Dialog>
						</div>
					</div>
				</div>
				<Review
					productId={this.props.match.params.productId}
					productName={this.props.currentProduct.title}
					currentUser={this.props.currentUser}/>
			</div>
		)
	}

	handleChange(event) {
		this.setState({ chosenQty: event.target.value })
	}

	handleSubmit(event) {
		event.preventDefault();
		this.setState({ goToCheckoutOpen: true });
		this.props.addToCart(this.state.chosenQty, this.props.currentProduct, this.props.cart)
	}
}

const mapStateToProps = function (state) {
	return {
		currentProduct: state.currentProduct,
		currentUser: state.currentUser,
		cart: state.cart,
		products: state.products
	}
}

const mapDispatchToProps = function (dispatch, ownProps) {
	return {
		updateChosenProduct: function (product) {
			return dispatch(getProduct(product))
		},
		addToCart: function (qty, product, cart) {
			if (Object.keys(cart).length === 0) dispatch(createNewCart(product, qty))
			else dispatch(updateCart(product, qty))
		},
		updateProductAsAdmin: function (modProduct) {
			Object.keys(modProduct).forEach((key) => (modProduct[key] === '' || modProduct[key] === null) && delete modProduct[key]);
			const id = ownProps.match.params.productId;
			dispatch(updateProductAsAdmin(id, modProduct));
			dispatch(fetchProducts())

		}
	}
}

const SingleProductContainer = connect(mapStateToProps, mapDispatchToProps)(SingleProduct);

export default SingleProductContainer;
