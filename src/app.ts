import "dotenv/config";
import express from "express";
import session from "express-session";
import passport from "passport";
import authRoutes from "./routes/authRoutes";

const app = express();

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, (user as any).id);
});

passport.deserializeUser(async (id, done) => {
  const user = await findUserById(id); // Assurez-vous que findUserById est défini dans src/models/user.ts
  done(null, user);
});

app.use("/auth", authRoutes);

export default app;
