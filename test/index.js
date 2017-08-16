const BlcakLakeSync = require('../index');

const client = new BlcakLakeSync('heihukeji', 'heihukeji');

const items = [{
  materialCode: "glass",
  materialAmount: "300",
  startTime: "2017-08-07 11:11:11",
  endTime: "2017-08-08 11:11:11",
  purchaseOrderNo: "123",
  customer: "交通大学",
  targetDate: "2017-08-20 11:11:11",
  productOrderNo: "1112"
}];

client.connect().then(data => {
  console.log(data);

  for (let i = 0; i < 50; i++) {
    client.batch('productOrder', items).then(result => {
      console.log(result);
    }).catch(err => {
      console.log(err);
    });    
  }
}).catch(err => {
  console.log(err);
});
