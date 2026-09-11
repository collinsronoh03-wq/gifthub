const http = require("http");
const fs = require("fs");
const path = require("path");
const claimsFile = path.join(__dirname, "claims.json");
const PORT =process.env.PORT || 3000;

const server = http.createServer((req, res) => {

    // Send the website
    if (req.url === "/" && req.method === "GET") {

        const filePath = path.join(__dirname, "index.html");

        fs.readFile(filePath, (err, data) => {

            if (err) {
                res.writeHead(500, {
                    "Content-Type": "text/plain"
                });

                res.end("Error loading website.");
                return;
            }

            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            res.end(data);
        });

        return;
    }
// Send the admin page
if (req.url === "/admin" && req.method === "GET") {

    const filePath = path.join(__dirname, "admin.html");

    fs.readFile(filePath, (err, data) => {

        if (err) {
            res.writeHead(500, {
                "Content-Type": "text/plain"
            });

            res.end("Error loading admin page.");
            return;
        }

        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        res.end(data);
    });

    return;
}

    // Receive a reward claim
    if (req.url === "/claim" && req.method === "POST") {

        let body = "";

        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {

            try {
                const claim = JSON.parse(body);

                console.log("Reward claim received:");
                console.log("Reward:", claim.reward);
                console.log("Name:", claim.name);
                console.log("phone:",claim.phone);
                // Save the claim
let claims = [];

if (fs.existsSync(claimsFile)) {
    try {
        claims = JSON.parse(fs.readFileSync(claimsFile, "utf8"));
    } catch (error) {
        claims = [];
    }
}

claims.push({
    reward: claim.reward,
    name: claim.name,
    phone: claim.phone,
    date: new Date().toISOString()
});

fs.writeFileSync(
    claimsFile,
    JSON.stringify(claims, null, 2)
);
                res.writeHead(200, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    success: true,
                    message: "Reward request received successfully."
                }));

            } catch (error) {

                res.writeHead(400, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    success: false,
                    message: "Invalid request."
                }));
            }
        });

        return;
    }
// Send saved claims to the admin page
if (req.url === "/claims" && req.method === "GET") {

    if (!fs.existsSync(claimsFile)) {
        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify([]));
        return;
    }

    try {
        const claims = JSON.parse(
            fs.readFileSync(claimsFile, "utf8")
        );

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify(claims));

    } catch (error) {

        res.writeHead(500, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            message: "Unable to read claims."
        }));
    }

    return;
}

    // Page not found
    res.writeHead(404, {
        "Content-Type": "text/plain"
    });

    res.end("Page not found.");
});


server.listen(PORT, () => {
    console.log(`GiftHub server running at http://localhost:${PORT}`);
});
