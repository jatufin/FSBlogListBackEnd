const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  if(blogs.length === 0) {
    return 0
  }

  const r = (sum, blog) => {
    return sum + (blog.likes ? blog.likes : 0)
  }

  return blogs.reduce(r, 0)
}

const favoriteBlog = (blogs) => {
  if(blogs.length === 0) {
    return {}
  }

  let favorite = blogs[0]

  blogs.forEach(blog => {
    if(blog.likes > favorite.likes) {
      favorite = blog
    }
  })

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

  module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}