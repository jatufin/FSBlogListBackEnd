const mostLikes = require('../utils/list_helper').mostLikes
const initialBlogs = require('./test_data').initialBlogs

describe('mostLikes', () => {
  test('of empty list is undefined', () => {
    expect(mostLikes([])).toBe(undefined)
  })

  test('when list has only one blog equals to that', () => {
    expect(mostLikes([initialBlogs[0]])).toEqual(
    {
      author: "Michael Chan",
      likes: 7
    })
  })

  test('of a bigger list returns correct item', () => {
    expect(mostLikes(initialBlogs)).toEqual(
    {
      author: "Edsger W. Dijkstra",
      likes: 17
    })
  })
})
