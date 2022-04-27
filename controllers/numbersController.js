import { getSession, isExists, formatPhone } from './../whatsapp.js'
import response from './../response.js'

const check = async (req, res) => {
    const session = getSession(res.locals.sessionId)
    const receiver = formatPhone(req.query.receiver)

    try {
        const exists = await isExists(session, receiver)

        if (!exists) {
            return response(res, 400, false, 'The receiver number does not exists.')
        }

        response(res, 200, true, 'The receiver number exists.')
    } catch {
        response(res, 500, false, 'Failed to check the number')
    }
}

export { check }
