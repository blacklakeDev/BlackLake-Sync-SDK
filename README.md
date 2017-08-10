# **BlackLake Sync SDK**
将数据同步至黑湖数据库

## **Installation**
```
npm i blacklake-sync-sdk
```
## **Usage**
引入 BlackLake Sync SDK
```js
const BlcakLakeSync = require('blacklake-sync-sdk');

const client = new BlcakLakeSync(yourUsername, yourPassword);
```

## **API**
### `connect()`
- 功能：连接黑湖服务器
- 返回值：`Promise`对象
    - `resolve`为`Connect Success`
    - `reject`为连接失败原因，如`手机号不存在`、`密码不正确`、`连接被拒绝,请联系相关人员`等
- Example
```js
client.connect().then(data => {
  console.log(data);   // Connect Success
}).catch(err => {
  console.log(err);    // 密码不正确
});
```

---

### `batch(type, options)`
- 功能：批量导入数据
- 参数
    - `type`:  `material`、`productOrder`
    - `options`:  数组形式，具体要求如下
```js
material格式
options = [
    {
        name: '玻璃',                            // 物料名称
        code: 'glass',                          // 物料编码
        unit: '千克',                            // 单位
        category: '原料',                        // 类别（原料、半成品、成品）
    }
]

---

productOrder格式
注意`startTime`, `endTime`和`targetDate`必须为'yyyy-mm-dd hh:mm:ss'格式

options = [
    {
        productOrderNo: "1112",                 // 订单唯一No,string 
        materialCode: 'glass',                  // 产出物料的编码
        materialAmount: '123',                  // 产出物料的数量
        startTime: "2017-08-01 11:11:11",       // 在黑湖系统里显示的开始时间,'yyyy-mm-dd hh:mm:ss'
        endTime: "2017-08-02 11:11:11",         // 在黑湖系统里显示的结束时间,'yyyy-mm-dd hh:mm:ss'
        purchaseOrderNo: "123",                 // 订单号
        targetDate: "2017-08-20 11:11:11",      // 订单交货日期
        customer: "交通大学"                      // 订单客户名称
    }        
] 
```
- 返回值：`Promise`对象
    - `resolve`为JSON对象：`{ createdAmount: num1, updatedAmount: num2 }`，其中`num1`为新增数，`num2`为更新数
    - `reject`为连接失败原因，如`options必须为Array`, `找不到type`，`参数错误`等
- Example
```js
const options = [
    {
        productOrderNo: "1112",
        materialCode: 'glass',
        materialAmount: '123',
        startTime: "2017-08-01 11:11:11",
        endTime: "2017-08-02 11:11:11",
        purchaseOrderNo: "123", 
        targetDate: "2017-08-20 11:11:11", 
        customer: "交通大学" 
    }        
];

client.batch('productOrder', options).then(result => {
    console.log(result);    // { createdAmount: 1, updatedAmount: 0 }
}).catch(err => {
    console.log(err);       // 错误原因
});
```



