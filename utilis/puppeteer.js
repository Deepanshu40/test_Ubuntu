const path = require('path');
const puppeteer = require('puppeteer'); 

module.exports.puppeteerSession = async () => {
    
    try {
        const browserInstance = await puppeteer.launch({
            headless:true,
            executablePath: path.join(__dirname, '..', '.cache', 'puppeteer', 'chrome-headless-shell', 'linux-124.0.6367.91', 'chrome-headless-shell-linux64', 'chrome-headless-shell'),
        });
        const page = await browserInstance.newPage();
            await page.goto('https://www.tdscpc.gov.in/app/ded/panverify.xhtml', { waitUntil: 'networkidle0' });
            const htmlContent = await page.content();
            const currentUrl = page.url();
            console.log("Current URL:", currentUrl);
            console.log("HTML content:", htmlContent);
        
    //         await page.waitForSelector('#userId');
    //         await page.type('#userId', 'HRDARCLTAN');
    //         await page.type('#psw', 'RAIN1234');
    //         await page.type('#tanpan', 'RTKD06754G' );

    //         console.log('reaching captcha starting stage');
    //         const captchaSolution = await handleCaptcha(page);
    //         await page.type('#captcha', captchaSolution);
    //         console.log(`entered captcha ${captchaSolution}`);
    //         await page.click('#clickLogin');
    //         console.log('clicked login button');
    //         await page.waitForNavigation({ waitUntil: 'networkidle0' });
    //         await page.waitForSelector('#pannumber');
    } catch(err) {
    console.log(err);
    }
}

async function handleCaptcha(page) {
    let captchaSolution = '';
    await page.waitForSelector('#captchaImg');
    console.log('waiting for captcha to appear');
    const captchaElement = await page.$('#captchaImg');
    const captchaImage = await captchaElement.screenshot({ encoding: 'base64' });
    console.log('taking captcha solution to e sent to 2captcha axios request');
    // Sending the CAPTCHA image to 2captcha for solving
    const apiKey = process.env.CAPTCHA_APIKEY;
    const formData = new URLSearchParams();
    formData.append('method', 'base64');
    formData.append('key', apiKey);
    formData.append('body', captchaImage);

    const response = await axios.post('http://2captcha.com/in.php', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    console.log('sent request successfully to 2captcha for processing');
    if (response.data.startsWith('OK|')) {
        const captchaId = response.data.split('|')[1];

    // Poll for the solution
        while (!captchaSolution) {
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
            const res = await axios.get(`http://2captcha.com/res.php?key=${apiKey}&action=get&id=${captchaId}`);
            const result = res.data;
            if (result.startsWith('OK|')) {
                captchaSolution = result.split('|')[1];
                break;
            }
    }
    console.log('received captcha solution from 2captcha server')
    return captchaSolution;
    
} else {
    // console.log('captcha solution could not be recived from server');
    throw new Error('Failed to submit CAPTCHA for solving: ' + response.data);
}}
