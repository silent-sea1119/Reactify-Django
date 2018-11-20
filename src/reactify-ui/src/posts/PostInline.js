import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class PostInline extends Component {
  render () {
    const { post } = this.props
    const { elementClass } = this.props
    const showContent = elementClass === 'card' ? 'd-block' : 'd-none'
    return (
      <div>
        {post !== undefined ? <div className={elementClass}>
          {/* We use the <a> way when we are not using react router */}
          {/* <h1><a href={`/posts/${post.slug}`}>{post.title}</a></h1> */}
          <h1><Link maintainScrollPosition={false} to={{
            pathname: `/posts/${post.slug}`,
            state: { fromDashboard: false }
          }}>{post.title}</Link></h1>
          <p className={showContent}>{post.content}</p>
        </div> : ''}
      </div>
    )
  }
}

export default PostInline
