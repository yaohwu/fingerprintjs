import { isAndroid, isWebKit } from '../utils/browser'
import { selectorToElement } from '../utils/dom'
import { countTruthy } from '../utils/data'
import { wait } from '../utils/async'
import { decode } from '../utils/base64'

/**
 * Only single element selector are supported (no operators like space, +, >, etc).
 * `embed` and `position: fixed;` will be considered as blocked anyway because it always has no offsetParent.
 * Avoid `iframe` and anything with `[src=]` because they produce excess HTTP requests.
 *
 * See docs/content_blockers.md to learn how to make the list
 */

export const filters = {
  abpIndo: [
    decode('I0lrbGFuLU1lbGF5YW5n'),
    decode('I0tvbG9tLUlrbGFuLTcyOA=='),
    decode('I1NpZGViYXJJa2xhbi13cmFwcGVy'),
    decode('YVt0aXRsZT0iN25hZ2EgcG9rZXIiIGld'),
    decode('W3RpdGxlPSJBTElFTkJPTEEiIGld'),
  ],
  abpvn: [
    decode('I3F1YW5nY2FvbWI='),
    decode('Lmktc2FpZC1uby10aGluZy1jYW4tc3RvcC1tZS13YXJuaW5nLmRhcms='),
    decode('LnF1YW5nY2Fv'),
    decode('W2hyZWZePSJodHRwczovL3I4OC52bi8iXQ=='),
    decode('W2hyZWZePSJodHRwczovL3piZXQudm4vIl0='),
  ],
  adBlockFinland: [
    decode('Lm1haW5vc3RpbGE='),
    decode('LnNwb25zb3JpdA=='),
    decode('LnlsYW1haW5vcw=='),
    decode('YVtocmVmKj0iL2NsaWNrdGhyZ2guYXNwPyJd'),
    decode('YVtocmVmXj0iaHR0cHM6Ly9hcHAucmVhZHBlYWsuY29tL2FkcyJd'),
  ],
  adBlockPersian: [
    decode('I25hdmJhcl9ub3RpY2VfNTA='),
    decode('YVtocmVmXj0iaHR0cHM6Ly9pcW9wdGlvbi5jb20vbHAvbW9iaWxlLXBhcnRuZXIvP2FmZj0iXQ=='),
    decode('LmthZHI='),
    decode('VEFCTEVbd2lkdGg9IjE0MHB4Il0='),
    decode('I2RpdkFnYWhp'),
  ],
  adBlockWarningRemoval: [
    decode('I2FkYmxvY2tfbWVzc2FnZQ=='),
    decode('LmFkYmxvY2tJbmZv'),
    decode('LmRlYWRibG9ja2VyLWhlYWRlci1iYXI='),
    decode('Lm5vLWFkLXJlbWluZGVy'),
    decode('I0FkQmxvY2tEaWFsb2c='),
  ],
  adGuardAnnoyances: [
    decode('YW1wLWVtYmVkW3R5cGU9InplbiJd'),
    decode('LmhzLXNvc3lhbA=='),
    decode('I2Nvb2tpZWNvbnNlbnRkaXY='),
    decode('ZGl2W2NsYXNzXj0iYXBwX2dkcHIiXQ=='),
    decode('LmFzLW9pbA=='),
  ],
  adGuardBase: [
    decode('I2dhZHNfbWlkZGxl'),
    decode('LnRqYWRz'),
    decode('LkJldHRlckpzUG9wT3ZlcmxheQ=='),
    decode('I2FkXzMwMFgyNTA='),
    decode('I2Jhbm5lcmZsb2F0MjI='),
  ],
  adGuardChinese: [
    decode('YVtocmVmKj0iLjEyM2NoLmNuIl0='),
    decode('YVtocmVmKj0iLnR0ejUuY24iXQ=='),
    decode('YVtocmVmKj0iLnlhYm92aXAyMDI3LmNvbS8iXQ=='),
    decode('LnRtM2FsbDJoNGI='),
    decode('I2otbmV3LWFk'),
  ],
  adGuardFrench: [
    decode('I2Rpdl9iYW5uaWVyZV9wdWI='),
    decode('YVtocmVmXj0iaHR0cHM6Ly9zZWN1cmUuc2VjdXJpdGV0b3RhbGUuZnIvIl0='),
    decode('YVtocmVmKj0iZmR1Y2tzLmNvbS8iXQ=='),
    decode('YVtocmVmXj0iaHR0cDovL2ZydHlkLmNvbS8iXQ=='),
    decode('LnB1YmxpY2l0ZTE='),
  ],
  adGuardGerman: [
    decode('LmJhbm5lcml0ZW13ZXJidW5nX2hlYWRfMQ=='),
    decode('LmJveHN0YXJ0d2VyYnVuZw=='),
    decode('LndlcmJ1bmcz'),
    decode('YVtocmVmXj0iaHR0cDovL3d3dy5pY2h3dWVyZGUuY29tLz9yZWY9Il0='),
    decode('YVtocmVmXj0iaHR0cDovL3BhcnRuZXJzLmFka2xpY2suZGUvdHJhY2tpbmcucGhwPyJd'),
  ],
  adGuardJapanese: [
    decode('LmFkLXRleHQtYmxvY2tBMDE='),
    decode('Ll9wb3BJbl9pbmZpbml0ZV92aWRlbw=='),
    decode('W2NsYXNzXj1ibG9ncm9sbF93cmFwcGVyXQ=='),
    decode('YVtocmVmXj0iaHR0cDovL2FkMi50cmFmZmljZ2F0ZS5uZXQvIl0='),
    decode('YVtocmVmXj0iaHR0cDovL3d3dy5yc3NhZC5qcC8iXQ=='),
  ],
  adGuardMobile: [
    decode('YW1wLWF1dG8tYWRz'),
    decode('I21naWRfaWZyYW1l'),
    decode('LmFtcF9hZA=='),
    decode('YW1wLXN0aWNreS1hZA=='),
    decode('LnBsdWdpbi1ibG9ncm9sbA=='),
  ],
  adGuardRussian: [
    decode('YVtocmVmXj0iaHR0cHM6Ly95YS1kaXN0cmliLnJ1L3IvIl0='),
    decode('W29uY2xpY2sqPSIudHdrdi5ydSJd'),
    decode('LnJlY2xhbWE='),
    decode('ZGl2W2lkXj0ic21pMmFkYmxvY2siXQ=='),
    decode('ZGl2W2lkXj0iQWRGb3hfYmFubmVyXyJd'),
  ],
  adGuardSocial: [
    decode('YVtocmVmXj0iLy93d3cuc3R1bWJsZXVwb24uY29tL3N1Ym1pdD91cmw9Il0='),
    decode('YVtocmVmXj0iLy90ZWxlZ3JhbS5tZS9zaGFyZS91cmw/Il0='),
    decode('LmV0c3ktdHdlZXQ='),
    decode('I2lubGluZVNoYXJl'),
    decode('LnBvcHVwLXNvY2lhbA=='),
  ],
  adGuardSpanishPortuguese: [
    decode('I2JhcnJhUHVibGljaWRhZGU='),
    decode('I1B1YmxpY2lkYWRl'),
    decode('I3B1YmxpRXNwZWNpYWw='),
    decode('I3F1ZVRvb2x0aXA='),
    decode('W2hyZWZePSJodHRwOi8vYWRzLmdsaXNwYS5jb20vIl0='),
  ],
  adGuardTrackingProtection: [
    decode('YW1wLWVtYmVkW3R5cGU9InRhYm9vbGEiXQ=='),
    decode('I3Fvby1jb3VudGVy'),
    decode('YVtocmVmXj0iaHR0cDovL2NsaWNrLmhvdGxvZy5ydS8iXQ=='),
    decode('YVtocmVmXj0iaHR0cDovL2hpdGNvdW50ZXIucnUvdG9wL3N0YXQucGhwIl0='),
    decode('YVtocmVmXj0iaHR0cDovL3RvcC5tYWlsLnJ1L2p1bXAiXQ=='),
  ],
  adGuardTurkish: [
    decode('I2JhY2trYXBhdA=='),
    decode('I3Jla2xhbWk='),
    decode('YVtocmVmXj0iaHR0cDovL2Fkc2Vydi5vbnRlay5jb20udHIvIl0='),
    decode('YVtocmVmXj0iaHR0cDovL2l6bGVuemkuY29tL2NhbXBhaWduLyJd'),
    decode('YVtocmVmXj0iaHR0cDovL3d3dy5pbnN0YWxsYWRzLm5ldC8iXQ=='),
  ],
  bulgarian: [
    decode('dGQjZnJlZW5ldF90YWJsZV9hZHM='),
    decode('I25ld0Fk'),
    decode('I2VhX2ludGV4dF9kaXY='),
    decode('LmxhcG5pLXBvcC1vdmVy'),
    decode('I3hlbml1bV9ob3Rfb2ZmZXJz'),
  ],
  easyList: [
    decode('W2xhenktYWQ9ImxlZnR0aGluX2Jhbm5lciJd'),
    decode('I2FkXzMwMHgyNTBfMg=='),
    decode('I2ludGVyc3RpdGlhbEFk'),
    decode('I3dpZGVfYWRfdW5pdA=='),
    decode('LnNob3djYXNlQWQ='),
  ],
  easyListChina: [
    decode('YVtocmVmKj0iLndlbnNpeHVldGFuZy5jb20vIl0='),
    decode('QVtocmVmKj0iL2h0aDEwNy5jb20vIl0='),
    decode('LmFwcGd1aWRlLXdyYXBbb25jbGljayo9ImJjZWJvcy5jb20iXQ=='),
    decode('LmZyb250cGFnZUFkdk0='),
    decode('I3Rhb3Rhb2xl'),
  ],
  easyListCookie: [
    decode('I0Nvb2tpZUVV'),
    decode('I19fY29va2llc18='),
    decode('I2xlc19jb29raWVz'),
    decode('LmFzc2V0X2JhbGFOb3RpZmljYXRpb24='),
    decode('LmdkcHItdGFi'),
  ],
  easyListCzechSlovak: [
    decode('I29ubGFqbnktc3RpY2tlcnM='),
    decode('I3Jla2xhbW5pLWJveA=='),
    decode('LnJla2xhbWEtbWVnYWJvYXJk'),
    decode('LnNrbGlr'),
    decode('W2lkXj0ic2tsaWtSZWtsYW1hIl0='),
  ],
  easyListDutch: [
    decode('I2FkdmVydGVudGll'),
    decode('I3ZpcEFkbWFya3RCYW5uZXJCbG9jaw=='),
    decode('LmFkc3Rla3N0'),
    decode('YVtocmVmXj0iaHR0cDovL2Fkc2VydmVyLndlYmFkcy5ubC9hZGNsaWNrLyJd'),
    decode('I3NlbWlsby1scmVjdGFuZ2xl'),
  ],
  easyListGermany: [
    decode('I0x4V2VyYmV0ZWFzZXI='),
    decode('YVtocmVmXj0iaHR0cDovL3d3dy5rb250YWt0LXZlcm1pdHRsZXIuZGUvP3dtPSJd'),
    decode('LndlcmJ1bmczMDE='),
    decode('LmFkc19idWVyb2tsYW1tZXI='),
    decode('I1dlcmJ1bmdfU2t5'),
  ],
  easyListItaly: [
    decode('LmJveF9hZHZfYW5udW5jaQ=='),
    decode('LnNiLWJveC1wdWJibGlyZWRhemlvbmFsZQ=='),
    decode('YVtocmVmXj0iaHR0cDovL2FmZmlsaWF6aW9uaWFkcy5zbmFpLml0LyJd'),
    decode('YVtocmVmXj0iaHR0cHM6Ly9hZHNlcnZlci5odG1sLml0LyJd'),
    decode('YVtocmVmXj0iaHR0cHM6Ly9hZmZpbGlhemlvbmlhZHMuc25haS5pdC8iXQ=='),
  ],
  easyListLithuania: [
    decode('LnJla2xhbW9zX3RhcnBhcw=='),
    decode('LnJla2xhbW9zX251b3JvZG9z'),
    decode('aW1nW2FsdD0iUmVrbGFtaW5pcyBza3lkZWxpcyJd'),
    decode('aW1nW2FsdD0iRGVkaWt1b3RpLmx0IHNlcnZlcmlhaSJd'),
    decode('aW1nW2FsdD0iSG9zdGluZ2FzIFNlcnZlcmlhaS5sdCJd'),
  ],
  estonian: [decode('QVtocmVmKj0iaHR0cDovL3BheTRyZXN1bHRzMjQuZXUiXQ==')],
  fanboyAnnoyances: [
    decode('I2ZlZWRiYWNrLXRhYg=='),
    decode('I3RhYm9vbGEtYmVsb3ctYXJ0aWNsZQ=='),
    decode('LmZlZWRidXJuZXJGZWVkQmxvY2s='),
    decode('LndpZGdldC1mZWVkYnVybmVyLWNvdW50ZXI='),
    decode('W3RpdGxlPSJTdWJzY3JpYmUgdG8gb3VyIGJsb2ciXQ=='),
  ],
  fanboyAntiFacebook: [decode('LnV0aWwtYmFyLW1vZHVsZS1maXJlZmx5LXZpc2libGU=')],
  fanboyEnhancedTrackers: [
    decode('Lm9wZW4ucHVzaE1vZGFs'),
    decode('I2lzc3VlbS1sZWFreS1wYXl3YWxsLWFydGljbGVzLXplcm8tcmVtYWluaW5nLW5hZw=='),
    decode('ZGl2W3N0eWxlKj0iYm94LXNoYWRvdzogcmdiKDEzNiwgMTM2LCAxMzYpIDBweCAwcHggMTJweDsgY29sb3I6ICJd'),
    decode('ZGl2W2NsYXNzJD0iLWhpZGUiXVt6b29tcGFnZS1mb250c2l6ZV1bc3R5bGU9ImRpc3BsYXk6IGJsb2NrOyJd'),
    decode('LkJsb2NrTmFnX19DYXJk'),
  ],
  fanboySocial: [
    decode('LnRkLXRhZ3MtYW5kLXNvY2lhbC13cmFwcGVyLWJveA=='),
    decode('LnR3aXR0ZXJDb250YWluZXI='),
    decode('LnlvdXR1YmUtc29jaWFs'),
    decode('YVt0aXRsZV49Ikxpa2UgdXMgb24gRmFjZWJvb2siXQ=='),
    decode('aW1nW2FsdF49IlNoYXJlIG9uIERpZ2ciXQ=='),
  ],
  frellwitSwedish: [
    decode('YVtocmVmKj0iY2FzaW5vcHJvLnNlIl1bdGFyZ2V0PSJfYmxhbmsiXQ=='),
    decode('YVtocmVmKj0iZG9rdG9yLXNlLm9uZWxpbmsubWUiXQ=='),
    decode('YXJ0aWNsZS5jYXRlZ29yeS1zYW1hcmJldGU='),
    decode('ZGl2LmhvbGlkQWRz'),
    decode('dWwuYWRzbW9kZXJu'),
  ],
  greekAdBlock: [
    decode('QVtocmVmKj0iYWRtYW4ub3RlbmV0LmdyL2NsaWNrPyJd'),
    decode('QVtocmVmKj0iaHR0cDovL2F4aWFiYW5uZXJzLmV4b2R1cy5nci8iXQ=='),
    decode('QVtocmVmKj0iaHR0cDovL2ludGVyYWN0aXZlLmZvcnRobmV0LmdyL2NsaWNrPyJd'),
    decode('RElWLmFnb3JlczMwMA=='),
    decode('VEFCTEUuYWR2cmlnaHQ='),
  ],
  hungarian: [
    decode('QVtocmVmKj0iYWQuZXZhbC5odSJd'),
    decode('QVtocmVmKj0iYWQubmV0bWVkaWEuaHUiXQ=='),
    decode('QVtocmVmKj0iZGFzZXJ2ZXIudWx0cmF3ZWIuaHUiXQ=='),
    decode('I2NlbXBfZG9ib3o='),
    decode('Lm9wdGltb25rLWlmcmFtZS1jb250YWluZXI='),
  ],
  iDontCareAboutCookies: [
    decode('LmFsZXJ0LWluZm9bZGF0YS1ibG9jay10cmFjayo9IkNvb2tpZU5vdGljZSJd'),
    decode('Lk1vZHVsZVRlbXBsYXRlQ29va2llSW5kaWNhdG9y'),
    decode('Lm8tLWNvb2tpZXMtLWNvbnRhaW5lcg=='),
    decode('LmNvb2tpZS1tc2ctaW5mby1jb250YWluZXI='),
    decode('I2Nvb2tpZXMtcG9saWN5LXN0aWNreQ=='),
  ],
  icelandicAbp: [decode('QVtocmVmXj0iL2ZyYW1ld29yay9yZXNvdXJjZXMvZm9ybXMvYWRzLmFzcHgiXQ==')],
  latvian: [
    decode(
      'YVtocmVmPSJodHRwOi8vd3d3LnNhbGlkemluaS5sdi8iXVtzdHlsZT0iZGlzcGxheTogYmxvY2s7IHdpZHRoOiAxMjBweDsgaGVpZ2h0OiA0MHB4OyBvdmVyZmxvdzogaGlkZGVuOyBwb3NpdGlvbjogcmVsYXRpdmU7Il0=',
    ),
    decode(
      'YVtocmVmPSJodHRwOi8vd3d3LnNhbGlkemluaS5sdi8iXVtzdHlsZT0iZGlzcGxheTogYmxvY2s7IHdpZHRoOiA4OHB4OyBoZWlnaHQ6IDMxcHg7IG92ZXJmbG93OiBoaWRkZW47IHBvc2l0aW9uOiByZWxhdGl2ZTsiXQ==',
    ),
  ],
  listKr: [
    decode('YVtocmVmKj0iLy9raW5ndG9vbi5zbG5rLmtyIl0='),
    decode('YVtocmVmKj0iLy9wbGF5ZHNiLmNvbS9rciJd'),
    decode('ZGl2LmxvZ2x5LWxpZnQtYWR6'),
    decode('ZGl2W2RhdGEtd2lkZ2V0X2lkPSJtbDZFSjA3NCJd'),
    decode('aW5zLmRhdW1fZGRuX2FyZWE='),
  ],
  listeAr: [
    decode('LmdlbWluaUxCMUFk'),
    decode('LnJpZ2h0LWFuZC1sZWZ0LXNwb25zZXJz'),
    decode('YVtocmVmKj0iLmFmbGFtLmluZm8iXQ=='),
    decode('YVtocmVmKj0iYm9vcmFxLm9yZyJd'),
    decode('YVtocmVmKj0iZHViaXp6bGUuY29tL2FyLz91dG1fc291cmNlPSJd'),
  ],
  listeFr: [
    decode('YVtocmVmXj0iaHR0cDovL3Byb21vLnZhZG9yLmNvbS8iXQ=='),
    decode('I2FkY29udGFpbmVyX3JlY2hlcmNoZQ=='),
    decode('YVtocmVmKj0id2Vib3JhbWEuZnIvZmNnaS1iaW4vIl0='),
    decode('LnNpdGUtcHViLWludGVyc3RpdGllbA=='),
    decode('ZGl2W2lkXj0iY3J0LSJdW2RhdGEtY3JpdGVvLWlkXQ=='),
  ],
  officialPolish: [
    decode('I2NlbmVvLXBsYWNlaG9sZGVyLWNlbmVvLTEy'),
    decode('W2hyZWZePSJodHRwczovL2FmZi5zZW5kaHViLnBsLyJd'),
    decode('YVtocmVmXj0iaHR0cDovL2Fkdm1hbmFnZXIudGVjaGZ1bi5wbC9yZWRpcmVjdC8iXQ=='),
    decode('YVtocmVmXj0iaHR0cDovL3d3dy50cml6ZXIucGwvP3V0bV9zb3VyY2UiXQ=='),
    decode('ZGl2I3NrYXBpZWNfYWQ='),
  ],
  ro: [
    decode('YVtocmVmXj0iLy9hZmZ0cmsuYWx0ZXgucm8vQ291bnRlci9DbGljayJd'),
    decode('YVtocmVmXj0iL21hZ2F6aW4vIl0='),
    decode('YVtocmVmXj0iaHR0cHM6Ly9ibGFja2ZyaWRheXNhbGVzLnJvL3Ryay9zaG9wLyJd'),
    decode('YVtocmVmXj0iaHR0cHM6Ly9ldmVudC4ycGVyZm9ybWFudC5jb20vZXZlbnRzL2NsaWNrIl0='),
    decode('YVtocmVmXj0iaHR0cHM6Ly9sLnByb2ZpdHNoYXJlLnJvLyJd'),
  ],
  ruAd: [
    decode('YVtocmVmKj0iLy9mZWJyYXJlLnJ1LyJd'),
    decode('YVtocmVmKj0iLy91dGltZy5ydS8iXQ=='),
    decode('YVtocmVmKj0iOi8vY2hpa2lkaWtpLnJ1Il0='),
    decode('I3BnZWxkaXo='),
    decode('LnlhbmRleC1ydGItYmxvY2s='),
  ],
  thaiAds: [
    decode('YVtocmVmKj1tYWNhdS11dGEtcG9wdXBd'),
    decode('I2Fkcy1nb29nbGUtbWlkZGxlX3JlY3RhbmdsZS1ncm91cA=='),
    decode('LmFkczMwMHM='),
    decode('LmJ1bXE='),
    decode('LmltZy1rb3NhbmE='),
  ],
  webAnnoyancesUltralist: [
    decode('I21vZC1zb2NpYWwtc2hhcmUtMg=='),
    decode('I3NvY2lhbC10b29scw=='),
    decode('LmN0cGwtZnVsbGJhbm5lcg=='),
    decode('LnplcmduZXQtcmVjb21tZW5k'),
    decode('Lnl0LmJ0bi1saW5rLmJ0bi1tZC5idG4='),
  ],
}

