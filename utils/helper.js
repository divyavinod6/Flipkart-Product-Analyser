const puppeteer = require('puppeteer');
const bConfig = require('../config/browserConfig');
// const Helper = require('../utils/helper');
const config = require('../config/config');
const UserAgent = require('../UserAgents.json');
const Res = require('../Res.json');

class Helper {
  static getResolution = async () => {
    let randomResVal = await this.getRandomInt(0, Res.length);
    let resolution = Res[randomResVal];
    return resolution;
  };
  static getuseragent = async () => {
    let randomuserAgentVal = await this.getRandomInt(0, UserAgent.length);
    let useragent = UserAgent[randomuserAgentVal];
    return useragent;
  };
  static createpage = async () => {
    let loopcondition = true;
    let executablePath = bConfig.executablePath;

    let browser = await Helper.getProfiledBrowser(executablePath); // calling getProfiledBrowser
    let page = await browser.newPage();

    let userAgentVal = await this.getuseragent(); // calling getuseragent
    console.log('userAgentVal', userAgentVal);
    await page.setUserAgent(userAgentVal);

    let ResVal = await this.getResolution(); // calling getResolution
    console.log('ResVal', ResVal);
    await page.setViewport(ResVal);

    let tabs = await browser.pages();
    if (tabs.length > 1) {
      tabs[0].close();
    }
    return [page, browser];
  };
  static openurl = async (page, url) => {
    try {
      await page.goto(url, {
        waitUntil: 'networkidle2',
      });
      // await page.waitForNavigation()
      await page.waitForTimeout(5000);
    } catch (error) {
      console.log('open url: ', error);
    }
    return page;
  };

  static getFormatedDate = () => {
    let todayDate = new Date().toISOString().slice(0, 10);
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    let lastIso = yesterday.toISOString().slice(0, 10);

    let today = todayDate.replace(/-/g, '/');
    let yestday = lastIso.replace(/-/g, '/');
    return {
      today: today,
      yesterday: yestday,
    };
  };

  static getFormatedDate2 = () => {
    let todayDate = new Date().toISOString().slice(0, 10);
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    let lastIso = yesterday.toISOString().slice(0, 10);

    let today = todayDate.replace(/-/g, '');
    let yestday = lastIso.replace(/-/g, '');
    return {
      today: today,
      yesterday: yestday,
    };
  };

  static getDate = (date) => {
    date = date.replace('T', ' ');
    if (date.includes('CEST')) {
      date = date.replace('CEST', '');
    }
    if (date.includes('Z')) {
      date = date.replace('Z', '');
    }
    if (date.includes('+')) {
      date = date.split('+')[0];
    }
    return date;
  };

  static getUrlCategory = (url) => {
    let split = url.split('/');

    if (url.includes('elperiodico.com')) {
      //return `/${split[4]}/`
      return split[4].replace(/-/g, ' ');
    } else {
      //return `/${split[3]}/`
      return split[3].replace(/-/g, ' ');
    }
  };

  static getProfiledBrowser = async (executabePath) => {
    let options = {
      headless: bConfig.headless,
      timeout: 15000,
      ignoreHTTPSErrors: true,
      executablePath: executabePath,
      args: [
        '--no-sandbox',
        '--start-maximized',
        '--disable-infobars',
        '--disable-popup-blocking',
        '--disable-dev-shm-usage',
        '--disable-notifications',
        '--remote-debugging-port=9222',
        '--disable-web-security',
        //`--user-data-dir=${userDataDir}`
      ],
      ignoreDefaultArgs: ['--enable-automation'],
      //defaultViewport: null,
      // userAgent: "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36"
    };
    const browser = await puppeteer.launch(options);

    return browser;
  };

  static async getData(page, url, config) {
    let configData = config;
    let data = await page.evaluate(
      (configData, url) => {
        let product_name;
        let description;
        let author;
        let pubDate;
        let body;
        let img;
        let currurl;
        let category;
        let pubId;

        try {
          product_name = document.querySelector(
            configData.product_name
          ).innerHTML;
          console.log('product name:', product_name);
        } catch (e) {
          console.log('Product not found');
        }

        try {
          description = document.querySelector(
            configData.description
          ).textContent;
          console.log('description:', description);
        } catch (e) {
          console.log('description not found');
        }
        /*
            try {
                if (configData.domain == 'www.lavozdegalicia.es' || configData.domain == 'www.lavanguardia.com' || configData.domain == 'www.mundodeportivo.com') {
                    author = document.querySelector(configData.author).innerText;
                } else {
                    author = document.querySelector(configData.author).content;
                }
            } catch (e) {
                console.log("author not found");
            }

            try {
                pubDate = document.querySelector(configData.pubDate).content;
                let date = pubDate.replace('T', " ")
                if (date.includes("CEST")) {
                    date = date.replace("CEST", "")
                }
                if (date.includes("Z")) {
                    date = date.replace("Z", "")
                }
                if (date.includes("+")) {
                    date = date.split("+")[0]
                }
                pubDate = date;
            } catch (e) {
                console.log("PubDate not found")
            }

            try {
                body = document.querySelector(configData.body).outerHTML;
            } catch (e) {
                console.log("body not found")
            }

            try {
                img = document.querySelector(configData.img).content;
            } catch (e) {
                console.log("img not found")
            }

            try {
                currurl = url;
            } catch (e) {
                console.log("Url not found")
            }

            try {
                category = document.querySelector(configData.category).content;
            } catch (e) {
                console.log("Category not found")
            }
            console.log('Brfore premium check')
            if (configData.domain == 'www.lavozdegalicia.es') {
                let premium = window.find(configData.premium);
                console.log(premium)
                if (premium === false) {
                    pubId = configData.digitalPublicationId
                } else {
                    pubId = configData.paywallPublicationId;
                }
            }else if (configData.domain == 'www.mundodeportivo.com') {
                console.log('Inside  premium check mundodeportivo.com')
                let premium = document.querySelector(configData.premium).content;
                console.log(premium)
                if (premium === 'locked') {          
                    pubId = configData.paywallPublicationId;
                } else {
                    pubId = configData.digitalPublicationId;
                }
            }else if (configData.domain == 'www.lavanguardia.com') {
                console.log('Inside  premium check for lavanguardia.com')
                let premium = document.querySelector(configData.premium).content;
                console.log(premium)
                if (premium === 'locked' && url.includes('.lavanguardia.com/encatala/')) {     
                    //pubId = 7614;     
                    pubId = configData.paywallPublicationId[1];
                }else if (premium === 'locked' && !url.includes('.lavanguardia.com/encatala/')) {     
                    //pubId = 7611;     
                    pubId = configData.paywallPublicationId[0];
                } else {
                    if(url.includes('.lavanguardia.com/encatala/')){
                        //7615
                        pubId = configData.digitalPublicationId[1];
                    }else{
                        //7610
                        pubId = configData.digitalPublicationId[0];
                    }
                    
                }
            }
             else {
                let premium = document.querySelector(configData.premium)
                if (premium === null) {
                    pubId = configData.digitalPublicationId
                } else {
                    pubId = configData.paywallPublicationId;
                }
            }
            */
        let obj = {
          product_name: product_name,
          description: description,
          // pubId: pubId,
          // category: category,
          // url: currurl,
          // author: author,
          // pubDate: pubDate,
          // body: body,
          // image: img,
        };

        return obj;
      },
      configData,
      url
    );
    console.log(product_name);
    console.log(description);
    return data;
  }

