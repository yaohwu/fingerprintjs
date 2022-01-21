/**
 * Only single element selector are supported (no operators like space, +, >, etc).
 * `embed` and `position: fixed;` will be considered as blocked anyway because it always has no offsetParent.
 * Avoid `iframe` and anything with `[src=]` because they produce excess HTTP requests.
 *
 * See docs/content_blockers.md to learn how to make the list
 */
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
  if (debug) {
    // console.log is ok here because it's under a debug clause
    // eslint-disable-next-line no-console
    console.log('using fake dom blockers for strict security rules')
  }
  // fake dom blokers always return undefined
  return undefined
}
