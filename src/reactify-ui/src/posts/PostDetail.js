import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import cookie from 'react-cookies'
import 'whatwg-fetch'

import PostForm from './PostForm'

class PostDetail extends Component {
  constructor (props) {
    super(props)
    this.handlePostItemUpdated = this.handlePostItemUpdated.bind(this)
    this.state = {
      slug: null,
      post: null,
      doneLoading: false
    }
  }

  handlePostItemUpdated (postItemData) {
    this.setState({
      post: postItemData
    })
  }

  loadPost (slug) {
    const endpoint = `/api/posts/${slug}/`
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
        if (response.status === 404) {
          console.log('Page not found')
        }
        return response.json()
      }).then(function (responseData) {
        console.log(responseData)
        if (responseData.detail) {
          thisComponent.setState({
            post: null,
            doneLoading: true
          })
        } else {
          thisComponent.setState({
            post: responseData,
            doneLoading: true
          })
        }
      }).catch(function (error) {
        console.log('error', error)
      })
  }

  componentDidMount () {
    if (this.props.match) {
      // A match object contains information about how a <Route path> matched the URL
      const { slug } = this.props.match.params
      this.setState({
        slug: slug
      })
      this.loadPost(slug)
    }
  }

  render () {
    const { doneLoading } = this.state
    const { post } = this.state
    return (
      <p>{doneLoading === true ? <div>
        {post === null ? 'Not Found' : <div>
          <h1>{post.title}</h1>
          {post.slug}
          <p className='lead'>
            <Link maintainScrollPosition={false} to={{
              pathname: `/posts`,
              state: { fromDashboard: false }
            }}>Posts</Link>
            <Link maintainScrollPosition={false} to={{
              pathname: `/posts/create/`,
              state: { fromDashboard: false }
            }}>Create Post</Link>
          </p>
          {post.owner === true ? <PostForm post={post} postItemUpdated={this.handlePostItemUpdated} /> : ''}
        </div>}
      </div> : 'Loading...'}</p>
    )
  }
}

export default PostDetail
