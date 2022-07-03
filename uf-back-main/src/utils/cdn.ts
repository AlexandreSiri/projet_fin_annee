import * as fs from "fs"
import * as sharp from "sharp"

export const createImages = async (filename: string): Promise<string[]> => {
    fs.existsSync(`./public/images/${filename}`) &&
        fs.rmdirSync(`./public/images/${filename}`)
    fs.mkdirSync(`./public/images/${filename}`)

    const temps: (string | null)[] = []
    await sharp(`./tmp/${filename}.jpg`)
        .resize(null, 1024)
        .jpeg()
        .toFile(`./public/images/${filename}/x1024.jpg`)
        .catch(() => null)
        .then(() => temps.push("x1024.jpg"))
    await sharp(`./tmp/${filename}.jpg`)
        .resize(null, 512)
        .jpeg()
        .toFile(`./public/images/${filename}/x512.jpg`)
        .catch(() => null)
        .then(() => temps.push("x512.jpg"))
    await sharp(`./tmp/${filename}.jpg`)
        .resize(null, 256)
        .jpeg()
        .toFile(`./public/images/${filename}/x256.jpg`)
        .catch(() => null)
        .then(() => temps.push("x256.jpg"))

    const files = temps.filter(f => !!f) as string[]

    if (!files.length) fs.rmdirSync(`./public/images/${filename}`)
    return files
}
