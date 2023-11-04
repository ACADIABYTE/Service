module.exports = function authen(
  req,
  res,
  next
) {
  return req.user ? next() : res.status(404).send("Unauthorize");
}
