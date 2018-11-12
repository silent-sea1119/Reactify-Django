import React, { Component } from 'react'
import 'whatwg-fetch'
import cookie from 'react-cookies'

import PostInline from './PostInline'

class Posts extends Component {
  state = {
    posts: [],
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

  createPost () {
    const endpoint = '/api/posts/'
    const csrfToken = cookie.load('csrftoken')
    let data = {
      'slug': '',
      'title': '',
      'content': '',
      'draft': false,
      'publish': null
    }

    if (csrfToken !== undefined) {
      let lookupOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken // specified in django documentation
        },
        body: JSON.stringify(data),
        credentials: 'include'
      }

      fetch(endpoint, lookupOptions)
        .then(function (response) {
          return response.json()
        }).then(function (responseData) {
          console.log(responseData)
        }).catch(function (error) {
          console.log('error', error)
        })
    }
  }

  componentDidMount () {
    this.setState({ // this eliminates the need to define state at the beginning of the class
      posts: []
    })
    this.loadPosts()
  }

  render () {
    const { posts } = this.state
    return (
      <div>
        <h1>Hello World!</h1>
        {posts.length > 0 ? posts.map((postItem, index) => {
          return (
            <PostInline post={postItem} />
          )
        }) : <p>No posts found.</p>}
      </div>
    )
  }
}

export default Posts
