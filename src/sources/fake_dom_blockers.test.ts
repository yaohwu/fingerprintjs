import getDomBlockers from './fake_dom_blockers'

describe('Sources', () => {
  describe('fakeDomBlockers', () => {
    it('fake dom blockers component always return undefined', async function () {
      expect(await getDomBlockers()).toBeUndefined()
    })
  })
})
