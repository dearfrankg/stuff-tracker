const middleware = async (req, res) => {
  const { method } = req;
  console.log("method: ", method);

  if (method === "OPTIONS") {
    return res.status(200).json({});
  }
};

export default middleware;
