const totalLikes = require('../utils/list_helper').favoriteBlog

const blogs = require('./test_data')

describe('favoriteBlog', () => {
  test('of empty list is undefined', () => {
    expect(totalLikes([])).toBe(undefined)
  })

  test(' when list has only one blog equals to that', () => {
    expect(totalLikes([blogs[0]])).toEqual({
      title: "React patterns",
      author: "Michael Chan",
      likes: 7
    })
  })

  test('of a bigger list returns correct item', () => {
    expect(totalLikes(blogs)).toEqual({
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12
    })
  })
})