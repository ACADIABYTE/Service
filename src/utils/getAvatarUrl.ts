export default {
  url: "",
  format: "png",
  size: 1024,
  getUrl(data: any) {
    if (data.user.avatar == null) {
      this.url = `https://cdn.discordapp.com/embed/avatars/${
        parseInt(data.user.discriminator) % 5
      }.png`;
    } else {
      this.url = `https://cdn.discordapp.com/avatars/${data.user.id}/${data.user.avatar}.${this.format}?size=${this.size}`;
    }
    return this.url
  },
};
