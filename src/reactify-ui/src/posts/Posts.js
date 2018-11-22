import React, { Component } from 'react'
import 'whatwg-fetch'
import cookie from 'react-cookies'

import PostInline from './PostInline'
import PostUpdate from './PostUpdate'

class Posts extends Component {
  constructor (props) {
    super(props)
    this.togglePostListClass = this.togglePostListClass.bind(this)
    this.handleNewPost = this.handleNewPost.bind(this)
    this.state = {
      posts: [],
      postsListClass: 'card'
    }
  }

  loadPosts () {
    const endpoint = '/api/posts/'
    let thisComponent = this
    let lookupOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    fetch(endpoint, lookupOptions)
      .then(function (response) {
        return response.json()
      }).then(function (responseData) {
        console.log(responseData)
        // here this !== thisComp
        // thus we define 'this' outside this blog
        thisComponent.setState({
          posts: responseData
        })
      }).catch(function (error) {
        console.log('error', error)
      })
  }

  togglePostListClass (event) {
    event.preventDefault()
    const currentListClass = this.state.postsListClass
    if (currentListClass === '') {
      this.setState({
        postsListClass: 'card'
      })
    } else {
      this.setState({
        postsListClass: ''
      })
    }
  }

  handleNewPost (postItemData) {
    console.log(postItemData)
    let currentPosts = this.state.posts
    currentPosts.unshift(postItemData) // unshift prepends new data to the list
    this.setState({
      posts: currentPosts
    })
  }

  componentDidMount () {
    this.setState({ // this eliminates the need to define state at the beginning of the class
      posts: [],
      postsListClass: 'card'
    })
    this.loadPosts()
  }

  render () {
    const { posts } = this.state
    const { postsListClass } = this.state
    const csrfToken = cookie.load('csrftoken')
    return (
      <div>
        <h1>Hello World!</h1>
        <button onClick={this.togglePostListClass}>Toggle class</button>
        {posts.length > 0 ? posts.map((postItem, index) => {
          return (
            <PostInline post={postItem} elementClass={postsListClass} />
          )
        }) : <p>No posts found.</p>}
        {(csrfToken !== undefined && csrfToken !== null) ?
          <div className='my-5'>
            <PostUpdate newPostItemCreated={this.handleNewPost} />
          </div>
          : ''
        }
      </div>
    )
  }
}

export default Posts
