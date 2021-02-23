class ExpressError extends Error {
  constreuctor(message, statusCode) {
    this.message = this.message;
    this.statusCode = statusCode;
  }
}

module.exports = ExpressError;
