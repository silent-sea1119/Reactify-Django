import React, { Component } from 'react'

class PostDetail extends Component {
  constructor (props) {
    super(props)
    this.state = {
      slug: null
    }
  }
  componentDidMount () {
    if (this.props.match) {
      // A match object contains information about how a <Route path> matched the URL
      const { slug } = this.props.match.params
      this.setState({
        slug: slug
      })
    }
  }

  render () {
    const { slug } = this.state
    return (
      <p>{slug !== null ? <div>{slug}</div> : 'Not found'}</p>
    )
  }
}

export default PostDetail
