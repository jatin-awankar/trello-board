let USER_ID = 1;
let ORGANIZATION_ID = 1;
let BOARD_ID = 1;
let ISSUE_ID = 1;

const USERS = [
    {
        id: 1,
        username: "test1",
        password: "test@1234",
    },
]

const ORGANIZATIONS = [
    {
        id: 1,
        title: "Test",
        description: "This is test org",
        admin: 1,
        members: [2],
    },
]

const BOARDS = [
    {
        id: 1,
        title: "Test Board",
        organizationId: 1,
    }
]

const ISSUES = [
    {
        id: 1,
        title: "Add dark mode",
        boardId: 1,
        state: "IN_PROGRESS"
    },
]

const express = require("express");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("./middleware");

const app = express();

app.use(express.json())

app.listen(3000);

app.post("/signup", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = USERS.find(u => u.username === username)

    if(userExists) {
        res.status(411).json({
            message: "User with the username already exists!"
        })
        return;
    }

    USERS.push({
        id: USER_ID++,
        username: username,
        password: password,
    })

    res.json({
        message: "You have signedup successfully!"
    })
})

app.post("/signin", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = USERS.find(u => u.username === username && u.password === password)

    if(!userExists) {
        res.status(403).json({
            message: "Incorrect credentials!"
        })
        return;
    }

    const token = jwt.sign({
        userId: userExists.id,
    }, "trello_token");

    res.json({
        token
    })
})

app.post("/organization", authMiddleware, (req, res) => {
    const userId = req.userId;

    ORGANIZATIONS.push(
        {
            id: ORGANIZATION_ID++,
            title: req.body.title,
            description: req.body.description,
            admin: userId,
            members: [],
        },
    )

    res.json({
        message: "Org created!",
        id: ORGANIZATION_ID - 1,
    })
})

app.post("/add-member-to-org", authMiddleware, (req, res) => {
    const userId = req.userId;
    const organizationId = req.body.organizationId;
    const memberUserUsername = req.body.memberUserUsername;

    const organization = ORGANIZATIONS.find(o => o.id === organizationId)

    if(!organization || organization.admin !== userId) {
        res.status(411).json({
            message: "Org not found or you are not an admin",
        });
        return;
    }

    const memberUser = USERS.find(u => u.username === memberUserUsername);

    if(!memberUser) {
        res.status(411).json({
            message: "No user with the username exists in our DB"
        });
    }

    organization.members.push(memberUser.id);

    res.json({
        message: "New user added"
    });

})

app.post("/board", (req, res) => {
    
})

app.post("/issue", (req, res) => {
    
})

app.get("/organization", authMiddleware, (req, res) => {
    const userId = req.userId;
    const organizationId = parseInt(req.query.organizationId);

    const organization = ORGANIZATIONS.find(org => org.id === organizationId);

    if(!organization || organization.admin !== userId) {
        res.status(411).json({
            message: "Org not found or you are not an admin"
        });
        return;
    }
})

app.get("/boards", (req, res) => {
    
})

app.get("/issues", (req, res) => {
    
})

app.get("/members", (req, res) => {
    
})

app.put("/issues", (req, res) => {
    
})

app.delete("/members", authMiddleware, (req, res) => {
    const userId = req.userId;
    const organizationId = req.body.organizationId;
    const memberUserUsername = req.body.memberUserUsername;

    const organization = ORGANIZATIONS.find(o => o.id === organizationId)

    if(!organization || organization.admin !== userId) {
        res.status(411).json({
            message: "Org not found or you are not an admin",
        });
        return;
    }

    const memberUser = USERS.find(u => u.username === memberUserUsername);

    if(!memberUser) {
        res.status(411).json({
            message: "No user with the username exists in our DB"
        });
    }

    organization.members = organization.members.filter(mem => mem.id !== memberUser.id);

    res.json({
        message: "Member removed"
    });
})
