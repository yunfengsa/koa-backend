
module.exports = function () {
  return function *(next) {
    yield next;
    const callback = this.query["callback"];
    if (!callback) return;
    this.type = 'text/javascript';
    const startChunk =  'try{' + callback + '(';
    const endChunk = ')}catch(e){};';
    this.body =  startChunk + JSON.stringify(this.body) + endChunk;
  }
};