/** Just a syntax sugar */
const filterNames = Object.keys(filters) as Array<keyof typeof filters>

interface Options {
  debug?: boolean
}

/**
 * The returned array order means nothing (it's always sorted alphabetically).
 *
 * Notice that the source is slightly unstable.
 * Safari provides a 2-taps way to disable all content blockers on a page temporarily.
 * Also content blockers can be disabled permanently for a domain, but it requires 4 taps.
 * So empty array shouldn't be treated as "no blockers", it should be treated as "no signal".
 * If you are a website owner, don't make your visitors want to disable content blockers.
 */
export default async function getDomBlockers({ debug }: Options = {}): Promise<string[] | undefined> {
  if (!isApplicable()) {
    return undefined
  }

  const allSelectors = ([] as string[]).concat(...filterNames.map((filterName) => filters[filterName]))
  const blockedSelectors = await getBlockedSelectors(allSelectors)

  if (debug) {
    printDebug(blockedSelectors)
  }

  const activeBlockers = filterNames.filter((filterName) => {
    const selectors = filters[filterName]
    const blockedCount = countTruthy(selectors.map((selector) => blockedSelectors[selector]))
    return blockedCount > selectors.length * 0.5
  })
  activeBlockers.sort()

  return activeBlockers
}

export function isApplicable(): boolean {
  // Safari (desktop and mobile) and all Android browsers keep content blockers in both regular and private mode
  return isWebKit() || isAndroid()
}

