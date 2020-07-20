const express = require('express')
const router = new express.Router()
const sharp = require('sharp');
const multer = require('multer');
const path = require('path');
const fs = require("fs-extra")

var upload = multer({ dest: 'uploads/' })

router.get('/image/', (req, res) => {
    console.log("Alert")
    res.send('Image')
})

router.post(
    '/image/upload',
    upload.single('image'),
    (req, res) => {
        console.log("Alert")

        const tempPath = req.file.path;
        const targetPath = path.join(__dirname, "../public/images/" + req.file.originalname);

        fs.rename(tempPath, targetPath, err => {
            if (err) return res.send("Err: " + err);

            sharp(targetPath)
                .rotate()
                .resize(800)
                .toBuffer()
                .then(data => { fs.writeFileSync(targetPath, data); })
                .catch(err => { console.log(err) });

            res
                .status(200)
                .contentType("text/plain")
                .end("File uploaded!");
        });
    }
);

router.delete('/image/', (req, res) => {
    const filename = req.query.filename

    fs.unlink(path.join(__dirname, '../public/images/' + filename)).then(() => {
        res.send('File Deleted')
    })
})

module.exports = router