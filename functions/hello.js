exports.handler = async function (event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello, World! 我自定义的无服务器函数",
      txt,
    }),
  };
};
