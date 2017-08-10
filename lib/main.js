const http = require('http');
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
  const configs = {
    port: new URL(url).port,
    hostname: new URL(url).hostname,
    method: 'POST',
    path: `/bulk_create/${type}`,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'X-AUTH': token,
    },
  };

  return new Promise((resolve, reject) => {
    const req = http.request(configs, (res) => {
      const statusCode = res.statusCode;
      if (statusCode === 404 || statusCode === 401 || statusCode === 400) {
        reject(statusCode === 404 ? `找不到type ${type}` : (statusCode === 401 ? 'Token错误' : 'items必须为Array'));
        return;
      }

      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        const data = JSON.parse(chunk);
        if (data.errors) {
          reject('参数错误: ' + data.errors.map(err => `No.${err.ItemCode}-${err.message}`).join('; '));
          return;
        }
        resolve(data);
      });
    });

    req.on('error', (e) => {
      reject(e.message);
    });

    req.write(postData);
    req.end();
  });
};