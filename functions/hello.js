exports.handler = async function (event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello from Lambda! 呀呀呀呀呀" }),
  };
};
