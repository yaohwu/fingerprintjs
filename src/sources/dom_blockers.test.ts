import { parseSimpleCssSelector } from '../utils/data'
import getDomBlockers, { filters, isApplicable } from './dom_blockers'

async function withBlockedSelectors<T>(selectors: string[], action: () => Promise<T> | T): Promise<T> {
  const styleElement = document.createElement('style')

  try {
    styleElement.textContent = `${selectors.join(', ')} { display: none !important; }`
    document.head.appendChild(styleElement)

    return await action()
  } finally {
    styleElement.parentNode?.removeChild(styleElement)
  }
}

const testFilters = {
  abpIndo: [
    '#Iklan-Melayang',
    '#Kolom-Iklan-728',
    '#SidebarIklan-wrapper',
    'a[title="7naga poker" i]',
    '[title="ALIENBOLA" i]',
  ],
  abpvn: [
    '#quangcaomb',
    '.i-said-no-thing-can-stop-me-warning.dark',
    '.quangcao',
    '[href^="https://r88.vn/"]',
    '[href^="https://zbet.vn/"]',
  ],
  adBlockFinland: [
    '.mainostila',
    '.sponsorit',
    '.ylamainos',
    'a[href*="/clickthrgh.asp?"]',
    'a[href^="https://app.readpeak.com/ads"]',
  ],
  adBlockPersian: [
    '#navbar_notice_50',
    'a[href^="https://iqoption.com/lp/mobile-partner/?aff="]',
    '.kadr',
    'TABLE[width="140px"]',
    '#divAgahi',
  ],
  adBlockWarningRemoval: [
    '#adblock_message',
    '.adblockInfo',
    '.deadblocker-header-bar',
    '.no-ad-reminder',
    '#AdBlockDialog',
  ],
  adGuardAnnoyances: ['amp-embed[type="zen"]', '.hs-sosyal', '#cookieconsentdiv', 'div[class^="app_gdpr"]', '.as-oil'],
  adGuardBase: ['#gads_middle', '.tjads', '.BetterJsPopOverlay', '#ad_300X250', '#bannerfloat22'],
  adGuardChinese: [
    'a[href*=".123ch.cn"]',
    'a[href*=".ttz5.cn"]',
    'a[href*=".yabovip2027.com/"]',
    '.tm3all2h4b',
    '#j-new-ad',
  ],
  adGuardFrench: [
    '#div_banniere_pub',
    'a[href^="https://secure.securitetotale.fr/"]',
    'a[href*="fducks.com/"]',
    'a[href^="http://frtyd.com/"]',
    '.publicite1',
  ],
  adGuardGerman: [
    '.banneritemwerbung_head_1',
    '.boxstartwerbung',
    '.werbung3',
    'a[href^="http://www.ichwuerde.com/?ref="]',
    'a[href^="http://partners.adklick.de/tracking.php?"]',
  ],
  adGuardJapanese: [
    '.ad-text-blockA01',
    '._popIn_infinite_video',
    '[class^=blogroll_wrapper]',
    'a[href^="http://ad2.trafficgate.net/"]',
    'a[href^="http://www.rssad.jp/"]',
  ],
  adGuardMobile: ['amp-auto-ads', '#mgid_iframe', '.amp_ad', 'amp-sticky-ad', '.plugin-blogroll'],
  adGuardRussian: [
    'a[href^="https://ya-distrib.ru/r/"]',
    '[onclick*=".twkv.ru"]',
    '.reclama',
    'div[id^="smi2adblock"]',
    'div[id^="AdFox_banner_"]',
  ],
  adGuardSocial: [
    'a[href^="//www.stumbleupon.com/submit?url="]',
    'a[href^="//telegram.me/share/url?"]',
    '.etsy-tweet',
    '#inlineShare',
    '.popup-social',
  ],
  adGuardSpanishPortuguese: [
    '#barraPublicidade',
    '#Publicidade',
    '#publiEspecial',
    '#queTooltip',
    '[href^="http://ads.glispa.com/"]',
  ],
  adGuardTrackingProtection: [
    'amp-embed[type="taboola"]',
    '#qoo-counter',
    'a[href^="http://click.hotlog.ru/"]',
    'a[href^="http://hitcounter.ru/top/stat.php"]',
    'a[href^="http://top.mail.ru/jump"]',
  ],
  adGuardTurkish: [
    '#backkapat',
    '#reklami',
    'a[href^="http://adserv.ontek.com.tr/"]',
    'a[href^="http://izlenzi.com/campaign/"]',
    'a[href^="http://www.installads.net/"]',
  ],
  bulgarian: ['td#freenet_table_ads', '#newAd', '#ea_intext_div', '.lapni-pop-over', '#xenium_hot_offers'],
  easyList: ['[lazy-ad="leftthin_banner"]', '#ad_300x250_2', '#interstitialAd', '#wide_ad_unit', '.showcaseAd'],
  easyListChina: [
    'a[href*=".wensixuetang.com/"]',
    'A[href*="/hth107.com/"]',
    '.appguide-wrap[onclick*="bcebos.com"]',
    '.frontpageAdvM',
    '#taotaole',
  ],
  easyListCookie: ['#CookieEU', '#__cookies_', '#les_cookies', '.asset_balaNotification', '.gdpr-tab'],
  easyListCzechSlovak: ['#onlajny-stickers', '#reklamni-box', '.reklama-megaboard', '.sklik', '[id^="sklikReklama"]'],
  easyListDutch: [
    '#advertentie',
    '#vipAdmarktBannerBlock',
    '.adstekst',
    'a[href^="http://adserver.webads.nl/adclick/"]',
    '#semilo-lrectangle',
  ],
  easyListGermany: [
    '#LxWerbeteaser',
    'a[href^="http://www.kontakt-vermittler.de/?wm="]',
    '.werbung301',
    '.ads_bueroklammer',
    '#Werbung_Sky',
  ],
  easyListItaly: [
    '.box_adv_annunci',
    '.sb-box-pubbliredazionale',
    'a[href^="http://affiliazioniads.snai.it/"]',
    'a[href^="https://adserver.html.it/"]',
    'a[href^="https://affiliazioniads.snai.it/"]',
  ],
  easyListLithuania: [
    '.reklamos_tarpas',
    '.reklamos_nuorodos',
    'img[alt="Reklaminis skydelis"]',
    'img[alt="Dedikuoti.lt serveriai"]',
    'img[alt="Hostingas Serveriai.lt"]',
  ],
  estonian: ['A[href*="http://pay4results24.eu"]'],
  fanboyAnnoyances: [
    '#feedback-tab',
    '#taboola-below-article',
    '.feedburnerFeedBlock',
    '.widget-feedburner-counter',
    '[title="Subscribe to our blog"]',
  ],
  fanboyAntiFacebook: ['.util-bar-module-firefly-visible'],
  fanboyEnhancedTrackers: [
    '.open.pushModal',
    '#issuem-leaky-paywall-articles-zero-remaining-nag',
    'div[style*="box-shadow: rgb(136, 136, 136) 0px 0px 12px; color: "]',
    'div[class$="-hide"][zoompage-fontsize][style="display: block;"]',
    '.BlockNag__Card',
  ],
  fanboySocial: [
    '.td-tags-and-social-wrapper-box',
    '.twitterContainer',
    '.youtube-social',
    'a[title^="Like us on Facebook"]',
    'img[alt^="Share on Digg"]',
  ],
  frellwitSwedish: [
    'a[href*="casinopro.se"][target="_blank"]',
    'a[href*="doktor-se.onelink.me"]',
    'article.category-samarbete',
    'div.holidAds',
    'ul.adsmodern',
  ],
  greekAdBlock: [
    'A[href*="adman.otenet.gr/click?"]',
    'A[href*="http://axiabanners.exodus.gr/"]',
    'A[href*="http://interactive.forthnet.gr/click?"]',
    'DIV.agores300',
    'TABLE.advright',
  ],
  hungarian: [
    'A[href*="ad.eval.hu"]',
    'A[href*="ad.netmedia.hu"]',
    'A[href*="daserver.ultraweb.hu"]',
    '#cemp_doboz',
    '.optimonk-iframe-container',
  ],
  iDontCareAboutCookies: [
    '.alert-info[data-block-track*="CookieNotice"]',
    '.ModuleTemplateCookieIndicator',
    '.o--cookies--container',
    '.cookie-msg-info-container',
    '#cookies-policy-sticky',
  ],
  icelandicAbp: ['A[href^="/framework/resources/forms/ads.aspx"]'],
  latvian: [
    'a[href="http://www.salidzini.lv/"][style="display: block; width: 120px; height: 40px; overflow: hidden; position: relative;"]',
    'a[href="http://www.salidzini.lv/"][style="display: block; width: 88px; height: 31px; overflow: hidden; position: relative;"]',
  ],
  listKr: [
    'a[href*="//kingtoon.slnk.kr"]',
    'a[href*="//playdsb.com/kr"]',
    'div.logly-lift-adz',
    'div[data-widget_id="ml6EJ074"]',
    'ins.daum_ddn_area',
  ],
  listeAr: [
    '.geminiLB1Ad',
    '.right-and-left-sponsers',
    'a[href*=".aflam.info"]',
    'a[href*="booraq.org"]',
    'a[href*="dubizzle.com/ar/?utm_source="]',
  ],
  listeFr: [
    'a[href^="http://promo.vador.com/"]',
    '#adcontainer_recherche',
    'a[href*="weborama.fr/fcgi-bin/"]',
    '.site-pub-interstitiel',
    'div[id^="crt-"][data-criteo-id]',
  ],
  officialPolish: [
    '#ceneo-placeholder-ceneo-12',
    '[href^="https://aff.sendhub.pl/"]',
    'a[href^="http://advmanager.techfun.pl/redirect/"]',
    'a[href^="http://www.trizer.pl/?utm_source"]',
    'div#skapiec_ad',
  ],
  ro: [
    'a[href^="//afftrk.altex.ro/Counter/Click"]',
    'a[href^="/magazin/"]',
    'a[href^="https://blackfridaysales.ro/trk/shop/"]',
    'a[href^="https://event.2performant.com/events/click"]',
    'a[href^="https://l.profitshare.ro/"]',
  ],
  ruAd: [
    'a[href*="//febrare.ru/"]',
    'a[href*="//utimg.ru/"]',
    'a[href*="://chikidiki.ru"]',
    '#pgeldiz',
    '.yandex-rtb-block',
  ],
  thaiAds: ['a[href*=macau-uta-popup]', '#ads-google-middle_rectangle-group', '.ads300s', '.bumq', '.img-kosana'],
  webAnnoyancesUltralist: [
    '#mod-social-share-2',
    '#social-tools',
    '.ctpl-fullbanner',
    '.zergnet-recommend',
    '.yt.btn-link.btn-md.btn',
  ],
}

