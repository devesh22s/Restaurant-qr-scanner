import Session from "../model/Session";

const SessionTokenVerfiy = async (req, res, next) => {
  try {
    const { sessionToken } = req.body;
    const session = await Session.findOne({ sessionToken });
    const currentTime = new Date();
    if (session.expiresAt < currentTime) {
      res.send('Session token is expired');
    }

    req.session = session;
    next()
  } catch (error) {}
};
export default SessionTokenVerfiy
//continue as guest => session token  => window 2 din => register convert => local => verify => convert