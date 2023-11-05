const DiscordStrategy = require('passport-discord').Strategy
const passport = require("passport")
const GoogleSheet = require("../database/googleSheet")
const axios = require("axios")
const getAvatarUrl = require("../utils/getAvatarUrl")
const getName = require("../utils/getName")

passport.serializeUser((user, done) => {
  return done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const dataInfo = await axios
      .get(
        "https://discord.com/api/v10/guilds/1051554195100155995/members/" + id,
        { headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` } }
      )
      .then((res) => res.data);
    const url = getAvatarUrl.getUrl(dataInfo);
    const userDataBase = new GoogleSheet(
      "1hcclYZysS708thPzK07AGjj066vFG9H4xjPfw8dj2zA"
    );

    await userDataBase.init();

    const userData = userDataBase.find("discord_id", id);

    const user = {
      discord_id: userData[0].discord_id,
      roles: dataInfo.roles,
      profile: url,
      displayName: getName(dataInfo),
      ticket: parseInt(userData[0].ticket),
      rainbow_diamond: parseInt(userData[0].rainbow_diamond),
    };

    return user ? done(null, user) : done(null, null);
  } catch (err) {
    console.error(err);
    done(err, null);
  }
});

passport.use(
  new DiscordStrategy(
    {
      clientID: "1131395690300461096",
      clientSecret: "Ub8ERfwnNOCugbU0YdeQgon-UvLllQAd",
      callbackURL: "http://localhost:3001/auth/discord/redirect",
      scope: ["identify", "guilds", "connections"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userData = new GoogleSheet(
          "1hcclYZysS708thPzK07AGjj066vFG9H4xjPfw8dj2zA",
          0
        );
        const accessData = new GoogleSheet(
          "1hcclYZysS708thPzK07AGjj066vFG9H4xjPfw8dj2zA",
          1
        );

        await userData.init();
        await accessData.init();

        const alreadyAccess = accessData.find("discord_id", profile.id);

        if (!alreadyAccess) {
          await accessData.create([
            {
              access_token: accessToken,
              refresh_token: refreshToken,
              discord_id: profile.id,
            },
          ]);
          await userData.create([
            {
              id: "=Row()-1",
              discord_id: profile.id,
              rainbow_diamond: 0,
              ticket: 1,
            },
          ]);
        } else {
          await accessData.update("discord_id", profile.id, {
            access_token: accessToken,
            refresh_token: refreshToken,
            discord_id: profile.id,
          });
        }

        done(null, profile);
      } catch (error) {
        console.log(error);
        done(error, null);
      }
    }
  )
);