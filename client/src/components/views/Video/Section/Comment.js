import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Input, Button } from 'antd'
import { useSelector } from 'react-redux';
import SingleComment from "./SingleComment";

const { TextArea } = Input;


function Comment (props) {

    const videoId = props.postId

    const user = useSelector(state => state.user)
    const [Comment, setComment] = useState("")

    const handleChange = (e) => {
        setComment(e.currentTarget.value)
    }

    const onSubmit = (e) => {
        e.preventDefault();

        const variables = {
            content: Comment,
            writer: user.userData._id,
            videoId: videoId
        }

        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.result)
                    setComment("") // 작성중이던 댓글 초기화
                    props.refreshFunction(response.data.result)
                } else {
                    alert('댓글을 저장하지 못했습니다')
                }
            })
    }

    return (
        <div>
        <br />
        <p> replies</p>
        <hr />
        {/* Comment Lists  */}
        {props.commentLists && props.commentLists.map((comment, index) => (
            (!comment.responseTo &&
                <React.Fragment>
                    <SingleComment comment={comment} postId={props.postId} refreshFunction={props.refreshFunction} />
                    {/*<ReplyComment commentLists={props.commentLists} postId={props.postId} parentCommentId={comment._id} refreshFunction={props.refreshFunction}/>*/}
                </React.Fragment>
            )
        ))}



        {/* Root Comment Form */}
        <form style={{ display: 'flex' }} onSubmit={onSubmit}>
            <TextArea
                style={{ width: '100%', borderRadius: '5px' }}
                onChange={handleChange}
                value={Comment}
                placeholder="댓글을 입력하세요"
            />
            <br />
            <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</Button>
        </form>

    </div>
    )
}

export default Comment;