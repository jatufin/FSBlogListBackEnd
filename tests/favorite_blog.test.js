const totalLikes = require('../utils/list_helper').favoriteBlog

const initialBlogs = require('./test_data').initialBlogs

describe('favoriteBlog', () => {
  test('of empty list is undefined', () => {
    expect(totalLikes([])).toBe(undefined)
  })

  test('when list has only one blog equals to that', () => {
    expect(totalLikes([initialBlogs[0]])).toEqual(
    {
      title: "React patterns",
      author: "Michael Chan",
      likes: 7
    })
  })

  test('of a bigger list returns correct item', () => {
    expect(totalLikes(initialBlogs)).toEqual(
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12
    })
  })
})