export async function getBlockedSelectors<T extends string>(selectors: readonly T[]): Promise<{ [K in T]?: true }> {
  const d = document
  const root = d.createElement('div')
  const elements = new Array<HTMLElement>(selectors.length)
  const blockedSelectors: { [K in T]?: true } = {} // Set() isn't used just in case somebody need older browser support

  forceShow(root)

  // First create all elements that can be blocked. If the DOM steps below are done in a single cycle,
  // browser will alternate tree modification and layout reading, that is very slow.
  for (let i = 0; i < selectors.length; ++i) {
    const element = selectorToElement(selectors[i])
    const holder = d.createElement('div') // Protects from unwanted effects of `+` and `~` selectors of filters
    forceShow(holder)
    holder.appendChild(element)
    root.appendChild(holder)
    elements[i] = element
  }

  // document.body can be null while the page is loading
  while (!d.body) {
    await wait(50)
  }
  d.body.appendChild(root)

  try {
    // Then check which of the elements are blocked
    for (let i = 0; i < selectors.length; ++i) {
      if (!elements[i].offsetParent) {
        blockedSelectors[selectors[i]] = true
      }
    }
  } finally {
    // Then remove the elements
    root.parentNode?.removeChild(root)
  }

  return blockedSelectors
}

function forceShow(element: HTMLElement) {
  element.style.setProperty('display', 'block', 'important')
}

function printDebug(blockedSelectors: { [K in string]?: true }) {
  let message = 'DOM blockers debug:\n```'
  for (const filterName of filterNames) {
    message += `\n${filterName}:`
    for (const selector of filters[filterName]) {
      message += `\n  ${selector} ${blockedSelectors[selector] ? '🚫' : '➡️'}`
    }
  }
  // console.log is ok here because it's under a debug clause
  // eslint-disable-next-line no-console
  console.log(`${message}\n\`\`\``)
}
