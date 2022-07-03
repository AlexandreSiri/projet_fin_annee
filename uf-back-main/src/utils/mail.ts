import * as Mailjet from "node-mailjet"
import * as fs from "fs"
import path = require("path")

const mailjet = Mailjet.connect(
    process.env.EMAIL_KEY_CLIENT!,
    process.env.EMAIL_KEY_SECRET!
)

export const getBase64 = (file: string) => {
    const bitmap = fs.readFileSync(path.join(__dirname, "../../public", file))
    return Buffer.from(bitmap).toString("base64")
}

export const sendEmail = async (
    email: string,
    object: string,
    message: string,
    pdf?: string
) => {
    await mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
            {
                From: {
                    Email: process.env.EMAIL_EMAIL,
                    Name: process.env.EMAIL_NAME,
                },
                To: [
                    {
                        Email: email,
                    },
                ],
                Subject: object,
                TextPart: message,
                HTMLPart: message,
                Attachments: pdf
                    ? [
                          {
                              ContentType: "application/pdf",
                              Filename: pdf,
                              Base64Content: getBase64(pdf),
                          },
                      ]
                    : [],
            },
        ],
    })
}
