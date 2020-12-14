const mostBlogs = require('../utils/list_helper').mostBlogs
const initialBlogs = require('./test_data').initialBlogs

describe('mostBlogs', () => {
  test('of empty list is undefined', () => {
    expect(mostBlogs([])).toBe(undefined)
  })

  test('when list has only one blog equals to that', () => {
    expect(mostBlogs([initialBlogs[0]])).toEqual(
    {
      author: "Michael Chan",
      blogs: 1
    })
  })

  test('of a bigger list returns correct item', () => {
    expect(mostBlogs(initialBlogs)).toEqual(
    {
        author: "Robert C. Martin",
        blogs: 3
    })
  })

})