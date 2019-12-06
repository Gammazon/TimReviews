import React from 'react';
import ReactDOM from 'react-dom';
import Axios from 'axios';
import CommentContainer from './commentContainer.jsx';
import Sidebar from './sidebar.jsx';
import PictureModal from './PictureModal.jsx';

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      comments: [],
      totalRating: 0,
      individualRatings: [],
      filteredComments: [],
      totalPictures: []
    };
    this.getAllComments = this.getAllComments.bind(this);
    this.helpfulClicked = this.helpfulClicked.bind(this);
    this.writeReview = this.writeReview.bind(this);
    this.filterByStars = this.filterByStars.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
    this.sortByTop = this.sortByTop.bind(this);
    this.sortByDate = this.sortByDate.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
  }

  getAllComments() {
    Axios.get('/comments')
      .then((data) => {
        var comments = data.data[0].comments;
        //have to sort here again instead of calling sortByTop, as both functions want to setState... Could be refactored...
        comments.sort((a, b) => {
          return b.helpfulCount - a.helpfulCount;
        });
        comments.forEach((comment) => {
          comment.date = new Date(comment.date);
        })
        var totalPictures = data.data[0].totalPictures
        var average = data.data[0].average
        var individualRatings = data.data[0].individualRatings;
        this.setState({ comments: comments, totalRating: average, individualRatings: individualRatings, totalPictures: totalPictures })
      })
  }

  sortByDate() {
    const comments = this.state.comments;
    const sortedComments = comments.slice().sort((a, b) => {
      return b.date - a.date;
    })
    this.setState({ comments: sortedComments })
  }

  writeReview() {
    //TODO
    //Need to find a way to render this on the page, without redirects
  }

  sortByTop() {
    const comments = this.state.comments;
    const commentsCopy = comments.slice();
    commentsCopy.sort((a, b) => {
      return b.helpfulCount - a.helpfulCount;
    })
    this.setState({ comments: commentsCopy })
  }

  clearFilter() {
    this.setState({ filteredComments: [] })
  }

  filterByStars(val) {
    const comments = this.state.comments;
    const filteredComments = comments.filter((comment) => {
      return comment.rating === val;
    })
    this.setState({ filteredComments: filteredComments })
  }



  helpfulClicked(event) {
    var id = event.target.id;
    var comments = this.state.comments;
    var itemName;
    var index;

    //bugged for db update
    comments.forEach((comment, idx) => {
      if (comment.id == id) {
        index = idx;
        itemName = comment.itemName;
        comment.buttonClicked = true;
      }
    })
    console.log(index);
    Axios.patch('/comments', {
      id: index,
      itemName: itemName
    })
    this.setState({ comments: comments })
  }

  handleSortChange(event) {
    if (event.target.value === 'mostRecent') {
      this.sortByDate();
    } else {
      this.sortByTop();
    }
  }


  componentDidMount() {
    this.getAllComments();
  }



  render() {
    if (this.state.filteredComments.length) {
      return (
        <div id="tsSubReviewContainer">
          <button>Click me to open the modal</button>
          <Sidebar filterByStars={this.filterByStars} totalRating={this.state.totalRating} individualRatings={this.state.individualRatings} totalComments={this.state.comments.length} />
          <div>
            <PictureModal totalPictures={this.state.totalPictures}></PictureModal>
            <CommentContainer comments={this.state.filteredComments} helpfulClicked={this.helpfulClicked} clearFilter={this.clearFilter} />
          </div>
        </div>
      )
    } else {
      return (
        <div id="tsSubReviewContainer">
          <Sidebar filterByStars={this.filterByStars} totalRating={this.state.totalRating} individualRatings={this.state.individualRatings} totalComments={this.state.comments.length} />
          <div>
            <PictureModal totalPictures={this.state.totalPictures}></PictureModal>
            <CommentContainer handleSortChange={this.handleSortChange} comments={this.state.comments} helpfulClicked={this.helpfulClicked} sortByDate={this.sortByDate} />
          </div>
        </div>
      )
    }
  }
}

ReactDOM.render(<App />, document.getElementById('tsReviewContainer'))