const puppeteer = require('puppeteer');
const { Cluster } = require('puppeteer-cluster');
const fs = require('fs');


(async () => {
    console.time("tempo");
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        hea
        maxConcurrency: 64,
    });

    const max = 21337;
    const ongs = [];
    // task
    await cluster.task(async ({ page, data: url }) => {
        console.log(url);
        // const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
        await page.setViewport({ width: 1920, height: 926 });
        await page.setRequestInterception(true);

        page.on('request', (req) => {
            if (req.resourceType() === 'document') {
                req.continue();
            }
            else {
                req.abort();
            }
        });

        await page.goto(url);
        await page.mainFrame().waitForSelector('body > div.container > div > div.col-md-8.col-sm-9.col-xs-12 > div:nth-child(2) > div:nth-child(1) > div > h1', { visible: true })
        let ongData = await page.evaluate(() => {
            let ongJson = {};
            try {
                ongJson.name = document.querySelector('body > div.container > div > div.col-md-8.col-sm-9.col-xs-12 > div:nth-child(2) > div:nth-child(1) > div > h1').innerText;
                ongJson.endereco = document.querySelector('body > div.container > div > div.col-md-8.col-sm-9.col-xs-12 > div:nth-child(2) > div:nth-child(4) > div > table > tbody > tr:nth-child(1) > td:nth-child(2) > span').innerText;
                ongJson.bairro = document.querySelector('body > div.container > div > div.col-md-8.col-sm-9.col-xs-12 > div:nth-child(2) > div:nth-child(4) > div > table > tbody > tr:nth-child(2) > td:nth-child(2) > span').innerText;
                ongJson.cep = document.querySelector('body > div.container > div > div.col-md-8.col-sm-9.col-xs-12 > div:nth-child(2) > div:nth-child(4) > div > table > tbody > tr:nth-child(3) > td:nth-child(2) > span').innerText;
                ongJson.cidade = document.querySelector('body > div.container > div > div.col-md-8.col-sm-9.col-xs-12 > div:nth-child(2) > div:nth-child(4) > div > table > tbody > tr:nth-child(4) > td:nth-child(2) > span').innerText;
                ongJson.estado = document.querySelector('body > div.container > div > div.col-md-8.col-sm-9.col-xs-12 > div:nth-child(2) > div:nth-child(4) > div > table > tbody > tr:nth-child(5) > td:nth-child(2) > span').innerText;
                ongJson.pais = document.querySelector('body > div.container > div > div.col-md-8.col-sm-9.col-xs-12 > div:nth-child(2) > div:nth-child(4) > div > table > tbody > tr:nth-child(6) > td:nth-child(2) > span').innerText;
                ongJson.telefone = document.querySelector('body > div.container > div > div.col-md-8.col-sm-9.col-xs-12 > div:nth-child(2) > div:nth-child(4) > div > table > tbody > tr:nth-child(7) > td:nth-child(2) > span').innerText;
                ongJson.nome_fantasia = document.querySelector('body > div.container > div > div.col-md-8.col-sm-9.col-xs-12 > div:nth-child(2) > div:nth-child(4) > div > table > tbody > tr:nth-child(8) > td:nth-child(2) > span').innerText;
                ongJson.email = document.querySelector('body > div.container > div > div.col-md-8.col-sm-9.col-xs-12 > div:nth-child(2) > div:nth-child(4) > div > table > tbody > tr:nth-child(9) > td:nth-child(2) > input[type="text"]').value;
                ongJson.site = document.querySelector('body > div.container > div > div.col-md-8.col-sm-9.col-xs-12 > div:nth-child(2) > div:nth-child(4) > div > table > tbody > tr:nth-child(10) > td:nth-child(2) > input[type="text"]').value;
                ongJson.cnpj = document.querySelector('body > div.container > div > div.col-md-8.col-sm-9.col-xs-12 > div:nth-child(2) > div:nth-child(4) > div > table > tbody > tr:nth-child(11) > td:nth-child(2) > span').innerText;
                ongJson.fonteUrl = url;
            }
            catch (exception) {
            }
            return ongJson;
        });
        ongs.push(ongData)
    });

    for (let i = 1; i <= max; i++) {
        cluster.queue(`http://www.ongsbrasil.com.br/default.asp?Pag=2&CodigoInstituicao=${i}`);
    }

    await cluster.idle();
    await cluster.close();
    // many more pages
    await fs.writeFile('ongsbrasil.json', JSON.stringify(ongs), function (err) {
        if (err) throw err;
        console.log('Arquivo ongsbrasil.json gerado com sucesso!');
    });
    console.timeEnd("tempo");
})();