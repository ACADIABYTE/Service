module.exports = (data) => {
  let name = data.user.username;
  if (data.nick !== null) {
    name = data.nick;
  } else if (data.user.global_name !== null) {
    name = data.user.global_name;
  }
  return name;
};
