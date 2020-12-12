const totalLikes = require('../utils/list_helper').totalLikes
const blogs = require('./test_data')

describe('totalLikes', () => {
  test('of empty list is zero', () => {
    expect(totalLikes([])).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    expect(totalLikes([blogs[0]])).toBe(7)
  })
  
  test('of a bigger list is calculated right', () => {
    expect(totalLikes(blogs)).toBe(36)
  })
})