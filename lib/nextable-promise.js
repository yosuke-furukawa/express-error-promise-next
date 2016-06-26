class NextablePromise extends Promise {
  static setNext(next) {
    Promise.next = next; 
  }
}

module.exports = NextablePromise;
