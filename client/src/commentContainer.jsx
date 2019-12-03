import React from 'react';
import Comment from './comment.jsx';


const CommentContainer = (props) => {
  var comments = props.comments.map((val, i) => {
    return <Comment id={val.id} body={val.body} date={val.date} helpfulCount={val.helpfulCount} itemName={val.itemName} person={val.person} rating={val.rating} title={val.title} key={i} helpfulClicked={props.helpfulClicked} buttonClicked={val.buttonClicked} />
  })
  return (
    <div>
      <span>{props.comments.length} customer reviews</span>
      <select>
        <option value="topReviews">Top Reviews</option>
        <option value="mostRecent">Most Recent</option>
      </select>
      {comments}
      <div className="tsBottomCommentBox">
        There is {props.comments.length} customer review and {props.numberOfRatings} customer ratings.
      </div>
      <a>See all customer reviews</a>
      <button className="commentBoxSubmitReview">Write a customer review</button>
    </div>
  )
}

export default CommentContainer;