import { Strategy } from "passport-local";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";


//-------------passport configration------------------//
// a middlerewere that takes the user password and compare it to the encrypted password in the db using bcrypt 
export const passportConfig = async (passport) => {
  passport.use(
    new Strategy((username, password, done) => {
      const user = prisma.users
        .findFirst({ where: { username } })
        .then((user) => {
          if (!user) {
            return done(null, false, {
              message: "invalid username or password",
            });
          }

          const isValid = bcrypt.compare(password, user.password);

          if (isValid) {
            return done(null, user);
          } else {
            return done(null, false, {
              message: "invalid username or password",
            });
          }
        })
        .catch((err) => {
          done(err);
        });
    })
  );

  // passes the user info to the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // retrive from session by req.user
  passport.deserializeUser((userId, done) => {
    const findUser = prisma.users
      .findUnique({ where: { id: userId } })
      .then((user) => {
        done(null, user);
      })
      .catch((err) => {
        done(err);
      });
  });
};

