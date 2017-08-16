const http = require('http');
const https = require('https');
const { URL } = require('url');
const graphqlClient = require('./graphqlClient');
const hashPassword = require('./util').hashPassword;
const url = require('./config').urls.production.url;

exports.connect = (username, password) => {
  return new Promise((resolve, reject) => {
    graphqlClient.defaultClient.mutate(`
    {
      createToken(input:{
        username:"${username}", 
        password:"${hashPassword(password)}"
      }) {
        token,
        error
      }
    }`).then(result => {
      if (result.createToken.error) {
        reject(result.createToken.error);
      } else {
        resolve(result.createToken.token);
      }
    }).catch(err => {
      reject('连接被拒绝,请联系相关人员');
    });
  });
};

exports.batch = (token, type, items) => {
  const postData = JSON.stringify(items);
  const _url = new URL(url);
  const configs = {
    port: _url.port,
    hostname: _url.hostname,
    method: 'POST',
    path: `/bulk_create/${type}`,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'X-AUTH': token,
      'User-Agent': 'sync-sdk',
      'x-client': 'sync-sdk',
    },
  };

  return new Promise((resolve, reject) => {
    const client = _url.protocol === "https:" ? https : http;
    const req = client.request(configs, (res) => {
      const statusCode = res.statusCode;
      if (statusCode === 404 || statusCode === 401) {
        reject(statusCode === 404 ? `找不到type ${type}` : 'Token错误');
        return;
      }

      res.setEncoding('utf8');
      
      let tempData = '';
      res.on('data', (chunk) => {
        tempData += chunk;
      });
      
      res.on('end',() => {
        const data = JSON.parse(tempData);
        if (data.errors) {
          reject('参数错误: ' + data.errors.map(err => `No.${err.ItemCode}-${err.message}`).join('; '));
          return;
        }
        resolve(data);
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(postData);
    req.end();
  });
};