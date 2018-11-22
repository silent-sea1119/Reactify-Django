import React, { Component } from 'react'
import 'whatwg-fetch'
import cookie from 'react-cookies'
import { Link } from 'react-router-dom'

import PostInline from './PostInline'

class Posts extends Component {
  constructor (props) {
    super(props)
    this.togglePostListClass = this.togglePostListClass.bind(this)
    this.handleNewPost = this.handleNewPost.bind(this)
    this.loadMorePosts = this.loadMorePosts.bind(this)
    this.state = {
      posts: [],
      postsListClass: 'card',
      next: null,
      previous: null,
      author: false,
      count: 0
    }
  }

  loadMorePosts () {
    const { next } = this.state
    if (next !== null || next !== undefined) {
      this.loadPosts(next)
    }
  }

  loadPosts (nextEndpoint) {
    let endpoint = '/api/posts/'
    if (nextEndpoint !== undefined) {
      endpoint = nextEndpoint
    }
    let thisComponent = this
    let lookupOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const csrfToken = cookie.load('csrftoken')
    if (csrfToken !== undefined) {
      lookupOptions['credentials'] = 'include'
      lookupOptions['headers']['X-CSRFToken'] = csrfToken
    }

    fetch(endpoint, lookupOptions)
      .then(function (response) {
        return response.json()
      }).then(function (responseData) {
        console.log(responseData)
        let currentPosts = thisComponent.state.posts // after loading more posts, we still want to see the older ones
        let newPosts = currentPosts.concat(responseData.results)
        thisComponent.setState({
          posts: newPosts,
          next: responseData.next,
          previous: responseData.previous,
          author: responseData.author,
          count: responseData.count
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
      postsListClass: 'card',
      next: null,
      previous: null,
      author: false,
      count: 0
    })
    this.loadPosts()
  }

  render () {
    const { posts } = this.state
    const { postsListClass } = this.state
    const { author } = this.state
    const { next } = this.state
    return (
      <div>
        {author === true ? <Link className='mr-2' maintainScrollPosition={false} to={{
          pathname: `/posts/create/`,
          state: { fromDashboard: false }
        }}>Create Post</Link> : ''}
        <button onClick={this.togglePostListClass}>Toggle class</button>
        {posts.length > 0 ? posts.map((postItem, index) => {
          return (
            <PostInline post={postItem} elementClass={postsListClass} />
          )
        }) : <p>No posts found.</p>}
        {next !== null ? <button onClick={this.loadMorePosts}>Load More</button> : ''}
      </div>
    )
  }
}

export default Posts
