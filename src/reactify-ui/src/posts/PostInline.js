import React, { Component } from 'react'

class PostInline extends Component {
  render () {
    const { post } = this.props
    const { elementClass } = this.props
    const showContent = elementClass === 'card' ? 'd-block' : 'd-none'
    return (
      <div>
        {post !== undefined ? <div className={elementClass}>
          <h1>{post.title}</h1>
          <p className={showContent}>{post.content}</p>
        </div> : ''}
      </div>
    )
  }
}

export default PostInline
