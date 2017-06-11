import auth = require('basic-auth')

export default function authenticate(requiredPassword) {
  if(! requiredPassword)
    console.warn("No BASIC_AUTH_PASSWD set, disabling authentication!")

  return (req, res, next) => {
    const user = auth(req)
    if(!requiredPassword || (user && user.pass === requiredPassword))
      next()
    else
      res.status(401).json({error: 'Basic Auth failed.'})
  }
}
