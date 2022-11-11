import { Avatar, Col, List, Row } from "antd";
import Axios from "axios";
import React, { useState, useEffect } from "react";
import SideVideo from "./Section/SideVideo";
import Subscribe from "./Section/Subscribe";
import Comment from "./Section/Comment";

function VideoDetailPage(props) {

    const videoId = props.match.params.videoId
    const variable = { videoId : videoId }

    const [VideoDetail, setVideoDetail] = useState([])
    const [Comments, setComments] = useState([])

    useEffect(() => {
        Axios.post('/api/video/getVideoDetail', variable)
            .then(response => {
                if(response.data.success) {
                    // console.log(response.data.videoDetail)
                    setVideoDetail(response.data.videoDetail)
                } else {
                    alert('비디오 정보 가져오기를 실패했습니다.')
                }
            })

        Axios.post('/api/comment/getComments', variable )
            .then( response => {
                if(response.data.success) {
                    //console.log(response.data.comments)
                    setComments(response.data.comments)
                } else {
                    alert('댓글 정보를 가져오는 것을 실패했습니다.')
                }
            }) 
    }, [])
    
    const refreshFunction = (newComment) => {
        setComments(Comments.concat(newComment))
    }

    if (VideoDetail.writer) {
        
        const subscribeButton = VideoDetail.writer._id !== localStorage.getItem('userId') && <Subscribe userTo={VideoDetail.writer._id} userFrom={localStorage.getItem('userId')}/>

        return (

        
            <Row gutter={[16, 16]}>
                <Col lg={17} xs={24}>
                    <div style={{ width : '100%', padding : '3rem 4rem'}}>
                        <video style={{ width : '100%', maxHeight : '650px'}} src={`http://localhost:5000/${VideoDetail.filePath}`} contorls='true'/>
                        
                        <List.Item
                            actions={[subscribeButton]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={VideoDetail.writer.image} />}
                                title={VideoDetail.writer.name}
                                description={VideoDetail.description}
                            />
                        </List.Item>
                        <Comment refreshFunction={refreshFunction} commentLists={Comments} postId={videoId} />
    
                    </div>
                </Col>
                <Col lg={7} xs={24}>
                    <SideVideo />
                </Col>
    
            </Row>
        )
    } else {
        return ( <div></div>)
    }
   
}

export default VideoDetailPage;