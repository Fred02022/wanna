const fs = require('fs');
const qs = require('qs');
const express = require('express');
const router = express.Router();
const db = require('./db.js');
const s3 = require('./s3.js');
const caver = require('./caver_back.js');
const { BigNumber } = require('ethers');
const multer = require('multer');
const multerS3 = require('multer-s3');

const upload = () => {
    const _upload = multer({
        storage: multerS3({
            s3: s3,
            bucket: 'wannaproject',
            acl: "public-read",
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: function (req, file, cb) {
                const body = JSON.parse(req.body.info)
                cb(null, `profile/${body.address}.png`)
            },
        })
    })
    return _upload;
}

const upload2 = () => {
    const _upload = multer({
        storage: multerS3({
            s3: s3,
            bucket: 'wannaproject',
            acl: "public-read",
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: function (req, file, cb) {
                const body = JSON.parse(req.body.info)
                if (file.fieldname === 'symbol') {
                    cb(null, `image/${body.project_id}.png`)
                } else if (file.fieldname === 'img') {
                    cb(null, `project/${body.project_id}.png`)
                }
            },
        })
    })
    return _upload;
}

router.post('/getUserInfo', async (req, res) => {
    try {
        const [row, field] = await db.query(
            `SELECT * FROM user WHERE address=?`
            , [req.body.address]
        )
        res.send(row[0])
    } catch (err) {
        console.error(err)
    }
})

router.post('/changeUserInfo', upload().single('img'), async (req, res) => {
    try {
        const info = JSON.parse(req.body.info)
        const [row1, fields1] = await db.query(
            `SELECT id FROM user WHERE address=?`,
            [info.address]
        )
        if (row1.length > 0) {
            const result = await db.query(
                `UPDATE user set name=?, intro=?, image=? WHERE address=?`,
                [info.name, info.intro, `https://wannaproject.s3.ap-northeast-2.amazonaws.com/profile/${info.address}.png`, info.address]
            )
            res.send({ result: 'success' })
            return
        }
        const result = await db.query(
            `INSERT INTO user(address, name, intro,image) VALUES(?,?,?,?)`,
            [info.address, info.name, info.intro, `https://wannaproject.s3.ap-northeast-2.amazonaws.com/profile/${info.address}.png`]
        )
        res.send({ result: 'success' })
    } catch (err) {
        console.error(err);
        res.send({ result: 'error' })
    }
})


router.post('/getProjectList', async (req, res) => {
    try {
        const { category, keyword } = req.body;
        let projects;
        if (category === undefined && keyword === undefined) {
            const [row1, field1] = await db.query(
                `SELECT id, name, launcher,category, funding, funding_all,start_date FROM project`
            )
            projects = row1
        } else if (category !== undefined && keyword === undefined) {
            const [row1, field1] = await db.query(
                `SELECT id, name, launcher,category, funding, funding_all,start_date FROM project WHERE category=?`,
                [category]
            )
            projects = row1
        } else if (category === undefined && keyword !== undefined) {
            const keyword_ = `%${keyword}%`
            const [row1, field1] = await db.query(
                `SELECT id, name, launcher,category, funding, funding_all,start_date FROM project WHERE name LIKE ?`,
                [keyword_]
            )
            projects = row1
        }

        const newProject = [];
        projects.map((x) => {
            if (x.id < 9999) {
                newProject.push(x)
            }
        })
        newProject.sort((a, b) => b - a)
        projects.map((x) => {
            if (x.id > 9999) {
                newProject.push(x)
            }
        })

        res.send({
            projects: projects
        })
    } catch (err) {
        console.error(err)
    }
})

router.post('/getProject', async (req, res) => {
    try {
        const [row1, field1] = await db.query(
            `SELECT * FROM project WHERE id=?`
            , [req.body.id]
        )
        const { name, launcher, link_github, link_medium, link_web, link_notion, link_twitter, funding, category, project_more, funding_all, descrip, start_date } = row1[0];

        const [row2, field2] = await db.query(
            `SELECT * FROM project_detail WHERE project_id=?`
            , [req.body.id]
        )
        const detail = [];
        for (let i = 0; i < row2.length; i++) {
            detail.push({ semiTitle: row2[i].semi_title, detail: row2[i].detail })
        }

        const [row3, field3] = await db.query(
            `SELECT * FROM project_roadmap WHERE project_id=?`
            , [req.body.id]
        )
        const roadmap = [];
        for (let i = 0; i < row3.length; i++) {
            roadmap.push({ due: row3[i].due, expense: row3[i].expense, detail: row3[i].detail })
        }

        res.send({
            name: name, launcher: launcher, category: category, desc: descrip, start: start_date,
            funding: funding, funding_all: funding_all,
            link_github: link_github, link_medium: link_medium, link_web: link_web, link_notion, link_twitter,
            project_more: project_more, detail: detail, roadmap: roadmap
        })
    } catch (err) {
        console.error(err)
    }
})

