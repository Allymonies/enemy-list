import 'dotenv/config'

export default function authUser(req) {
    return req.headers && process.env.ALLOWED_USER && req.headers["x-whomst-uuid"] === process.env.ALLOWED_USER;
}
