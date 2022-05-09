import { getSession, getChatList, isExists, sendMessage, formatPhone } from './../whatsapp.js'
import response from './../response.js'

const getList = (req, res) => {
    return response(res, 200, true, '', getChatList(res.locals.sessionId))
}

const send = async (req, res) => {
    const session = getSession(res.locals.sessionId)
    const receiver = formatPhone(req.body.receiver)
    const { message } = req.body

    try {
        const exists = await isExists(session, receiver)

        if (!exists) {
            return response(res, 400, false, 'The receiver number is not exists.')
        }

        await sendMessage(session, receiver, { text: message })

        response(res, 200, true, 'The message has been successfully sent.')
    } catch {
        response(res, 500, false, 'Failed to send the message.')
    }
}

const sendImage = async (req, res) => {
  const session = getSession(res.locals.sessionId)
  const receiver = formatPhone(req.body.receiver)
  const { caption, url } = req.body

  try {
      const exists = await isExists(session, receiver)

      if (!exists) {
          return response(res, 400, false, 'The receiver number does not exist.')
      }
      const imageMessage={
  	     caption: caption,
  	     image: {
  	      url: url,
  	     }
      }
      await sendMessage(session, receiver, imageMessage)

      response(res, 200, true, 'The message has been successfully sent.')
  } catch(e) {
    response(res, 500, false, 'Failed to send the message.'+e)
  }
}

const sendButtons = async (req, res) => {
  const session = getSession(res.locals.sessionId)
  const receiver = formatPhone(req.body.receiver)
  const { message, button1Id, button2Id, button1Text, button2Text, url, templateButtonLabel, templateButtonURL } = req.body

  try {
      const exists = await isExists(session, receiver)

      if (!exists) {
          return response(res, 400, false, 'The receiver number does not exist.')
      }
      var buttonMessage = {
          text: message,
          buttons: buttons,
          headerType: 1
      }
      if (url){
        buttonMessage = {
            caption: message,
            image: {
              url: url
            },
        }
      }
      var buttons = []
      if(templateButtonLabel){
        buttons = [
          { index: 1, urlButton: { displayText: templateButtonLabel, url: templateButtonURL }},
          { index: 2, quickReplyButton: {displayText: button1Text, id: button1Id}},
          { index: 3, quickReplyButton: {displayText: button2Text, id: button2Id}}
        ]
        buttonMessage["templateButtons"] = buttons
      }
      else if (button1Text){
        buttons = [
          {buttonId: button1Id, buttonText: {displayText: button1Text}, type: 1},
          {buttonId: button2Id, buttonText: {displayText: button2Text}, type: 1}
        ]
        buttonMessage["buttons"] = buttons
      }
      //console.log(imagasend)
      await sendMessage(session, receiver, buttonMessage)

      response(res, 200, true, 'The message has been successfully sent.')
  } catch(e) {
    response(res, 500, false, 'Failed to send the message.'+e)
  }
}

const sendBulk = async (req, res) => {
    const session = getSession(res.locals.sessionId)
    const errors = []

    for (const [key, data] of req.body.entries()) {
        if (!data.receiver || !data.message) {
            errors.push(key)

            continue
        }

        data.receiver = formatPhone(data.receiver)

        try {
            const exists = await isExists(session, data.receiver)

            if (!exists) {
                errors.push(key)

                continue
            }

            await sendMessage(session, data.receiver, { text: data.message })
        } catch {
            errors.push(key)
        }
    }

    if (errors.length === 0) {
        return response(res, 200, true, 'All messages has been successfully sent.')
    }

    const isAllFailed = errors.length === req.body.length

    response(
        res,
        isAllFailed ? 500 : 200,
        !isAllFailed,
        isAllFailed ? 'Failed to send all messages.' : 'Some messages has been successfully sent.',
        { errors }
    )
}

export { getList, send, sendBulk, sendImage, sendButtons }
