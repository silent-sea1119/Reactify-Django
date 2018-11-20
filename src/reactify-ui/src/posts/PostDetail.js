import React, { Component } from 'react'
import { Link } from 'react-router-dom'

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
      <p>{slug !== null ? <div>
        {slug}
        <p className='lead'><Link maintainScrollPosition={false} to={{
          pathname: `/posts`,
          state: { fromDashboard: false }
        }}>Posts</Link></p>
      </div> : 'Not found'}</p>
    )
  }
}

export default PostDetail
