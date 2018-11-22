import React, { Component } from 'react'
import 'whatwg-fetch'
import cookie from 'react-cookies'
import moment from 'moment'

class PostUpdate extends Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleDraftChange = this.handleDraftChange.bind(this)
    this.clearForm = this.clearForm.bind(this)
    this.postContentRef = React.createRef() // alternate way of creating reference
    this.state = {
      draft: false,
      title: null,
      content: null,
      publish: null
    }
  }

  createPost (data) {
    const endpoint = '/api/posts/'
    const csrfToken = cookie.load('csrftoken')
    let thisComp = this

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
          if (thisComp.props.newPostItemCreated) {
            thisComp.props.newPostItemCreated(responseData)
          }
          thisComp.defaultState()
          thisComp.clearForm()
        }).catch(function (error) {
          console.log('error', error)
          alert('An error occured. Please try again later.')
        })
    }
  }

  updatePost (data) {
    const { post } = this.props
    const endpoint = `/api/posts/${post.slug}/`
    const csrfToken = cookie.load('csrftoken')
    let thisComp = this

    if (csrfToken !== undefined) {
      let lookupOptions = {
        method: 'PUT',
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
          if (thisComp.props.postItemUpdated) {
            thisComp.props.postItemUpdated(responseData)
          }
        }).catch(function (error) {
          console.log('error', error)
          alert('An error occured. Please try again later.')
        })
    }
  }

  handleInputChange (event) {
    event.preventDefault()
    // console.log(event.target.name, event.target.value)

    // validate data
    let key = event.target.name
    let value = event.target.value
    if (key === 'title') {
      if (value.length > 15) {
        alert('This title is too long!')
      }
    }

    this.setState({
      // event.target.name gives the input type for which this function was called and since the name can be variable
      // we write it within []
      [key]: value
    })
  }

  handleDraftChange (event) {
    this.setState({
      draft: !this.state.draft
    })
  }

  clearForm (event) {
    if (event) {
      event.preventDefault()
    }
    this.postCreateForm.reset() // this will not change the state
    this.postContentRef.current = ''
  }

  handleSubmit (event) {
    event.preventDefault()
    let data = this.state

    const { post } = this.props
    if (post !== undefined) {
      this.updatePost(data)
    } else {
      this.createPost(data)
    }
  }

  defaultState () {
    this.setState({
      draft: false,
      title: null,
      content: null,
      publish: moment(new Date()).format('YYYY-MM-DD')
    })
  }

  componentDidMount () {
    const { post } = this.props
    if (post !== undefined) {
      this.setState({
        draft: post.draft,
        title: post.title,
        content: post.content,
        publish: moment(post.publish).format('YYYY-MM-DD')
      })
    } else {
      this.defaultState()
    }
  }

  render () {
    const { publish } = this.state
    const { title } = this.state
    const { content } = this.state
    const cancelButtonClass = this.props.post !== undefined ? 'd-none' : ''

    return (
      <form onSubmit={this.handleSubmit} ref={(el) => this.postCreateForm = el}>
        <div className='form-group'>
          <label for='title'>Post title</label>
          <input
            type='text'
            id='title'
            name='title'
            value={title}
            className='form-control'
            placeholder='Blog post title'
            onChange={this.handleInputChange}
            required='required'
          />
        </div>
        <div className='form-group'>
          <label for='content'>Content</label>
          <textarea
            id='content'
            name='content'
            value={content}
            className='form-control'
            placeholder='Post content'
            ref={this.postContentRef}
            onChange={this.handleInputChange}
            required='required'
          />
        </div>
        <div className='form-group'>
          <label for='draft'>
            <input
              type='checkbox'
              id='draft'
              name='draft'
              checked={this.state.draft}
              className='mr-2'
              onChange={this.handleDraftChange}
            />
            Draft
          </label>
          {/* If we use value instead of checked in the input above then it won't allow any external element to
              toggle the checkbox, like the button below is doing */}
          <button onClick={(event) => { event.preventDefault(); this.handleDraftChange() }}>Toggle Draft</button>
        </div>
        <div className='form-group'>
          <label for='publish'>Publish Date</label>
          <input
            type='date'
            id='publish'
            name='publish'
            value={publish}
            className='form-control'
            onChange={this.handleInputChange}
            required='required'
          />
        </div>
        <button className='btn btn-primary'>Save</button>
        {/* Show the clear button only if we are creating a new post */}
        <button
          className={`btn btn-secondary ml-2 ${cancelButtonClass}`}
          onClick={this.clearForm}
        >Cancel</button>
      </form>
    )
  }
}

export default PostUpdate
