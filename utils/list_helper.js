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
    return undefined
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

const mostBlogs = (blogs) => {
  if(blogs.length === 0) {
    return undefined
  }
  let numOfBlogs = {}

  blogs.forEach(blog => {
    numOfBlogs[blog.author] = (numOfBlogs[blog.author] ? numOfBlogs[blog.author] : 0) + 1
  })

  let mostBloggedAuthor = null

  for(let author in numOfBlogs) {
    if(!mostBloggedAuthor || numOfBlogs[author] > mostBloggedAuthor.blogs) {
      mostBloggedAuthor = {
        author: author,
        blogs: numOfBlogs[author]
      }
    }
  }

  return mostBloggedAuthor
}

const mostLikes = (blogs) => {
  if(blogs.length === 0) {
    return undefined
  }

  let likes = {}

  blogs.forEach(blog => {
    likes[blog.author] = (likes[blog.author] ? likes[blog.author] : 0) + blog.likes
  })

  let mostLikedAuthor = null

  for(let author in likes) {
    if(!mostLikedAuthor || likes[author] > mostLikedAuthor.likes) {
      mostLikedAuthor = {
        author: author,
        likes: likes[author]
      }
    }
  }

  return mostLikedAuthor
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostLikes,
  mostBlogs
}