  static async verifyLogin(page, config) {
    let configData = config;
    console.log('verify login: ', config.domain);
    if (config.domain == 'www.lavozdegalicia.es') {
      const found = await page.evaluate(() => window.find('Mi cuenta'));
      if (found) {
        console.log('User Already logged in');
        return true;
      } else {
        console.log('User not logged In on https://www.lavozdegalicia.es/');
        console.log('Attempting to login to user account..');
        try {
          //let url = configData.loginUrl;
          // await page.screenshot({
          //     path : "./screenshot.jpg",
          //     fullPage : true
          // });
          try {
            let data = await page.evaluate((configData) => {
              let flag = document.querySelector(configData.loginUrl).click();
            }, configData);
          } catch (e) {}
          await page.waitForTimeout(3000);
          // await page.screenshot({
          //     path : "./screenshot0.jpg",
          //     fullPage : true
          // });
          await page.type('input[name=email]', configData.login.email, {
            delay: 10,
          });
          // await page.screenshot({
          //     path : "./screenshot1.jpg",
          //     fullPage : true
          // });
          await page.type('input[name=password]', configData.login.password, {
            delay: 10,
          });
          // await page.screenshot({
          //     path : "./screenshot2.jpg",
          //     fullPage : true
          // });
          await page.keyboard.press('Enter');

          console.log('Login Success');
          await page.waitForTimeout(5000);
          // await page.screenshot({
          //     path : "./screenshot3.jpg",
          //     fullPage : true
          // });
          /*
                    await page.screenshot({
                        path : "./screenshot.jpg",
                        fullPage : true
                    });
                    */
          return true;
        } catch (e) {
          console.log('Login Failed');
          console.log('Error in Login');
          console.log('MAINTAIN LOGIN :', e);
          return false;
        }
      }
    }
    if (config.domain == 'www.farodevigo.es') {
      await page.waitForSelector(configData.loginWaitFor);
      let data = await page.evaluate((configData) => {
        let flag = document.querySelector(configData.loginFlag);
        if (flag != null || flag != undefined) {
          return true;
        } else {
          return false;
        }
      }, configData);
      if (data) {
        console.log('User Already logged in');
        return true;
      } else {
        try {
          console.log(
            'User not logged In On https://micuenta.farodevigo.es/tp/login'
          );
          console.log('Attempting to login to user account..');
          let url = configData.loginUrl;
          try {
            await page.goto(url, {
              waitUntil: 'networkidle2',
            });
          } catch (e) {}
          await page.keyboard.type(configData.login.email, { delay: 10 });
          await page.waitForTimeout(500);
          await page.keyboard.down('Tab');
          await page.keyboard.type(configData.login.password, { delay: 10 });
          await page.waitForTimeout(500);
          await page.keyboard.press('Enter');
          await page.waitForTimeout(5000);
          console.log('login success');

          /*
                    await page.keyboard.type(configData.login.email, { delay: 10 });
                    await page.screenshot({
                        path : "./screenshot.jpg",
                        fullPage : true
                    });
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.keyboard.type(configData.login.password, { delay: 10 });
                    await page.screenshot({
                        path : "./screenshot1.jpg",
                        fullPage : true
                    });
                    await page.waitForTimeout(500);
                    await page.keyboard.press("Enter");
                    await page.screenshot({
                        path : "./screenshot2.jpg",
                        fullPage : true
                    });
                    console.log("login success");
                    await page.waitForTimeout(5000);
                    await page.screenshot({
                        path : "./screenshot3.jpg",
                        fullPage : true
                    });
                    */

          return true;
        } catch (e) {
          console.log('login failed');
          console.log('Error in Login');
          console.log('MAINTAIN LOGIN :', e);
          return false;
        }
      }
    }

    if (config.domain == 'www.sport.es') {
      await page.waitForSelector(configData.loginWaitFor);
      let data = await page.evaluate((configData) => {
        let flag = document.querySelector(configData.loginFlag).textContent;
        if (flag == 'JH') {
          return true;
        } else {
          return false;
        }
      }, configData);

      console.log('flag: ', data);

      if (data) {
        console.log('User Already logged in');
        return true;
      } else {
        try {
          console.log('User not logged In On ');
          console.log('Attempting to login to user account..');
          let url = configData.loginUrl;
          try {
            let data = await page.evaluate((configData) => {
              let flag = document.querySelector(configData.loginUrl).click();
            }, configData);
          } catch (e) {}

          await page.waitForTimeout(5000);
          await page.keyboard.type(configData.login.email, { delay: 10 });
          await page.waitForTimeout(500);
          await page.keyboard.down('Tab');
          await page.keyboard.type(configData.login.password, { delay: 10 });
          await page.waitForTimeout(500);
          await page.keyboard.press('Enter');
          await page.waitForTimeout(5000);
          console.log('login success');
          return true;
        } catch (e) {
          console.log('login failed');
          console.log('Error in Login');
          console.log('MAINTAIN LOGIN :', e);
          return false;
        }
      }
    }
    if (config.domain == 'www.elperiodico.com') {
      await page.waitForSelector(configData.loginWaitFor);
      let data = await page.evaluate((configData) => {
        let flag;
        try {
          flag = document.querySelector(configData.loginFlag).textContent;
        } catch (e) {}

        if (flag == 'Juan Antonio') {
          return true;
        } else {
          return false;
        }
      }, configData);

      console.log('flag: ', data);

      if (data) {
        console.log('User Already logged in');
        return true;
      } else {
        try {
          console.log('User not logged In On ');
          console.log('Attempting to login to user account..');

          try {
            console.log('before click');
            let data = await page.evaluate((configData) => {
              let flag = document.querySelector(configData.loginUrl).click();
            }, configData);
          } catch (err) {
            console.log('e: ', err);
          }
          console.log('after click');

          await page.waitForTimeout(5000);
          await page.keyboard.type(configData.login.email, { delay: 10 });
          await page.waitForTimeout(500);
          await page.keyboard.down('Tab');
          await page.keyboard.type(configData.login.password, { delay: 10 });
          await page.waitForTimeout(500);
          await page.keyboard.press('Enter');
          await page.waitForTimeout(5000);
          console.log('login success');

          return true;
        } catch (e) {
          console.log('login failed');
          console.log('Error in Login');
          console.log('MAINTAIN LOGIN :', e);
          return false;
        }
      }
    }

    if (config.domain == 'www.lne.es') {
      await page.waitForSelector(configData.loginWaitFor);
      let data = await page.evaluate((configData) => {
        let flag = document.querySelector(configData.loginFlag);
        console.log('Flag: ', flag);
        if (flag != null || flag != undefined) {
          return true;
        } else {
          return false;
        }
      }, configData);
      if (data) {
        console.log('User Already logged in');
        return true;
      } else {
        console.log('User not logged In on https://micuenta.lne.es/tp/login');
        console.log('Attempting to login to user account..');
        try {
          let url = configData.loginUrl;
          try {
            await page.goto(url, {
              waitUntil: 'networkidle2',
            });
          } catch (e) {}
          await page.keyboard.type(configData.login.email, { delay: 10 });
          await page.waitForTimeout(500);
          await page.keyboard.down('Tab');
          await page.keyboard.type(configData.login.password, { delay: 10 });
          await page.waitForTimeout(500);
          await page.keyboard.press('Enter');
          await page.waitForTimeout(5000);
          console.log('login success');
          /*
                    await page.keyboard.type(configData.login.email, { delay: 10 });
                    await page.screenshot({
                        path : "./screenshot.jpg",
                        fullPage : true
                    });
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.keyboard.type(configData.login.password, { delay: 10 });
                    await page.screenshot({
                        path : "./screenshot1.jpg",
                        fullPage : true
                    });
                    await page.waitForTimeout(500);
                    await page.keyboard.press("Enter");
                    await page.screenshot({
                        path : "./screenshot2.jpg",
                        fullPage : true
                    });
                    await page.waitForTimeout(3000);
                    await page.screenshot({
                        path : "./screenshot3.jpg",
                        fullPage : true
                    });
                    */
          /*
                    await page.keyboard.type(configData.login.email, { delay: 10 });
                    await page.screenshot({
                        path : "./screenshot.jpg",
                        fullPage : true
                    });
                    await page.waitForTimeout(3000);
                    await page.keyboard.down('Tab')
                    await page.keyboard.type(configData.login.email, { delay: 10 });
                    await page.screenshot({
                        path : "./screenshot1.jpg",
                        fullPage : true
                    });
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.keyboard.type(configData.login.email, { delay: 10 });
                    await page.screenshot({
                        path : "./screenshot2.jpg",
                        fullPage : true
                    });
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.keyboard.type(configData.login.email, { delay: 10 });
                    await page.screenshot({
                        path : "./screenshot3.jpg",
                        fullPage : true
                    });
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.keyboard.type(configData.login.email, { delay: 10 });
                    await page.screenshot({
                        path : "./screenshot4.jpg",
                        fullPage : true
                    });
                    await page.waitForTimeout(500);                   
                    await page.keyboard.down('Tab')
                    await page.keyboard.type(configData.login.email, { delay: 10 });
                    await page.screenshot({
                        path : "./screenshot5.jpg",
                        fullPage : true
                    });
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.keyboard.type(configData.login.email, { delay: 10 });
                    await page.screenshot({
                        path : "./screenshot6.jpg",
                        fullPage : true
                    });
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.keyboard.type(configData.login.email, { delay: 10 });
                    await page.screenshot({
                        path : "./screenshot7.jpg",
                        fullPage : true
                    });
                    await page.waitForTimeout(500);
                    */
          /*
                    await page.waitForTimeout(3000);
                    await page.keyboard.down('Tab')
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.waitForTimeout(500);

                    await page.keyboard.type(configData.login.email, { delay: 10 });
                    await page.keyboard.down('Tab');
                    await page.waitForTimeout(500);
                    await page.keyboard.type(configData.login.password, { delay: 10 });
                    
                    await page.keyboard.press("Enter");
                    */
          //await page.waitForNavigation(10000);
          // await page.goto(currentUrl, {
          //     waitUntil: 'networkidle2',
          // })
          console.log('Login Success');
          await page.waitForTimeout(5000);
          return true;
        } catch (e) {
          console.log('login Failed');
          console.log('Error in Login');
          console.log('MAINTAIN LOGIN :', e);
          return false;
        }
      }
    }

    if (config.domain == 'www.laprovincia.es') {
      await page.waitForSelector(configData.loginWaitFor);
      let data = await page.evaluate((configData) => {
        let flag = document.querySelector(configData.loginFlag);
        console.log('Flag: ', flag);
        if (flag != null || flag != undefined) {
          return true;
        } else {
          return false;
        }
      }, configData);
      if (data) {
        console.log('User Already logged in');
        return true;
      } else {
        console.log('User not logged In');
        console.log('Attempting to login to user account..');
        try {
          let url = configData.loginUrl;
          try {
            await page.goto(url, {
              waitUntil: 'networkidle2',
            });
          } catch (e) {}
          await page.keyboard.type(configData.login.email, { delay: 10 });
          await page.waitForTimeout(500);
          await page.keyboard.down('Tab');
          await page.keyboard.type(configData.login.password, { delay: 10 });
          await page.waitForTimeout(500);
          await page.keyboard.press('Enter');
          await page.waitForTimeout(5000);
          console.log('login success');
          /*
                    await page.keyboard.type(configData.login.email, { delay: 10 });
                    await page.screenshot({
                        path : "./screenshot.jpg",
                        fullPage : true
                    });
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.keyboard.type(configData.login.password, { delay: 10 });
                    await page.screenshot({
                        path : "./screenshot1.jpg",
                        fullPage : true
                    });
                    await page.waitForTimeout(500);
                    await page.keyboard.press("Enter");
                    await page.screenshot({
                        path : "./screenshot2.jpg",
                        fullPage : true
                    });
                    console.log("login success");
                    await page.waitForTimeout(5000);
                    await page.screenshot({
                        path : "./screenshot3.jpg",
                        fullPage : true
                    });
                    */
          /*
                    await page.waitForTimeout(3000);
                    await page.keyboard.down('Tab')
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.waitForTimeout(500);
                    await page.keyboard.type(configData.login.email, { delay: 10 });
                    await page.keyboard.down('Tab');
                    await page.waitForTimeout(500);
                    await page.keyboard.type(configData.login.password, { delay: 10 });
                    await page.keyboard.press("Enter");
                    console.log("Login Success");
                    await page.waitForTimeout(5000);
                    */
          return true;
        } catch (e) {
          console.log('login Failed');
          console.log('Error in Login');
          console.log('MAINTAIN LOGIN :', e);
          return false;
        }
      }
    }
    if (config.domain == 'www.diaridegirona.cat') {
      await page.waitForSelector(configData.loginWaitFor);
      let data = await page.evaluate((configData) => {
        let flag = document.querySelector(configData.loginFlag);
        console.log('Flag: ', flag);
        if (flag != null || flag != undefined) {
          return true;
        } else {
          return false;
        }
      }, configData);
      if (data) {
        console.log('User Already logged in');
        return true;
      } else {
        console.log('User not logged In');
        console.log('Attempting to login to user account..');
        try {
          let url = configData.loginUrl;
          try {
            await page.goto(url, {
              waitUntil: 'networkidle2',
            });
          } catch (e) {}
          await page.keyboard.type(configData.login.email, { delay: 10 });
          await page.waitForTimeout(500);
          await page.keyboard.down('Tab');
          await page.keyboard.type(configData.login.password, { delay: 10 });
          await page.waitForTimeout(500);
          await page.keyboard.press('Enter');
          await page.waitForTimeout(5000);
          console.log('login success');
          /*
                    await page.keyboard.type(configData.login.email, { delay: 10 });
                    await page.screenshot({
                        path : "./screenshot.jpg",
                        fullPage : true
                    });
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.keyboard.type(configData.login.password, { delay: 10 });
                    await page.screenshot({
                        path : "./screenshot1.jpg",
                        fullPage : true
                    });
                    await page.waitForTimeout(500);
                    await page.keyboard.press("Enter");
                    await page.screenshot({
                        path : "./screenshot2.jpg",
                        fullPage : true
                    });
                    console.log("login success");
                    await page.waitForTimeout(5000);
                    await page.screenshot({
                        path : "./screenshot3.jpg",
                        fullPage : true
                    });
                    */
          /*
                    await page.waitForTimeout(3000);
                    await page.keyboard.down('Tab')
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.waitForTimeout(500);

                    await page.keyboard.type(configData.login.email, { delay: 10 });
                    await page.keyboard.down('Tab');
                    await page.waitForTimeout(500);
                    await page.keyboard.type(configData.login.password, { delay: 10 });
                    await page.keyboard.press("Enter");
                    console.log("Login Success");
                    await page.waitForTimeout(5000);
                    */
          return true;
        } catch (e) {
          console.log('login Failed');
          console.log('Error in Login');
          console.log('MAINTAIN LOGIN :', e);
          return false;
        }
      }
    }
    if (
      config.domain == 'www.levante-emv.com' ||
      config.domain == 'www.informacion.es' ||
      config.domain == 'www.diariocordoba.com' ||
      config.domain == 'www.diariodeibiza.es' ||
      config.domain == 'www.diariodemallorca.es' ||
      config.domain == 'www.elperiodicodearagon.com' ||
      config.domain == 'www.elperiodicoextremadura.com' ||
      config.domain == 'lacronicadebadajoz.elperiodicoextremadura.com' ||
      config.domain == 'www.laopiniondemalaga.es' ||
      config.domain == 'www.elperiodicomediterraneo.com' ||
      config.domain == 'www.regio7.cat' ||
      config.domain == 'www.superdeporte.es'
    ) {
      await page.waitForSelector(configData.loginWaitFor);
      let data = await page.evaluate((configData) => {
        let flag = document.querySelector(configData.loginFlag);
        console.log('Flag: ', flag);
        if (flag != null || flag != undefined) {
          return true;
        } else {
          return false;
        }
      }, configData);
      if (data) {
        console.log('User Already logged in');
        return true;
      } else {
        console.log('User not logged In on');
        console.log('Attempting to login to user account..');
        try {
          let url = configData.loginUrl;
          try {
            await page.goto(url, {
              waitUntil: 'networkidle2',
            });
          } catch (e) {}
          await page.keyboard.type(configData.login.email, { delay: 10 });
          await page.waitForTimeout(500);
          await page.keyboard.down('Tab');
          await page.keyboard.type(configData.login.password, { delay: 10 });
          await page.waitForTimeout(500);
          await page.keyboard.press('Enter');
          await page.waitForTimeout(5000);
          console.log('login success');
          /*
                    await page.keyboard.type(configData.login.email, { delay: 10 });
                    await page.screenshot({
                        path : "./screenshot.jpg",
                        fullPage : true
                    });
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.keyboard.type(configData.login.password, { delay: 10 });
                    await page.screenshot({
                        path : "./screenshot1.jpg",
                        fullPage : true
                    });
                    await page.waitForTimeout(500);
                    await page.keyboard.press("Enter");
                    await page.screenshot({
                        path : "./screenshot2.jpg",
                        fullPage : true
                    });
                    console.log("login success");
                    await page.waitForTimeout(5000);
                    await page.screenshot({
                        path : "./screenshot3.jpg",
                        fullPage : true
                    });
                    */
          /*
                    await page.waitForTimeout(3000);
                    await page.keyboard.down('Tab')
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.waitForTimeout(500);
                    await page.keyboard.type(configData.login.email, { delay: 10 });
                    await page.keyboard.down('Tab');
                    await page.waitForTimeout(500);
                    await page.keyboard.type(configData.login.password, { delay: 10 });
                    await page.keyboard.press("Enter");
                    console.log("Login Success");
                    await page.waitForTimeout(5000);
                    */
          return true;
        } catch (e) {
          console.log('login Failed');
          console.log('Error in Login');
          console.log('MAINTAIN LOGIN :', e);
          return false;
        }
      }
    }
    //5 tab
    if (config.domain == 'www.laopiniondemurcia.es') {
      await page.waitForSelector(configData.loginWaitFor);
      let data = await page.evaluate((configData) => {
        let flag = document.querySelector(configData.loginFlag);
        console.log('Flag: ', flag);
        if (flag != null || flag != undefined) {
          return true;
        } else {
          return false;
        }
      }, configData);
      if (data) {
        console.log('User Already logged in');
        return true;
      } else {
        console.log('User not logged In');
        console.log('Attempting to login to user account..');
        try {
          let url = configData.loginUrl;
          try {
            await page.goto(url, {
              waitUntil: 'networkidle2',
            });
          } catch (e) {}
          await page.keyboard.type(configData.login.email, { delay: 10 });
          await page.waitForTimeout(500);
          await page.keyboard.down('Tab');
          await page.keyboard.type(configData.login.password, { delay: 10 });
          await page.waitForTimeout(500);
          await page.keyboard.press('Enter');
          await page.waitForTimeout(5000);
          console.log('login success');
          /*
                    await page.keyboard.type(configData.login.email, { delay: 10 });
                    await page.screenshot({
                        path : "./screenshot.jpg",
                        fullPage : true
                    });
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.keyboard.type(configData.login.password, { delay: 10 });
                    await page.screenshot({
                        path : "./screenshot1.jpg",
                        fullPage : true
                    });
                    await page.waitForTimeout(500);
                    await page.keyboard.press("Enter");
                    await page.screenshot({
                        path : "./screenshot2.jpg",
                        fullPage : true
                    });
                    console.log("login success");
                    await page.waitForTimeout(5000);
                    await page.screenshot({
                        path : "./screenshot3.jpg",
                        fullPage : true
                    });
                    */
          /*
                    await page.waitForTimeout(3000);
                    await page.keyboard.down('Tab')
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.waitForTimeout(500);   
                    await page.keyboard.down('Tab')
                    await page.waitForTimeout(500);                    
                  

                    await page.keyboard.type(configData.login.email, { delay: 10 });
                    await page.keyboard.down('Tab');
                    await page.waitForTimeout(500);
                    await page.keyboard.type(configData.login.password, { delay: 10 });
                    await page.keyboard.press("Enter");
                    console.log("Login Success");
                    await page.waitForTimeout(5000);
                    */
          return true;
        } catch (e) {
          console.log('login Failed');
          console.log('Error in Login');
          console.log('MAINTAIN LOGIN :', e);
          return false;
        }
      }
    }
    //6 Tab
    if (
      config.domain == 'www.laopiniondezamora.es' ||
      config.domain == 'www.laopinioncoruna.es'
    ) {
      console.log('***********6');
      await page.waitForSelector(configData.loginWaitFor);
      let data = await page.evaluate((configData) => {
        let flag = document.querySelector(configData.loginFlag);
        console.log('Flag: ', flag);
        if (flag != null || flag != undefined) {
          return true;
        } else {
          return false;
        }
      }, configData);
      if (data) {
        console.log('User Already logged in');
        return true;
      } else {
        console.log('User not logged In');
        console.log('Attempting to login to user account..');
        try {
          let url = configData.loginUrl;
          try {
            await page.goto(url, {
              waitUntil: 'networkidle2',
            });
          } catch (e) {}
          await page.keyboard.type(configData.login.email, { delay: 10 });
          await page.waitForTimeout(500);
          await page.keyboard.down('Tab');
          await page.keyboard.type(configData.login.password, { delay: 10 });
          await page.waitForTimeout(500);
          await page.keyboard.press('Enter');
          await page.waitForTimeout(5000);
          console.log('login success');
          /*
                    await page.keyboard.type(configData.login.email, { delay: 10 });
                    await page.screenshot({
                        path : "./screenshot.jpg",
                        fullPage : true
                    });
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.keyboard.type(configData.login.password, { delay: 10 });
                    await page.screenshot({
                        path : "./screenshot1.jpg",
                        fullPage : true
                    });
                    await page.waitForTimeout(500);
                    await page.keyboard.press("Enter");
                    await page.screenshot({
                        path : "./screenshot2.jpg",
                        fullPage : true
                    });
                    console.log("login success");
                    await page.waitForTimeout(5000);
                    await page.screenshot({
                        path : "./screenshot3.jpg",
                        fullPage : true
                    });
                    */
          /*
                    await page.waitForTimeout(3000);
                    await page.keyboard.down('Tab')
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.waitForTimeout(500);
                    await page.keyboard.down('Tab')
                    await page.waitForTimeout(500);   
                    await page.keyboard.down('Tab')
                    await page.waitForTimeout(500);   
                    await page.keyboard.down('Tab')
                    await page.waitForTimeout(500);   

                    await page.keyboard.type(configData.login.email, { delay: 10 });
                    await page.keyboard.down('Tab');
                    await page.waitForTimeout(500);
                    await page.keyboard.type(configData.login.password, { delay: 10 });
                    await page.keyboard.press("Enter");
                    console.log("Login Success");
                    await page.waitForTimeout(5000);
                    */
          return true;
        } catch (e) {
          console.log('login Failed');
          console.log('Error in Login');
          console.log('MAINTAIN LOGIN :', e);
          return false;
        }
      }
    }
    if (
      config.domain == 'www.lavanguardia.com' ||
      config.domain == 'www.mundodeportivo.com'
    ) {
      try {
        await page.waitForSelector(configData.loginWaitFor);
      } catch (e) {
        console.log('loginWaitFor error: ', e);
      }

      let data = await page.evaluate((configData) => {
        let flag;
        try {
          flag = document.querySelector(configData.loginFlag);
        } catch (e) {
          console.log('loginFlag error: ', e);
        }

        if (flag === null) {
          return false;
        } else {
          return true;
        }
      }, configData);

      console.log('flag: ', data);

      if (data) {
        console.log('User Already logged in');
        return true;
      } else {
        console.log('User not logged In on');
        console.log('Attempting to login to user account..');
        try {
          let url = configData.loginUrl;
          try {
            await page.goto(url, {
              waitUntil: 'networkidle2',
            });
          } catch (e) {}
          //await page.screenshot({path: 'example1.png'});
          //await page.keyboard.type(configData.login.email, { delay: 10 });
          await page.type('input[name=email_address]', configData.login.email, {
            delay: 10,
          });
          await page.waitForTimeout(2000);
          //password
          //await page.screenshot({path: 'example2.png'});
          await page.keyboard.down('Enter');
          //await page.keyboard.type(configData.login.password, { delay: 10 });
          //await page.type('input[name=password]', configData.login.password, { delay: 10 });
          await page.waitForTimeout(3000);
          await page.type('input[name=password]', configData.login.password, {
            delay: 10,
          });
          //await page.screenshot({path: 'example3.png'});
          await page.waitForTimeout(1000);
          await page.keyboard.press('Enter');
          await page.waitForTimeout(5000);
          //await page.screenshot({path: 'example4.png'});
          console.log('login success');

          return true;
        } catch (e) {
          console.log('login Failed');
          console.log('Error in Login');
          console.log('MAINTAIN LOGIN :', e);
          return false;
        }
      }
    }
  }

