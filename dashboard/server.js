const express = require("express");
const app = express();
const chalk = require("chalk");
const ejs = require("ejs");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const Strategy = require("passport-discord").Strategy;
const MemoryStore = require("memorystore")(session);
const url = require("url");
const bodyParser = require("body-parser");
const config = require("../config.json");
const settings = require("../settings.json");
const Discord = require('discord.js')
const bot = new Discord.Client()


module.exports = async bot => {
    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((obj, done) => done(null, obj));

    passport.use(
        new Strategy(
          {
            clientID: config.bot.id,
            clientSecret: config.bot.secret,
            callbackURL: config.dashboard.callback,
            scope: ["identify"]
          },
          (accessToken, refreshToken, profile, done) => {
            process.nextTick(() => done(null, profile));
          }
        )
    );
    var minifyHTML = require('express-minify-html-terser');
    app.use(minifyHTML({
        override:      true,
        exception_url: false,
        htmlMinifier: {
            removeComments:            true,
            collapseWhitespace:        true,
            collapseBooleanAttributes: true,
            removeAttributeQuotes:     true,
            removeEmptyAttributes:     true,
            minifyJS:                  true
        }
    }));
    app.use(
        session({
          store: new MemoryStore({ checkPeriod: 86400000 }),
          secret:
            "#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4n",
          resave: false,
          saveUninitialized: false
        })
    );
    
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));
    app.listen(config.dashboard.port, () => console.log(chalk.green(`Iniciado en el Puerto ${config.dashboard.port}`)));

    app.use(
        "/js",
        express.static(path.join(__dirname, 'views/js'))
    );

    app.use(
        "/css",
        express.static(path.join(__dirname, 'views/css'))
    );

    app.use(
      "/img",
      express.static(path.join(__dirname, 'views/img'))
  );

    const checkAuth = (req, res, next) => {
        if (req.isAuthenticated()) return next();
        req.session.backURL = req.url;
        res.redirect("/login");
    };

   
    app.get(
        "/login",
        (req, res, next) => {
          if (req.session.backURL) {
            req.session.backURL = req.session.backURL;
          } else if (req.headers.referer) {
            const parsed = url.parse(req.headers.referer);
            if (parsed.hostname === app.locals.domain) {
              req.session.backURL = parsed.path;
            }
          } else {
            req.session.backURL = "/";
          }
          next();
        },
        passport.authenticate("discord", { prompt: "none" })
    );

    app.get(
        "/callback",
        passport.authenticate("discord", {
          failureRedirect:
            "/error?code=999&message=Encontramos un error al conectarnos."
        }),
        async (req, res) => {
            res.redirect(req.session.backURL || "/");
        }
    );

    app.get("/logout", function(req, res) {
        req.session.destroy(() => {
          req.logout();
          res.redirect("/");
        });
    });
  app.get("/", async (req, res) => {
        res.render("index", {
            bot,
            user: req.user,
            config,
            title: "Home"
        })
    });

    app.get("/discord", (req, res) => {
        res.redirect(config.discord)
    });

    
    

    app.get('/commands', (req, res) => res.render('commands', { bot: settings.website, commands: settings.commands,bot,
            user: req.user,
            config,
            title: "Comandos" }))

    app.get("/owners", (req, res) => {
        res.render("owners", {
          bot,
          user: req.user,
          config,
          title: "Owners"
        });
    });
  
  app.get("/admin", async (req, res) => {
        if(config.dashboard.ownerids.includes(req.user.id)){
            res.render("admin/index", {
                bot,
                user: req.user,
                user2: req.isAuthenticated() ? req.user : null,
                config,
                title: "Admin"
            })
        }else {
          res.redirect("/")
        }
    })
  app.get("/prueba", async (req, res) => {
        if(config.dashboard.ownerids.includes(req.user.id)){
            res.render("prueba", {
                bot,
                user: req.user,
                config,
                title: "Prueba"
            })
        }else {
          res.redirect("/")
        }
    })
   






   
    if(config.dashboard.arc.enabled === true){
        app.get("/arc-sw.js", (req, res) => {
            res.type(".js")
            res.send(`!function(t){var e={};function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=100)}({100:function(t,e,r){"use strict";r.r(e);var n=r(2);if("undefined"!=typeof ServiceWorkerGlobalScope){var o="https://arc.io"+n.k;importScripts(o)}else if("undefined"!=typeof SharedWorkerGlobalScope){var c="https://arc.io"+n.i;importScripts(c)}else if("undefined"!=typeof DedicatedWorkerGlobalScope){var i="https://arc.io"+n.b;importScripts(i)}},2:function(t,e,r){"use strict";r.d(e,"a",(function(){return n})),r.d(e,"f",(function(){return c})),r.d(e,"j",(function(){return i})),r.d(e,"i",(function(){return a})),r.d(e,"b",(function(){return d})),r.d(e,"k",(function(){return f})),r.d(e,"c",(function(){return u})),r.d(e,"d",(function(){return s})),r.d(e,"e",(function(){return l})),r.d(e,"h",(function(){return m})),r.d(e,"g",(function(){return v}));var n={images:["bmp","jpeg","jpg","ttf","pict","svg","webp","eps","svgz","gif","png","ico","tif","tiff","bpg","avif","jxl"],video:["mp4","3gp","webm","mkv","flv","f4v","f4p","f4bogv","drc","avi","mov","qt","wmv","amv","mpg","mp2","mpeg","mpe","m2v","m4v","3g2","gifv","mpv","av1"],audio:["mid","midi","aac","aiff","flac","m4a","m4p","mp3","ogg","oga","mogg","opus","ra","rm","wav","webm","f4a","pat"],interchange:["json","yaml","xml","csv","toml","ini","bson","asn1","ubj"],archives:["jar","iso","tar","tgz","tbz2","tlz","gz","bz2","xz","lz","z","7z","apk","dmg","rar","lzma","txz","zip","zipx"],documents:["pdf","ps","doc","docx","ppt","pptx","xls","otf","xlsx"],other:["srt","swf"]},o="arc:",c={COMLINK_INIT:"".concat(o,"comlink:init"),NODE_ID:"".concat(o,":nodeId"),CDN_CONFIG:"".concat(o,"cdn:config"),P2P_CLIENT_READY:"".concat(o,"cdn:ready"),STORED_FIDS:"".concat(o,"cdn:storedFids"),SW_HEALTH_CHECK:"".concat(o,"cdn:healthCheck"),WIDGET_CONFIG:"".concat(o,"widget:config"),WIDGET_INIT:"".concat(o,"widget:init"),WIDGET_UI_LOAD:"".concat(o,"widget:load"),BROKER_LOAD:"".concat(o,"broker:load"),RENDER_FILE:"".concat(o,"inlay:renderFile"),FILE_RENDERED:"".concat(o,"inlay:fileRendered")},i="serviceWorker",a="/".concat("shared-worker",".js"),d="/".concat("dedicated-worker",".js"),f="/".concat("arc-sw-core",".js"),p="".concat("arc-sw",".js"),u=("/".concat(p),"/".concat("arc-sw"),"arc-db"),s="key-val-store",l=2**17,m="".concat("https://overmind.arc.io","/api/propertySession"),v="".concat("https://warden.arc.io","/mailbox/propertySession")}});`)
        })
    }

    app.get("/error", async (req, res) => {
        res.render("error", {
          bot,
          user: req.user,
          config,
          title: "Error",
          req
        })
    })

    app.get('*', (req, res) => res.render('404', {
          bot,
          user: req.user,
          config,
          title: "Error",
          req
        }))

    function makeidd(length) {
      var result = "";
      var characters =
        "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }
}