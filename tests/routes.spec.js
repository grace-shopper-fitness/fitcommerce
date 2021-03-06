// /* eslint-disable no-unused-expressions */

 const supertest = require('supertest-as-promised')(require('../server/start.js'));
 const expect = require('chai').expect;
 const { db } = require('../db');
 const Product = require('../db/models/products')
 const OrderProduct = require('../db/models/orderProducts')

describe('Product routes', function () {

  beforeEach(function () {
    return db.sync({ force: true })
    .then(() => {
      Product.create({
        title: 'test product',
        description: 'test desc',
        price: 5.00,
        inventory: 10
      })
    })
  });

  describe('products routes', function () {

    it('GET responds with product after adding product to database', function () {

        return supertest
          .get('/api/products/available')
          .expect(200)
          .expect('Content-Type', /json/)
          .expect(function (res) {
            expect(res.body).to.be.an.instanceOf(Array);
            expect(res.body[0].title).to.equal('test product')
          })
    });


    it('PUT correctly updates product', function () {

      return supertest
        .put('/api/products/1')
        .send({
          description: 'Can you believe I did this in a test?'
        })
        .expect(200)
        .then(() => {
          return Product.findOne({
            where: {description: 'Can you believe I did this in a test?'}
          })
        })
        .then(foundProduct => {
          expect(foundProduct).to.exist;
          expect(foundProduct.description).to.equal('Can you believe I did this in a test?')
        })

    });

    it('POST correctly adds product', function () {

            return supertest
              .post('/api/products')
              .send({
                title: 'new test product',
                description: 'Im a genius',
                price: 1.00,
                inventory: 10
              })
              .expect(200)
              .then(() => {
                return Product.findOne({
                  where: {title: 'new test product'}
                })
              })
              .then(foundProduct => {
                expect(foundProduct).to.exist;
                expect(foundProduct.description).to.equal('Im a genius')
              })

          });
  });
});


describe('Cart routes', function () {

    beforeEach(function () {
      return db.sync({ force: true })
      .then(() => {
        Product.create({
          title: 'new test product',
          description: 'Im a genius',
          id: 1,
          price: 1.00,
          inventory: 10
        })
      })
    });

    describe('cart routes', function () {


      it('POST /new creates a new order in the database', function () {

              return supertest
                .post('/api/cart/new')
                .send({
                  quantity: 10,
                  product: {
                    title: 'new test product',
                    description: 'Im a genius',
                    id: 1,
                    price: 1.00,
                    inventory: 10
                  }
                })
                .expect(200)
                .then(() => {
                  return OrderProduct.findOne({
                    where: {productId: 1}
                  })
                })
                .then(foundOrderProduct => {
                  expect(foundOrderProduct).to.exist;
                  expect(foundOrderProduct.originalPrice).to.equal('1.00')
                  expect(foundOrderProduct.quantity).to.equal(10)
                })

            });
    });
  });

