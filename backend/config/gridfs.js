import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import crypto from 'crypto';
import path from 'path';
import mongoose from 'mongoose';

let gfs;
let storage;

mongoose.connection.once('open', () => {
    gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'lectures',
    });

    storage = new GridFsStorage({
        db: mongoose.connection.db,
        file: (req, file) => {
            return new Promise((resolve, reject) => {
                crypto.randomBytes(16, (err, buf) => {
                    if (err) {
                        return reject(err);
                    }
                    const filename = buf.toString('hex') + path.extname(file.originalname);
                    const fileInfo = {
                        filename,
                        bucketName: 'lectures',
                        metadata: {
                            originalName: file.originalname,
                            courseId: req.body.course,
                            lectureTitle: req.body.title,
                        },
                    };
                    resolve(fileInfo);
                });
            });
        },
    });
});

const upload = multer({
    storage: () => {
        if (!storage) {
            throw new Error('Storage is not initialized. Make sure the database connection is established first.');
        }
        return storage;
    },
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
    fileFilter: (req, file, cb) => {
        const filetypes = /pdf/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only PDF files are allowed!'));
    },
});

export { upload, gfs };
