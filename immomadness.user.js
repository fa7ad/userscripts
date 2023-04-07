// ==UserScript==
// @name          No exchange + caution private - wohnungsboerse,immoscout24
// @namespace     https://github.com/fa7ad
// @match         https://www.wohnungsboerse.net/*/*
// @match         https://www.immobilienscout24.de/Suche/*
// @grant         none
// @version       1.0.0-3
// @homepageURL   https://github.com/fa7ad
// @updateURL     https://raw.githubusercontent.com/fa7ad/userscripts/main/immomadness.user.js
// @updateURL     https://raw.githubusercontent.com/fa7ad/userscripts/main/immomadness.user.js
// @license       MIT
// @author        Fahad Hossain <set.name.fahad AT gmail.com>
// @description   4/5/2023, 12:12:22 PM
// ==/UserScript==


function ready(fn) {
  if (document.readyState !== 'loading') {
    fn()
  } else {
    document.addEventListener('DOMContentLoaded', fn)
  }
}

async function sha256(message) {
  const msgUint8 = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
  return hashHex
}

function colorWBItem(item) {
  const head = item.querySelector('h3')?.innerText ?? ''
  const private = item.querySelector(`.${CSS.escape('before:icon-private')}`)
  if (/tausch|exchange/i.test(head)) {
    item.classList.remove('bg-bg')
    item.classList.add('bg-red')
  }
  if (private != null) {
    item.classList.remove('bg-bg')
    item.classList.add('bg-yellow')
  }
}

function colorIS24Item(item) {
  const head = item.querySelector('h5')?.innerText ?? ''
  const tail = item.querySelector('.result-list-entry__brand-logo--private')
  if (/tausch|exchange/i.test(head)) {
    item.style.backgroundColor = 'rgb(239 68 68)'
  }
  if (tail != null) {
    item.style.backgroundColor = 'rgb(253 224 71)'
  }
}

async function markTausch(container, itemSelector, itemTransformer) {
  if (window?.marked > 0) return;
  const allResults = container.querySelectorAll(itemSelector)
  allResults.forEach(itemTransformer)
  window.marked = allResults.length
}

function main() {
  const href = window.location.href
  sha256(href).then(h => {
    const oldHash = sessionStorage.getItem('locHashHex')
    if (oldHash === h) return;
    sessionStorage.setItem('locHashHex', h)
    window.marked = 0
  })
  if (/wohnungsboerse/i.test(href)) {
    const container = document.querySelector('.search_result_container')
    if (container) {
      markTausch(container, 'a.bg-bg', colorWBItem)
    }
  }
  if(/immobilienscout24/i.test(href)) {
    const container = document.querySelector('#listings')
    if (container) {
      markTausch(container, 'ul > li', colorIS24Item)
    }
  }
}

window.timer = setInterval(main, 5e3)
ready(main)
