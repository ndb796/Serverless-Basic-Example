'use strict';

module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello Node.js!",
    }, null, 2),
  };
  
};

module.exports.board = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello Board in Node.js!",
    }, null, 2),
  };
  
};