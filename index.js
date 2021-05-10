let app = require("express")();
let cors = require("cors")();
let Canvas = require("canvas");
let fs = require("fs");
let db = require("./db.json");

app.use(require("express").static(__dirname + "/public"));
app.use("/new", cors);
app.use(require("express").json());
app.use(require("express").urlencoded({
	extended: false
}));

app.get("/", async (req, res) => {
	res.send(`<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge"><meta name="ad4ad" content="A free advertising system where you can get your site advertised by advertising other sites using a small ad in the corner."><title>ad4ad</title><link rel="icon" type="image/png" href="https://aakhilv.me/assets/ad4ad.png"><meta name="theme-color" content="#ff3131"><meta name="author" content="ad4ad"><meta name="description" content="A free advertising system where you can get your site advertised by advertising other sites using a small ad in the corner."><style>@import url(https://fonts.googleapis.com/css?family=Inter:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i);*{box-sizing:border-box}body{font-family:Inter;margin:0;color:#ff3131}code{color:#fff;background:#ff3131;border-radius:5px;padding:2.5px}.code{color:#fff;background:#ff3131;border-radius:5px;padding:5px;display:inline-block;font-family:monospace}a{color:#ff3131;font-weight:700}</style><body style="display: flex; justify-content: center; align-items: center;"><div style="text-align: center;"><p>To set up <a href="https://ad4ad.com">ad4ad</a>, please follow the instructions below:</p><p><b>1.</b> Paste this meta tag between your website's <code>head</code> tags:</p><div class="code">&lt;meta name="ad4ad" content="Your advertisement's description goes here."&gt;</div><p><b>2.</b> Paste this script tag before your website's closing <code>body</code> tag:</p><div class="code">&lt;script src="https://ad4ad.com/config.js"&gt;&lt;/script&gt;</div><p><b>3.</b> Done! If you have any questions, contact us at <a href="mailto:support@ad4ad.com">support@ad4ad.com</a>.</p></div><script src="https://ad4ad.com/config.js"></script></body>`);
});

app.get("/new", cors, async (req, res) => {
	let keys = [];

	for (let k in db) {
		if (((Date.now() - db[k].t) / 2.592e+8) > 3) {
			delete db[k];
			fs.writeFile("./db.json", JSON.stringify(db), function(err) {
				if (err) throw err;
			});
		} else {
			keys.push(k);
		};
	};

	for (let t = keys.length - 1; t > 0; t--) {
		let j = Math.floor(Math.random() * t);
		let temp = keys[t];
		keys[t] = keys[j];
		keys[j] = temp;
	};

	let random = keys[Math.floor(Math.random() * keys.length)];

	let canvas = Canvas.createCanvas(600, 220);
	let ctx = canvas.getContext("2d");

	Canvas.registerFont("public/dFont.ttf", {
		family: "dFont"
	});
	Canvas.registerFont("public/hFont.ttf", {
		family: "hFont"
	});

	function getLines(text, maxWidth) {
		let words = text.split(" ");
		let lines = [];
		let currentLine = words[0];

		for (let i = 1; i < words.length; i++) {
			let word = words[i];
			let width = ctx.measureText(currentLine + " " + word).width;
			if (width < maxWidth) {
				currentLine += " " + word;
			} else {
				lines.push(currentLine);
				currentLine = word;
			};
		};
		lines.push(currentLine);
		return lines.join("\n");
	};

	try {
		ctx.fillStyle = "#dcdcdc";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.fillStyle = "#353839";

		ctx.font = "30px hFont";
		ctx.textAlign = "left";
		ctx.textBaseline = "hanging";
		ctx.fillText(random, 240 + 10, 10);

		ctx.font = "20px dFont";
		ctx.textAlign = "left";
		ctx.textBaseline = "hanging";
		ctx.fillText(getLines(db[random].d, 340), 240 + 10, 50);

		ctx.fillStyle = "#ff3131";
		ctx.fillRect(0, canvas.height - 40, canvas.width, 40);

		ctx.fillStyle = "#ffffff";
		ctx.font = "20px hFont";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText("ad4ad.com", canvas.width / 2, canvas.height - 20);

		let img = await Canvas.loadImage(`https://cdn.statically.io/screenshot/${random}`);
		ctx.drawImage(img, 0, 0, 240, 180);
	} catch {
		ctx.fillStyle = "#ff3131";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.fillStyle = "#ffffff";
		ctx.font = "100px hFont";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText("404", canvas.width / 2, canvas.height / 2);
	};

	res.json(JSON.parse(`{"url":"https://${random || "ad4ad.com"}","image":"${canvas.toDataURL()}"}`));
});

app.post("/new", cors, async (req, res) => {
	if (req.body.site) {
		db[req.body.site] = {
			d: req.body.description,
			t: Date.now()
		};

		fs.writeFile("./db.json", JSON.stringify(db), function(err) {
			if (err) throw err;
		});
	};
});

app.listen(3000);