describe('Sources', () => {
  describe('domBlockers', () => {
    describe('filter list', () => {
      it('has only valid selectors', () => {
        for (const filterName of Object.keys(filters) as Array<keyof typeof filters>) {
          for (const selector of filters[filterName]) {
            const selectorWithNoAllowedSpaces = selector.trim().replace(/\[.*?\]/g, '[]')
            expect(selectorWithNoAllowedSpaces)
              .withContext(`Unexpected complex selector '${selector}'`)
              .not.toContain(' ')

            const [, attributes] = parseSimpleCssSelector(selector)
            for (const name of Object.keys(attributes)) {
              if (name !== 'class') {
                expect(attributes[name].length)
                  .withContext(
                    `Selector '${selector}' has a duplicating attribute '${name}'. ` +
                      `Please rewrite it so that the attribute doesn't repeat ` +
                      `and a DOM element created from the rewritten selector matches the original selector.`,
                  )
                  .toBeLessThanOrEqual(1)
              }
            }
          }
        }
      })

      it('has no duplicates', () => {
        const selectors = new Set<string>()

        for (const filterName of Object.keys(filters) as Array<keyof typeof filters>) {
          for (const selector of filters[filterName]) {
            expect(selectors.has(selector)).withContext(`Duplicating selector '${selector}'`).toBe(false)
            selectors.add(selector)
          }
        }
      })
    })

    it('should equal using decode', async function () {
      const selectors = new Set<string>()
      for (const filterName of Object.keys(testFilters) as Array<keyof typeof testFilters>) {
        for (const selector of testFilters[filterName]) {
          selectors.add(selector)
        }
      }

      for (const filterName of Object.keys(filters) as Array<keyof typeof filters>) {
        for (const selector of filters[filterName]) {
          expect(selectors.has(selector)).withContext(`Duplicating selector '${selector}'`).toBe(true)
        }
      }
    })

    it('returns `undefined` for unsupported browsers', async () => {
      if (isApplicable()) {
        pending('The case is for unsupported browsers only')
      }

      expect(await getDomBlockers()).toBeUndefined()
    })

    it('handles absence of blockers', async () => {
      if (!isApplicable()) {
        pending('The case is for supported browsers only')
      }

      expect(await getDomBlockers())
        .withContext(
          'The browser must have no content blocked in tests. Please disable the content blockers for Karma.',
        )
        .toEqual([])
    })

    it('handles blocked selectors', async () => {
      if (!isApplicable()) {
        pending('The case is for supported browsers only')
      }

      await withBlockedSelectors(
        [
          ...filters.frellwitSwedish.slice(0, 2),
          ...filters.easyListCookie.slice(0, 3),
          ...filters.listKr,
          ...filters.adGuardBase,
          ...filters.adGuardMobile,
          ...filters.adBlockPersian.slice(0, 1),
          ...filters.iDontCareAboutCookies.slice(0, 1),
          ...filters.easyListCzechSlovak.slice(0, 2),
        ],
        async () => {
          expect(await getDomBlockers()).toEqual(['adGuardBase', 'adGuardMobile', 'easyListCookie', 'listKr'])
        },
      )
    })
  })
})
