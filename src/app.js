const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const heroRoutes = require("./routes/heroRoutes");
const securedPropertyRoutes = require("./routes/securedPropertyRoutes");
const webinarRoutes = require("./routes/webinarRoutes");
const discoverVideoRoutes = require("./routes/discoverVideoRoutes");
const teamRoutes = require("./routes/teamRoutes");
const textTestimonialRoutes = require("./routes/textTestimonialRoutes");
const videoTestimonialRoutes = require("./routes/videoTestimonialRoutes");
const blogRoutes = require("./routes/blogRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const app = express();

// const allowedOrigins = [
//   // process.env.USER_FRONTEND_URL,
//   // process.env.ADMIN_FRONTEND_URL,
//   "https://vrsrealinvest.com.au",
//     "https://www.vrsrealinvest.com.au",
//     "https://admin.vrsrealinvest.com.au"
//     "https://www.admin.vrsrealinvest.com.au"
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   }),
// );
// app.use(cors({
//   origin: [
//     "https://vrsrealinvest.com.au",
//     "https://www.vrsrealinvest.com.au",
//     "https://admin.vrsrealinvest.com.au",
//     "https://snow-boar-395111.hostingersite.com"
//   ],
//   credentials: true
// }));
// app.use(cors({
//   origin: "*"
// }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // 🔥 HANDLE PREFLIGHT REQUEST
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// ✅ ALSO KEEP THIS
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/secured-properties", securedPropertyRoutes);
app.use("/api/webinars", webinarRoutes);
app.use("/api/discover-video", discoverVideoRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/text-testimonials", textTestimonialRoutes);
app.use("/api/video-testimonials", videoTestimonialRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/dashboard", dashboardRoutes);

module.exports = app;
