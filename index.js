const puppeteer = require('puppeteer');
const fs  = require('fs');


(async () => {
    const browser = await puppeteer.launch({ headless: true, args:['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 926 });
    await page.setRequestInterception(true);

    page.on('request', (req) => {
        // if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image' || req.resourceType() == 'script'){
        //     req.abort();
        // }
        // else {
        //     req.continue();
        // }
       if(req.resourceType() == 'document'){
            req.continue();
        }
        else {
            req.abort();
        }
    });
    const max = 20;
    const ongs = [];
    for (let i=1;i<=max; i++){
        console.time("tempo");
        const pageUrl = `http://www.ongsbrasil.com.br/default.asp?Pag=2&CodigoInstituicao=${i}`;
        // console.log(pageUrl);

        await page.goto(pageUrl);
        await page.mainFrame().waitForSelector('body > div.container > div > div.col-md-8.col-sm-9.col-xs-12 > div:nth-child(2) > div:nth-child(1) > div > h1',{visible: true})
        // get ong details
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
                ongJson.fonteUrl = pageUrl;
            }
            catch (exception){
            }
            return ongJson;
        });
        ongs.push(ongData)
        // console.dir(ongData);
        console.timeEnd("tempo");
    }
        
    await fs.writeFile('ongsbrasil.json',JSON.stringify(ongs), function(err){
        if (err) throw err;
        console.log('fim');
    });
})();