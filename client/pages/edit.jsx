import React from 'react';
import { Loading } from '../components/spinner';
import { Off } from '../components/offline';
import { TryAgain } from '../components/try-again';

export default class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageURL: '',
      category: '',
      condition: '',
      location: '',
      price: '',
      size: '',
      brand: '',
      style: '',
      color: '',
      title: '',
      description: '',
      classvalue: 'hidden',
      loading: 'processing',
      offline: false,
      noId: 'no',
      tryAgain: 'no'
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.fileInputRef = React.createRef();
    this.handleImageSubmit = this.handleImageSubmit.bind(this);
    this.handleDeleteBox = this.handleDeleteBox.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleConfirmDelete = this.handleConfirmDelete.bind(this);
  }

  componentDidMount() {
    window.addEventListener('offline', event => this.setState({ offline: true }));
    const token = window.localStorage.getItem('lfz-final');
    if (!`${this.props.postId}`) {
      this.setState({
        loading: 'complete',
        noId: 'yes'
      });
    }
    fetch(`/api/post/${this.props.postId}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    })
      .then(res => res.json())
      .then(result => {
        if (result.length > 0) {
          const [data] = result;
          const { imageURL, condition, location, price, title, description } = data;
          this.setState({ imageURL, condition, location, price, title, description, loading: 'complete' });
        }
        if (result.length === 0) {
          this.setState({
            loading: 'complete',
            noId: 'yes'
          });
        }
      });
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleImageSubmit(event) {
    const { token } = this.state;
    event.preventDefault();

    const formData = new FormData();
    const image = this.fileInputRef.current.files[0];
    this.setState({ imageURL: image.name });
    formData.append('image', image);

    fetch('/api/images', {
      method: 'POST',
      headers: {
        'x-access-token': token
      },
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        const { url } = data;
        this.setState({
          imageURL: url,
          image: url
        });
        this.fileInputRef.current.value = null;
      })
      .catch(err => console.error(err));
  }

  handleConfirmDelete(event) {
    event.preventDefault();
    this.setState({
      tryAgain: 'no'
    });
  }

  handleDelete() {
    const token = window.localStorage.getItem('lfz-final');
    fetch(`/api/edit/${this.props.postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    })
      .then(res => res.json())
      .then(result => {
        this.handleDeleteBox();
        window.location.hash = '#myprofile';
      });
  }

  handleDeleteBox() {
    const { classvalue } = this.state;
    if (classvalue === 'hidden') {
      return this.setState({ classvalue: '' });
    }
    return this.setState({ classvalue: 'hidden' });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { price } = this.state;
    if (isNaN(price)) {
      return this.setState({ tryAgain: 'yes' });
    } else {
      const token = window.localStorage.getItem('lfz-final');
      fetch(`/api/edit/${this.props.postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify(this.state)
      })
        .then(res => res.json())
        .then(result => {
          this.setState(result);
          window.location.hash = '#myprofile';
        });
    }
  }

  render() {
    const { imageURL, category, condition, location, price, title, size, brand, color, style, description, loading, offline, noId, tryAgain } = this.state;
    let showAgain = 'hidden';
    if (offline === true) {
      return <Off />;
    }
    if (loading === 'processing') {
      return <Loading />;
    }
    if (tryAgain === 'yes') {
      showAgain = '';
    }
    if (noId === 'yes') {
      return <TryAgain/>;
    }
    return (
      <div className="column-full">
        <div className={showAgain}>
          <div className="confirm-delete-box delete-box-height">
            <div className="margin-top-3rem">
              <div className="text-center">
                <h3 className="delete-top-margin">Price must be numbers only</h3>
              </div>
              <div className="row space-around margin-top-5rem">
                <button onClick={this.handleConfirmDelete} className="delete-confirm-button">Okay</button>
              </div>
            </div>
          </div>
        </div>
        <div className="upload-container edit-width">
          <form onSubmit={this.handleSubmit}>
            <div className="rows">
              <div className="edit-column-half">
                <div className="column-80 margin-top-1rem">
                  <div className="image-container">
                    <img className="detail-image-height" src={imageURL}></img>
                  </div>
                  <div className="row space-between">
                    <div className="margin-top-1rem">
                      <label id="uploading" htmlFor="upload">Choose File</label>
                      <input
                        id="upload"
                        type="file"
                        name="imageURL"
                        ref={this.fileInputRef}
                        accept=".png, .jpg, .jpeg, .gif"
                        className="search-button"
                        hidden
                      />
                    </div>
                    <div className="margin-top-half-rem">
                      <button onClick={this.handleImageSubmit} className="image-load">Upload</button>
                    </div>
                  </div>
                  <div className="margin-top-1rem column-full edit-text-align">
                    <hr></hr>
                    <div className="title-container">
                      <input
                        required
                        id="title"
                        type="text"
                        name="title"
                        onChange={this.handleChange}
                        className="title edit-text-width-second-half"
                        placeholder={title}
                      />
                    </div>
                    <hr></hr>
                    <div className="row">
                      <div className="price-container">
                        <input
                          required
                          id="price"
                          type="text"
                          name="price"
                          onChange={this.handleChange}
                          placeholder={price}
                          className="edit-text-width-first-half"
                        />
                      </div>
                      <div>
                        <input
                          required
                          id="size"
                          type="text"
                          name="size"
                          onChange={this.handleChange}
                          placeholder={size}
                        />
                      </div>
                    </div>
                    <hr></hr>
                    <div className="row">
                      <div className="category-container">
                        <select className="category" value="" onChange={this.handleChange} name="category" required>
                          <option className="select" value="">{category}</option>
                          <optgroup label="Menswear">
                            <option className="select" value="Tops">Tops</option>
                            <option className="select" value="Bottoms">Bottoms</option>
                            <option className="select" value="Coats and Jackets">Coats and Jackets</option>
                            <option className="select" value="Jumpsuits and Rompers">Jumpsuits and Rompers</option>
                            <option className="select" value="Suits">Suits</option>
                            <option className="select" value="Footwear">Footwear</option>
                            <option className="select" value="Accessories">Accessories</option>
                            <option className="select" value="Sleepwear">Sleepwear</option>
                            <option className="select" value="Underwear">Underwear</option>
                            <option className="select" value="Swimwear">Swimwear</option>
                            <option className="select" value="Costume">Costume</option>
                          </optgroup>
                          <optgroup label="Womenswear">
                            <option className="select" value="Tops">Tops</option>
                            <option className="select" value="Bottoms">Bottoms</option>
                            <option className="select" value="Coats and Jackets">Coats and Jackets</option>
                            <option className="select" value="Jumpsuits and Rompers">Jumpsuits and Rompers</option>
                            <option className="select" value="Suits">Suits</option>
                            <option className="select" value="Footwear">Footwear</option>
                            <option className="select" value="Accessories">Accessories</option>
                            <option className="select" value="Sleepwear">Sleepwear</option>
                            <option className="select" value="Underwear">Underwear</option>
                            <option className="select" value="Swimwear">Swimwear</option>
                            <option className="select" value="Costume">Costume</option>
                          </optgroup>
                          <optgroup label="Jewellery">
                            <option className="select" value="Tops">Tops</option>
                            <option className="select" value="Bottoms">Bottoms</option>
                            <option className="select" value="Coats and Jackets">Coats and Jackets</option>
                            <option className="select" value="Jumpsuits and Rompers">Jumpsuits and Rompers</option>
                            <option className="select" value="Suits">Suits</option>
                            <option className="select" value="Footwear">Footwear</option>
                            <option className="select" value="Accessories">Accessories</option>
                            <option className="select" value="Sleepwear">Sleepwear</option>
                            <option className="select" value="Underwear">Underwear</option>
                            <option className="select" value="Swimwear">Swimwear</option>
                            <option className="select" value="Costume">Costume</option>
                          </optgroup>
                          <optgroup label="Beauty">
                            <option className="select" value="Face">Face</option>
                            <option className="select" value="Eyes">Eyes</option>
                            <option className="select" value="Lips">Lips</option>
                            <option className="select" value="Perfume">Perfume</option>
                            <option className="select" value="Bath & Body">Bath & Body</option>
                            <option className="select" value="Hair Care">Hair Care</option>
                          </optgroup>
                          <optgroup label="Home">
                            <option className="select" value="Bath">Bath</option>
                            <option className="select" value="Bedding">Bedding</option>
                            <option className="select" value="Dining & Entertaining">Dining & Entertaining</option>
                            <option className="select" value="Kitchen">Kitchen</option>
                            <option className="select" value="Home Decor">Home Decor</option>
                            <option className="select" value="Luggage & Travel">Luggage & Travel</option>
                            <option className="select" value="Furniture & Mattresses">Furniture & Mattresses</option>
                          </optgroup>
                          <optgroup label="More">
                            <option className="select" value="Tech Accessories">Tech Accessories</option>
                            <option className="select" value="Art">Art</option>
                            <option className="select" value="Books and Magazines">Books and Magazines</option>
                            <option className="select" value="Music">Music</option>
                            <option className="select" value="Party Supplies">Party Supplies</option>
                            <option className="select" value="Sports Equipment">Sports Equipment</option>
                            <option className="select" value="Others">Others</option>
                          </optgroup>
                        </select>
                      </div>
                    <div className="condition-container">
                      <select className="condition" onChange={this.handleChange} name="condition" placeholder={condition} required>
                        <option className="select" value="">{condition}</option>
                        <option className="select" value="Used - Fair">Used - Fair</option>
                        <option className="select" value="Used - Good">Used - Good</option>
                        <option className="select" value="Used - Very Good">Used - Very Good</option>
                        <option className="select" value="Used - Excellent">Used - Excellent</option>
                        <option className="select" value="Pristine">Pristine</option>
                      </select>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="edit-column-half">
                <div className="column-80 edit-text-align">
                  <div className="margin-top-1rem">
                    <hr></hr>
                    <div className="row">
                      <div>
                        <input
                          id="brand"
                          type="text"
                          name="brand"
                          onChange={this.handleChange}
                          placeholder={brand}
                        />
                      </div>
                      <div>
                        <input
                          required
                          id="style"
                          type="text"
                          name="brand"
                          onChange={this.handleChange}
                          placeholder={style}
                        />
                      </div>
                    </div>
                    <hr></hr>
                    <div className="row">
                      <div>
                        <input
                          required
                          id="color"
                          type="text"
                          name="color"
                          onChange={this.handleChange}
                          placeholder={color}
                        />
                      </div>

                      <div className="location-container">
                        <input
                          required
                          id="location"
                          type="text"
                          name="location"
                          onChange={this.handleChange}
                          className="edit-text-width-first-half"
                          placeholder={location}
                        />
                      </div>
                    </div>
                    <hr></hr>
                    <div className="description-container">
                      <textarea
                        required
                        autoFocus
                        id="description"
                        type="text"
                        name="description"
                        onChange={this.handleChange}
                        className="description edit-text-width-second-half"
                        wrap="hard"
                        placeholder={description}
                      />
                      </div>
                      <div className="row space-between margin-top-1rem">
                        <button type="submit" className="upload-button">Update</button>
                        <a href="#myprofile" className="cancel-button"><p className="cancel-button-text">Cancel</p></a>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className={this.state.classvalue}>
          <div className="confirm-delete-box delete-box-height">
            <div className="delete-text"><h2 className="auto delete">Delete</h2></div>
              <div className="margin-top-3rem">
                <div className="text-center">
                  <h3 className="delete-top-margin">Are you sure want to delete this item?</h3>
                </div>
                <div className="row space-around margin-top-5rem">
                  <button onClick={this.handleDelete}className="delete-confirm-button">Confirm</button>
                  <button onClick={this.handleDeleteBox} className="delete-cancel-button">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
}