router.post('/createProject', upload2().fields([{ name: 'img' }, { name: 'symbol' }]), async (req, res) => {
    try {
        const info = JSON.parse(req.body.info);
        const { project_id, category, launcher, name, link_github, link_medium, link_web, link_notion, link_twitter, detail, roadmap, project_more, desc } = info;

        let all_ = 0;
        for (let i = 0; i < roadmap.length; i++) {
            all_ = all_ + Number(roadmap[i].expense);
        }

        const result = await db.query(
            `INSERT INTO project(id, name, launcher, link_github, link_medium, link_web, link_notion, link_twitter,project_more,category,descrip,funding,funding_all,start_date) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,NOW())`,
            [project_id, name, launcher, link_github, link_medium, link_web, link_notion, link_twitter, project_more, category, desc, 0, caver.utils.convertToPeb(all_, 'KLAY').toString()]
        )
        for (let i = 0; i < detail.length; i++) {
            const result2 = await db.query(
                `INSERT INTO project_detail(project_id, semi_title, detail) VALUES(?,?,?)`,
                [project_id, detail[i].semiTitle, detail[i].detail]
            )
        }
        for (let i = 0; i < roadmap.length; i++) {
            const result2 = await db.query(
                `INSERT INTO project_roadmap(project_id, due, expense, detail) VALUES(?,?,?,?)`,
                [project_id, roadmap[i].due, caver.utils.convertToPeb(roadmap[i].expense, 'KLAY').toString(), roadmap[i].detail]
            )
        }


        const newData = {
            name: `Wanna Project #${project_id}`,
            image: `https://wannaproject.s3.ap-northeast-2.amazonaws.com/image/${project_id}.png`,
            attributes: [
                { trait_type: 'project_name', value: name },
                { trait_type: 'project_id', value: project_id },
                { trait_type: "stage", value: 0, max_value: roadmap.length }
            ]
        }

        const metaBuff = Buffer.from(JSON.stringify(newData))

        const meta = {
            'Bucket': 'wannaproject',
            'Key': `meta/${project_id}.json`,
            'Body': metaBuff,
            'ContentType': 'application/json',
            'Tagging': 'public=yes'
        }

        const result2 = await s3.upload(meta).promise();

        res.send({ msg: 'success' })
    } catch (err) {
        console.error(err);
        res.send({ msg: 'error' })
    }
})

router.post('/sponse', async (req, res) => {
    try {
        const body = req.body;
        const { id, sponsor, amount, ts } = body;

        const result = await db.query(
            `INSERT INTO project_sponse(project_id, sponsor, amount) VALUES(?,?,?)`,
            [id, sponsor, amount]
        )

        const [row0, field0] = await db.query(
            `SELECT funding FROM project WHERE id=?`,
            [id]
        )

        const _fun = (BigNumber.from(row0[0].funding).add(BigNumber.from(amount))).toString();

        const result_ = await db.query(
            `UPDATE project set funding=? WHERE id=?`,
            [_fun, id]
        )

        const newData = {
            name: `Wanna Sponsor #${id} - ${ts}`,
            image: `https://wannaproject.s3.ap-northeast-2.amazonaws.com/image/${id}.png`,
            attributes: [
                { trait_type: 'amount', value: caver.utils.convertFromPeb(amount, 'KLAY').toString() },
                { trait_type: 'project_id', value: id }
            ]
        }

        const metaBuff = Buffer.from(JSON.stringify(newData))

        const meta = {
            'Bucket': 'wannaproject',
            'Key': `sponsor/meta/${ts}.json`,
            'Body': metaBuff,
            'ContentType': 'application/json',
            'Tagging': 'public=yes'
        }

        const result2 = await s3.upload(meta).promise();

        res.send({ msg: 'success' })
    } catch (err) {
        console.error(err);
        res.send({ msg: 'error' })
    }
})

router.post('/getSponsorList', async (req, res) => {
    try {
        const id = req.body.id;

        const [row, field] = await db.query(
            `SELECT * FROM project_sponse WHERE project_id=?`,
            [id]
        )

        res.send({ lists: row })
    } catch (err) {
        console.error(err);
        res.send({ msg: 'error' })
    }
})

module.exports = router;
