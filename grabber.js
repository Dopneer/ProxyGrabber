// Music helps everytime!

const puppeteer = require('puppeteer');
const fs = require('fs');
fs.writeFileSync("proxies.txt", "");
// File to save proxies
var fileContent = fs.readFileSync("proxies.txt", "utf8");

var browser;
var page;

var Table = [];
var Elements = [];
var TableLength;
var proxy;
var tmpElement;

// Count of proxy which need to parse
var NeedToParse = 100;
var TotalProxyCount = null;

// Site which need to parse (grab proxies)
var ProxyURL = "https://free.proxy-sale.com";

// Grabbed proxy
var proxies = [];

// Main cicle

(async () =>
{

try
{

	browser = await puppeteer.launch();
	page = await browser.newPage();

	await page.goto("https://free.proxy-sale.com/");

	// Total proxy count on sitew
	TotalProxyCount = await page.$('.fps-sort-counter');

	// Wait loading and make screenshot
	while(TotalProxyCount == null)
	{
		TotalProxyCount = await page.$('.fps-sort-counter');
		await page.waitFor(1000);
	}

	await page.screenshot({path: "onload.png" });

	Elements = await page.$$eval(".copy-buffer", el => el.map(x => x.getAttribute("data-clipboard-text")));

	await console.log("Need to parse: " + NeedToParse);


	// Page load cycle
	
	for(var i = 1; i < NeedToParse; i++)
	{
		TotalProxyCount = null;
		await page.goto("https://free.proxy-sale.com/?proxy_page=" + i);
		await console.log("Page number: " + i);
		// Wait loading and make screenshot
		while(TotalProxyCount == null)
		{
			TotalProxyCount = await page.$('.fps-sort-counter');
			await page.waitFor(1000);
		}

		// Proxy parse cycle

		Elements = await page.$$eval(".copy-buffer", el => el.map(x => x.getAttribute("data-clipboard-text")));

		for (var j = 0; j < Elements.length; j++)
		{
			Elements[j] = Elements[j].replace(/^\s+/, '').replace(/\s+$/, '');
			await console.log(Elements[j]);
			await fs.appendFileSync("proxies.txt", Elements[j] + "\n");
		}

	} 


	await browser.close();

}
catch(error)
{
	await console.log("======================");
	await console.log("======================");
	await console.log("\n" + error);

	browser.close();
}


})();