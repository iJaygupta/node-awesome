process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./../app');
const should = chai.should();

chai.use(chaiHttp);

describe('Ping', function () {
    it('should return provider list on /api/provider/list', function (done) {
        console.log(server)
        chai.request(server)
            .get('/api/provider/list')
            .end(function (err, res) {
                console.log("data ==>>", res)
                // res.should.have.status(200);
                // res.should.be.json;
                // res.body.should.be.a('object');
                // res.body.should.have.property('data');
                // res.body.data.should.have.property('items');
                // res.body.data.items.should.be.a('array');
                // res.body.data.should.equal('pong');
                // done();
            });
    });
});

// describe('Info', function () {
//   it('should return error on  /metar/info GET', function (done) {
//     chai.request(server)
//       .get('/metar/info')
//       .end(function(err,res) {
//         res.should.have.status(404);
//         res.should.be.json;
//         res.body.should.be.a('object');
//         res.body.should.have.property('error');
//         res.body.error.should.be.a('object');
//         res.body.error.should.have.property('message');
//         res.body.error.message.should.equal('query param scode is missing');
//         done();
//       });
//   });

//   it('should return error weather json data  /metar/info?scode=ANJA GET', function (done) {
//     chai.request(server)
//       .get('/metar/info?scode=ANJA')
//       .end(function(err,res) {
//         res.should.have.status(200);
//         res.should.be.json;
//         res.body.should.be.a('object');
//         res.body.should.have.property('data');
//         res.body.data.should.be.a('object');
//         res.body.data.should.have.property('station');
//         res.body.data.station.should.equal('ANJA');
//         done();
//       });
//   });

//   it('should return status 200 for all station request', function (done) {
//     let stations = ['AGGH', 'AGGL', 'AGGM', 'ANAU', 'AYMD', 'AYMO', 'AYPY', 'AYWK', 'BGAM', 'BGAS', 'BGAT', 'BGBW', 'BGCO', 'BGDB', 'BGDH', 'BGEM', 'BGFH', 'BGGD', 'BGGH', 'BGHB', 'BGJH', 'BGJN', 'BGKK', 'BGKT']
//     for(let i=0; i< stations.length; i++){
//       chai.request(server)
//         .get('/metar/info?scode='+stations[i])
//         .end(function(err,res){
//           res.should.have.status(200);
//           done();
//         });
//     }
//   });
// });
