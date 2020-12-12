const mostLikes = require('../utils/list_helper').mostLikes
const blogs = require('./test_data')

describe('mostLikes', () => {
  test('of empty list is undefined', () => {
    expect(mostLikes([])).toBe(undefined)
  })

  test('when list has only one blog equals to that', () => {
    expect(mostLikes([blogs[0]])).toEqual({
      author: "Michael Chan",
      likes: 7
    })
  })

  test('of a bigger list returns correct item', () => {
    expect(mostLikes(blogs)).toEqual({
      author: "Edsger W. Dijkstra",
      likes: 17
    })
  })
})