  static async getRandomInt(min, max) {
    // let min = 0
    // let max = UserAgent.length
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  static async getmetaData(page, config) {
    try {
      // let meta_array=[];
      let metadata = await page.evaluate(async (config) => {
        let meta_array = [];
        let detail;
        let index;
        let prod_name;
        let description;
        let mrp;
        let sale_price;
        let assured;
        let img;
        let prod;
        let desc;
        let op;
        let sp;
        let asr;
        let images;
        let href_link;
        let obj;

        console.log('details', config.SCRAPE.flipkart.detail[0].class);
        detail = document.getElementsByClassName(
          config.SCRAPE.flipkart.detail[0].class
        ); // specification
        if (detail.length != 0) {
          index = 0;
        } else {
          index = 1;
        }
        try {
          prod_name = document.getElementsByClassName(
            config.SCRAPE.flipkart.detail[index].prod_name
          );
        } catch (e) {
          console.log(error);
        }
        try {
          description = document.getElementsByClassName(
            config.SCRAPE.flipkart.detail[index].description
          );
        } catch (e) {
          console.log(error);
        }
        try {
          mrp = document.getElementsByClassName(
            config.SCRAPE.flipkart.detail[index].mrp
          );
        } catch (e) {
          console.log(error);
        }
        // mrp = document.getElementsByClassName(config.SCRAPE.flipkart.mrp);
        // console.log("sel 1:", config.SCRAPE.flipkart.mrp);
        try {
          sale_price = document.getElementsByClassName(
            config.SCRAPE.flipkart.detail[index].sale_price
          );
        } catch (error) {
          console.log(error);
        }

        try {
          assured = document.querySelectorAll(
            config.SCRAPE.flipkart.detail[index].assured
          );
        } catch (error) {
          console.log(error);
        }

        // assured = document.getElementsByClassName(config.SCRAPE.flipkart.assured);
        try {
          img = document.getElementsByClassName(
            config.SCRAPE.flipkart.detail[index].img
          );
        } catch (error) {
          console.log(error);
        }

        console.log(prod_name);
        console.log(description);
        console.log(mrp);
        console.log(sale_price);
        console.log(assured);

        for (let i = 0; i < img.length; i++) {
          try {
            //obj 1 till 40
            prod = prod_name[i].textContent;
            // console.log("prod name:", prod_name);
            desc = description[i].textContent;
            try {
              op = mrp[i].textContent;
            } catch (error) {
              op = 'undefined';
            }
            try {
              sp = sale_price[i].textContent;
            } catch (error) {
              sp = 'undefined';
            }

            try {
              asr = assured[i].currentSrc;
              asr = true;
            } catch (error) {
              asr = false;
            }

            // let asr = assured[i].src
            images = img[i].src;
            href_link = description[i].href;
            // console.log("href :", href_link);
            obj = {
              prod_name: prod,
              description: desc,
              original_price: op,
              sale_price: sp,
              assurance: asr,
              images: images,
              prod_link: href_link, // new added
            };
            // console.log(obj)
            // console.log("meta array length: ", meta_array.length);
            meta_array.push(obj);
            // obj = {}
          } catch (error) {
            console.log(error);
          }
        }
        // console.log("meta_array: ",meta_array);
        return meta_array;
      }, config);
      console.log(metadata);
      return metadata;
    } catch (e) {
      console.log(e);
    }
  }
  static async getProductmeta(page, config) {
    try {
      let data = await page.evaluate(
        async (page, config) => {
          let product_details;
          // let descript;
          // let base_price;
          // let discount_price;
          let img_link;
          let rate_score;
          let rate_review;
          let seller;
          let seller_rating;
          let review_link;
          let specification;
          let manufacturer_arr = [];
          let generic_details;
          let manufact_details;
          let detail_info;
          // let assured;
          try {
            img_link = document.getElementsByClassName(
              config.SCRAPE.flipkart.img_link
            ); //array of 7
            console.log('image :', img_link);
          } catch (error) {}
          try {
            rate_score = document.getElementsByClassName(
              config.SCRAPE.flipkart.rate_score
            );
          } catch (error) {
            console.log(error);
          }
          try {
            rate_review = document.getElementsByClassName(
              config.SCRAPE.flipkart.rate_review
            );
          } catch (error) {
            console.log(error);
          }
          try {
            seller = document.querySelectorAll(config.SCRAPE.flipkart.seller);
          } catch (error) {
            console.log(error);
          }
          try {
            seller_rating = document.getElementsByClassName(
              config.SCRAPE.flipkart.seller_rating
            );
          } catch (error) {
            console.log(error);
          }
          try {
            review_link = document.querySelectorAll(
              config.SCRAPE.flipkart.review_link
            );
          } catch (error) {
            console.log('not more than 3 reviews');
          }
          try {
            specification = document.getElementsByClassName(
              config.SCRAPE.flipkart.specification
            );
          } catch (error) {
            console.log('specification selector not found');
          }
          try {
            product_details = document.getElementsByClassName(
              config.SCRAPE.flipkart.product_details
            );
          } catch (e) {
            console.log('prod selector not found');
          }
          try {
            generic_details = document.getElementsByClassName(
              config.SCRAPE.flipkart.generic_details
            );
          } catch (e) {
            console.log(error);
          }
          try {
            manufact_details = document.getElementsByClassName(
              config.SCRAPE.flipkart.manufact_details
            );
          } catch (e) {
            console.log(error);
          }
          try {
            detail_info = document.getElementsByClassName(
              config.SCRAPE.flipkart.detail_info
            );
          } catch (e) {
            console.log(error);
          }
          try {
            manufact_closebtn = document.getElementsByClassName(
              config.SCRAPE.flipkart.manufact_closebtn
            );
          } catch (e) {
            console.log(error);
          }
          // try{
          //     other_sellers = document.getElementsByClassName(config.SCRAPE.flipkart.other_sellers);
          // }catch(e){
          //     console.log(error);
          // }

          console.log('SELETORS FOUND');

          // // try {
          //     assured = document.querySelectorAll(config.SCRAPE.flipkart.assured);
          // } catch (error) {assured = false}

          let image_arr = [];
          for (let i = 0; i < img_link.length; i++) {
            image_arr.push(img_link[i].src);
          }
          console.log('image :', image_arr);
          let rating = rate_score[0].textContent;
          console.log('rate_score :', rating);
          let rate_rev = rate_review[0].textContent;
          console.log('rate_review :', rate_rev);
          let sel_nm = seller[0].textContent;
          console.log('selnm :', sel_nm);
          let sel_rate = seller_rating[0].textContent;
          console.log('sel rate: ', sel_rate);
          let rlink = review_link[0].href;
          console.log('rev link: ', rlink);

          /*specifiaction*/
          specific_det = [];
          try {
            // specific_det = [];
            for (let i = 0; i < specification.length; i++) {
              let detail = specification[i].innerText;
              specific_det.push(detail);
            }
            console.log(specific_det);
            // click read more
            read_more = document.getElementsByClassName(
              config.SCRAPE.flipkart.read_more
            );
            read_more[0].click();
            // click manufact,product,import info
            specif_manucfacturer = document.getElementsByClassName(
              config.SCRAPE.flipkart.specif_manucfacturer
            );
            specif_manucfacturer[0].click();
          } catch (error) {
            specific_det = 'undefined';
          }
          console.log('specific_det', specific_det);

          /*product details*/
          let prod_det;
          try {
            prod_det = product_details[0].innerText;
            // click manufact,product,import info
            product_manufacturer = document.querySelectorAll(
              config.SCRAPE.flipkart.product_manufacturer
            );
            product_manufacturer[0].click();
          } catch (error) {
            prod_det = 'undefined';
          }
          console.log('prod_details', prod_det);

          // let specif_manucfacturer;
          // try{
          //     specif_manucfacturer = document.getElementsByClassName(config.SCRAPE.flipkart.specif_manucfacturer);
          //     console.log("click selector:", specif_manucfacturer);
          //     specif_manucfacturer[0].click();
          // }catch(e){
          //     console.log(e); }

          let generic_det = generic_details[0].innerText; // fetch generic det
          // let manufact_det = [];
          manufacturer_arr.push(generic_det);
          for (let i = 0; i < manufact_details.length; i++) {
            // fetch manufact,product,import info
            let category = manufact_details[i].innerText;
            let cat_info = detail_info[0].innerText;
            let manufact_obj = {
              // category : cat_info
            };
            manufact_obj[category] = cat_info;
            console.log(manufact_obj);
            manufacturer_arr.push(manufact_obj);
            let clk = 1; // variable for click
            try {
              manufact_details[clk].click();
              clk++;
            } catch (error) {
              console.log('no more elements');
            }
          }
          // manufacturer_arr.push(generic_det, manufact_det);
          // close manufact,product,import
          try {
            manufact_closebtn[0].click();
          } catch (error) {}
          // click other sellers
          // try {
          //     other_sellers[0].click();
          //     console.log('Before wait')
          //     // await page.waitForSelector(seller_name)
          //     console.log('After click')

          // } catch (error) {
          //     console.log(error);
          // }

          console.log('entering obj..');
          let obj = {
            // description : des,
            // baseprice : base_p,
            // salesprice : des_p,
            images: image_arr,
            ratings: rating,
            reviews: rate_rev,
            seller_name: sel_nm,
            seller_rating: sel_rate,
            review_url: rlink,
            specification: specific_det,
            product_details: prod_det,
            Manufacturing_info: manufacturer_arr,
          };
          console.log('out of obj..');
          console.log('object: ', obj);
          // let manufact;
          // try{
          //     manufact = document.querySelectorAll(config.SCRAPE.flipkart.manufacturer);
          //     manufact[0].click();
          // }catch(e){}

          return obj;
        },
        page,
        config
      );
      // console.log("DATA :", data)

      // let sel_nm = seller_name[0].innerText;
      // console.log("seller_name :", sel_nm);

      return data; // return data;
    } catch (error) {
      console.log(error);
    }
    // try {
    //     //page = await page.click(config.SCRAPE.flipkart.nextbtn);
    //     //await page.waitForNavigation();
    //     await page.click(config.SCRAPE.flipkart.other_sellers);
    //     console.log('Before wait')
    //     await page.waitForTimeout(8000)
    //     console.log('After wait')
    // } catch (error) {
    //     console.log(error)
    // }
  }
  static async getSeller(page, config) {
    try {
      console.log(
        'other seller selector',
        config.SCRAPE.flipkart.other_sellers
      );
      await page.click(config.SCRAPE.flipkart.other_sellers);
      console.log('Before wait 8s');
      await page.waitForTimeout(8000);
      console.log('After wait');
    } catch (error) {
      console.log(error);
    }
    try {
      let data = await page.evaluate(
        async (page, config) => {
          console.log('page:', page);
          let seller_name;
          let seller_rate;
          let original_prc;
          let discount_price;
          let sellname;
          let sellrate;
          let org_prc;
          let aboutsell_btn;
          let seller_since;
          let dis_prc;
          let FSSAI_License;
          let F_License;
          let service_qlt;
          let prod_qlt;
          let sell_date;
          let seller_data = [];
          let obj;
          try {
            seller_name = document.getElementsByClassName(
              config.SCRAPE.flipkart.seller_name
            );
          } catch (e) {
            console.log(error);
          }
          try {
            seller_rate = document.getElementsByClassName(
              config.SCRAPE.flipkart.seller_rate
            );
          } catch (e) {
            console.log(error);
          }
          try {
            original_prc = document.getElementsByClassName(
              config.SCRAPE.flipkart.original_prc
            );
          } catch (e) {
            console.log(error);
          }
          try {
            discount_price = document.getElementsByClassName(
              config.SCRAPE.flipkart.discount_price
            );
          } catch (e) {
            console.log(error);
          }
          console.log('SELETORS FOUND');
          // try{
          //     seller_qaulity = document.getElementsByClassName(config.SCRAPE.flipkart.seller_qaulity);
          // }catch(e){
          //     console.log(error);
          // }
          function delay(time) {
            return new Promise(function (resolve) {
              setTimeout(resolve, time);
            });
          }
          console.log('starting loop ');
          console.log(seller_name);
          console.log(seller_name.length);

          for (let i = 0; i < seller_name.length; i++) {
            sellname = seller_name[i].textContent;
            console.log('sellname:', sellname);
            // let sellrate = seller_rate[i].textContent;
            // console.log("sellrate :", sellrate);
            // let org_prc = original_prc[i].textContent;
            try {
              sellrate = seller_rate[i].textContent;
            } catch (error) {
              sellrate = 'undefined';
            }
            try {
              org_prc = original_prc[i].textContent;
            } catch (error) {
              org_prc = 'undefined';
            }
            dis_prc = discount_price[i].textContent;
            console.log('discount price :', dis_prc);
            // click for about seller
            try {
              aboutsell_btn = document.querySelectorAll(
                config.SCRAPE.flipkart.aboutsell_btn
              );
              console.log('before click');
              console.log(aboutsell_btn[i]);
              await aboutsell_btn[i].click();
            } catch (error) {
              console.log(error);
            }
            // get info about seller
            function info() {
              return new Promise((resolve, reject) => {
                setTimeout(async () => {
                  console.log('after click in 10s');
                  try {
                    seller_since = document.getElementsByClassName(
                      config.SCRAPE.flipkart.seller_since
                    );
                  } catch (e) {
                    console.log(e);
                  }
                  try {
                    FSSAI_License = document.querySelectorAll(
                      config.SCRAPE.flipkart.FSSAI_License
                    );
                    F_License = FSSAI_License[0].innerText;
                    console.log('F_License :', F_License);
                  } catch (e) {
                    F_License = 'not defined';
                    console.log(e);
                  }
                  try {
                    seller_qaulity = document.getElementsByClassName(
                      config.SCRAPE.flipkart.seller_qaulity
                    );
                  } catch (e) {
                    console.log(e);
                  }
                  console.log('selectors found');
                  sell_date = seller_since[0].textContent;
                  console.log('sell_date :', sell_date);
                  prod_qlt = seller_qaulity[0].innerText;
                  console.log('prod_qlt :', prod_qlt);
                  service_qlt = seller_qaulity[1].innerText;
                  console.log('service_qlt :', service_qlt);
                  // let F_License = FSSAI_License[0].innerText;
                  // console.log("F_License :", F_License);
                  try {
                    aboutsell_close = document.getElementsByClassName(
                      config.SCRAPE.flipkart.aboutsell_close
                    );
                    aboutsell_close[0].click();
                  } catch (error) {
                    console.log(error);
                  }
                  // calling DELAY
                  console.log('calling after close ');
                  await delay(4000);
                  console.log('calling after close ');
                  //
                  console.log('entering of obj..');
                  obj = {
                    seller_name: sellname,
                    seller_rating: sellrate,
                    baseprice: org_prc,
                    salesprice: dis_prc,
                    seller_since: sell_date,
                    product_qlt: prod_qlt,
                    service_qlt: service_qlt,
                    FSSAI_Lic: F_License,
                  };
                  console.log('out of obj..');
                  console.log('object: ', obj);

                  // console.log("obj ready...")
                  // return obj;

                  resolve(obj);
                  // obj{}
                }, 1000);
              });
            }
            //  async function() {
            const result = await info();
            console.log(i + ' ' + result); // --> 'done!';
            seller_data.push(result);
          }

          console.log('returned data: ', seller_data);
          return seller_data;
        },
        page,
        config
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  static async getReviewGen(page, config) {
    // // click filter Negative first
    // try {
    //     // await page.click(config.SCRAPE.flipkart.review_filter);
    //     await page.select(config.SCRAPE.flipkart.review_filter, 'NEGATIVE_FIRST');
    //     console.log('Before wait of 5s')
    //     await page.waitForTimeout(5000)
    //     console.log('After wait')

    // } catch (error) {
    //     console.log(error)
    // }
    // get general data
    try {
      let data = await page.evaluate(async (config) => {
        let product_star;
        let total_rev_rate;
        let rate_distribution;
        // let review_desc;
        // let aboutsell_btn;
        // let seller_since;
        try {
          product_star = document.getElementsByClassName(
            config.SCRAPE.flipkart.product_star
          );
        } catch (e) {
          console.log(error);
        }
        try {
          total_rev_rate = document.getElementsByClassName(
            config.SCRAPE.flipkart.total_rev_rate
          );
        } catch (e) {
          console.log(error);
        }
        try {
          rate_distribution = document.getElementsByClassName(
            config.SCRAPE.flipkart.rate_distribution
          );
        } catch (e) {
          console.log(error);
        }
        try {
          nextRev_btn = document.getElementsByClassName(
            config.SCRAPE.flipkart.nextRev_btn
          );
        } catch (e) {
          console.log(error);
        }
        // console.log(nextRev_btn);
        // try{
        //     review_rating = document.getElementsByClassName(config.SCRAPE.flipkart.review_rating);
        // }catch(e){
        //     console.log(error);
        // }
        // console.log('SELETORS FOUND');
        let review_arr = [];
        try {
          let prod_star = product_star[0].innerText;
          // console.log('prod_star:', prod_star);
          let total_rr = total_rev_rate[0].innerText;
          // console.log('total_rr:', total_rr);
          let rate_dist = rate_distribution[0].innerText.split('\n'); // '66\n28\n18\n5\n7' ['66', '28', '18', '5', '7']
          // console.log('rate_dist:', rate_dist);
          let general_obj = {
            product_star: prod_star,
            numberof_revrate: total_rr,
            rate_percentage: rate_dist,
          };
          review_arr.push(general_obj); // general review details pushed
        } catch (e) {
          console.log('error in getReviewGen', e);
        }

        // console.log(review_arr);
        // selector_arr.push(review_arr,nextRev_btn);
        // console.log(selector_arr);
        return review_arr; //review_arr
      }, config);
      //   console.log('Review Statistic data from getReviewGen:', data); // to cmnt return data;
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  static async getReviewLoop(page, config) {
    console.log('inside function');
    // click filter Negative first
    // try {
    //     // await page.click(config.SCRAPE.flipkart.review_filter);
    //     await page.select(config.SCRAPE.flipkart.review_filter, 'NEGATIVE_FIRST');
    //     console.log('Before wait of 5s')
    //     await page.waitForTimeout(5000)
    //     console.log('After wait')

    // } catch (error) {
    //     console.log(error)
    // }
    //DELAY FUNCTION
    function delay(time) {
      return new Promise(function (resolve) {
        setTimeout(resolve, time);
      });
    }
    // get metadata
    try {
      let data = await page.evaluate(
        async (page, config) => {
          console.log('page ', page);
          let review_main;
          let reviewloop_arr = [];
          let review_description;
          let review_star;
          let buyer_name;
          let rev_date;
          let certified_location;
          let review_obj;

          try {
            review_main = document.getElementsByClassName(
              config.SCRAPE.flipkart.review_main
            );
          } catch (e) {
            console.log(e);
          }
          console.log('selector ', review_main, review_main.length);
          // //DELAY FUNCTION
          // function delay(time){
          //     return new Promise(function(resolve){
          //         setTimeout(resolve, time)
          //     });
          // }
          // STARTS LOOP
          for (let i = 0; i < review_main.length; i++) {
            // loops over review on page a[0].getElementsByClassName("_6K-7Co")[0].innerText;
            console.log('i :', i);
            try {
              review_description = review_main[i].getElementsByClassName(
                config.SCRAPE.flipkart.review_desc
              )[0].innerText;
              console.log('review_description:', review_description);
            } catch (error) {
              review_description = 'undefined';
            }
            try {
              review_star = review_main[i + 1].getElementsByClassName(
                config.SCRAPE.flipkart.review_star
              )[0].innerText;
              console.log('review_star:', review_star);
            } catch (error) {
              review_star = 'undefined';
            }
            // console.log("review_star:", review_star);
            try {
              buyer_name = review_main[i].getElementsByClassName(
                config.SCRAPE.flipkart.buyer_date
              )[0].innerText;
              console.log('buyer_name:', buyer_name);
            } catch (error) {
              buyer_name = 'undefined';
            }
            try {
              rev_date = review_main[i].getElementsByClassName(
                config.SCRAPE.flipkart.buyer_date
              )[1].innerText;
              console.log('review_date:', rev_date);
            } catch (error) {
              rev_date = 'undefined';
            }
            // console.log("buyer_name:", buyer_name);
            try {
              certified_location = review_main[i].getElementsByClassName(
                config.SCRAPE.flipkart.certified_location
              )[0].innerText;
              console.log('certified_location:', certified_location);
            } catch (error) {
              certified_location = 'undefined';
            }
            review_obj = {
              review_text: review_description,
              review_rate: review_star,
              profile_name: buyer_name,
              review_date: rev_date,
              certified_place: certified_location,
            };
            reviewloop_arr.push(review_obj);
          }
          console.log('one page completed');
          //click next

          let nextRev_btn = document.querySelectorAll(
            config.SCRAPE.flipkart.nextRev_btn
          );
          console.log('seletcor lenght: ', nextRev_btn.length);
          nextRev_btn[nextRev_btn.length - 1].click();
          // // calling DELAY
          // console.log("calling delay 4s after next");
          // await delay(4000);
          // console.log("after delay");

          return reviewloop_arr;
        },
        page,
        config
      );
      // calling DELAY
      console.log('calling delay 4s after next');
      await page.waitForTimeout(4000);
      console.log('after delay');
      // try {
      //     //page = await page.click(config.SCRAPE.flipkart.nextbtn);
      //     //await page.waitForNavigation();
      //     // await page.click(config.SCRAPE.flipkart.nextbtn);
      //     console.log('Before wait outside evaluate 10s');
      //     await page.waitForTimeout(10000);
      //     console.log('After wait');

      // } catch (error) {
      //     console.log(error)
      // }
      return [data, page];
    } catch (error) {
      console.log(error);
    }
  }
  static async sentiment_api(data) {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest',
      {
        headers: {
          Authorization: 'Bearer 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',
        },
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    return result;
  }
  static async text_summary_api(data) {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
      {
        headers: {
          Authorization: 'Bearer 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',
        },
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    return result;
  }
}

module.exports = Helper;
