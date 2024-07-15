// ==UserScript==
// @name          Old Reddit Redirect
// @version       0.0.1
// @description   Old reddit, always
// @match         *://*.reddit.com/*
// @exclude       /[/]{2}www[.]reddit[.]com[/](gallery|media)/
// @exclude       /[/]{2}(old|np)[.]reddit[.]com[/](?!gallery|media)/
// @run-at        document-start
// @grant         none
// @homepageURL   https://github.com/fa7ad
// @updateURL     https://raw.githubusercontent.com/fa7ad/userscripts/main/reddit.user.js
// @updateURL     https://raw.githubusercontent.com/fa7ad/userscripts/main/reddit.user.js
// @license       MIT
// @author        Fahad Hossain <set.name.fahad AT gmail.com>
// ==/UserScript==
'use strict';

const currentUrl = window.location.href;

const oldRedditUrl = 'https://old.reddit.com/';
const newRedditUrl = 'https://www.reddit.com/';

function isOnOld(url) {
  return /(old|np)[.]reddit[.]com/.test(url);
}

function isMediaPage(url) {
  return /reddit[.]com[/](gallery|media)/.test(url);
}

// fix bad gallery and media links
if (isOnOld(currentUrl) && isMediaPage(currentUrl)) {
  const newUrl = currentUrl.replace(/^https?:\/\/(old\.)?reddit.com\//, newRedditUrl);
  window.location.replace(newUrl);
}

// Check if the current URL does not include old.reddit.com
if (!isOnOld(currentUrl) && !isMediaPage(currentUrl)) {
  const newUrl = currentUrl.replace(/^https?:\/\/(www\.)?reddit.com\//, oldRedditUrl);

  window.location.replace(newUrl);
}
