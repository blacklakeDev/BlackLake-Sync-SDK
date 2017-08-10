const {
    connect,
    batch
} = require('./lib/main');

module.exports = class BlcakLakeSync {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.token = '';
    }

    connect() {
        return new Promise((resolve, reject) => {
            connect(this.username, this.password).then(token => {
                this.token = token;
                resolve('Connect Success');
            }).catch(err => reject(err));
        });
    }

    batch(type, options) {
        return batch(this.token, type, options);
    }
}