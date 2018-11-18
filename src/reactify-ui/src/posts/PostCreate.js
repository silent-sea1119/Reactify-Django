import React, { Component } from 'react'
import 'whatwg-fetch'
import cookie from 'react-cookies'
import moment from 'moment'

class PostCreate extends Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleDraftChange = this.handleDraftChange.bind(this)
    this.clearForm = this.clearForm.bind(this)
    this.clearFormRefs = this.clearFormRefs.bind(this)
    this.postTitleRef = React.createRef() // alternate way of creating reference
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
          thisComp.clearForm()
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
  }

  // alternate way of clearing out the form
  clearFormRefs () {
    // first create a ref for all the form elements
    // then set all those refs to an empty string
    this.postTitleRef.current = ''
  }

  handleSubmit (event) {
    event.preventDefault()
    let data = this.state
    // if (data['draft'] === 'on') {
    //   data['draft'] = true
    // } else {
    //   data['draft'] = false
    // }
    this.createPost(data)
  }

  componentDidMount () {
    this.setState({
      draft: false,
      title: null,
      content: null,
      publish: moment(new Date()).format('YYYY-MM-DD')
      // OR
      // publish: moment().format('YYYY-MM-DD')
    })
    this.postTitleRef.current.focus()
  }

  render () {
    const { publish } = this.state

    // const publish = moment().format('YYYY-MM-DD')
    // setting date this way will not allow the user to change the date manually in the form

    // if the default values are not set initially in either constructor or componentDidMount but somewhere else
    // then the app will throw errors

    return (
      <form onSubmit={this.handleSubmit} ref={(el) => this.postCreateForm = el}>
        <div className='form-group'>
          <label for='title'>Post title</label>
          <input
            type='text'
            id='title'
            name='title'
            className='form-control'
            placeholder='Blog post title'
            ref={this.postTitleRef}
            onChange={this.handleInputChange}
            required='required'
          />
        </div>
        <div className='form-group'>
          <label for='content'>Content</label>
          <textarea
            id='content'
            name='content'
            className='form-control'
            placeholder='Post content'
            onChange={this.handleInputChange}
            required='required'
          />
        </div>
        <div className='form-group'>
          <label for='draft'>
            <input type='checkbox' id='draft' name='draft' checked={this.state.draft} className='mr-2' onChange={this.handleDraftChange} />
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
        <button className='btn btn-secondary ml-2' onClick={this.clearForm}>Cancel</button>
      </form>
    )
  }
}

export default PostCreate
