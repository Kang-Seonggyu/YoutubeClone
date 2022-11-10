import { Avatar, Col, List, Row } from "antd";
import Axios from "axios";
import React, { useState, useEffect } from "react";
import SideVideo from "./Section/SideVideo";

function VideoDetailPage(props) {

    const videoId = props.match.params.videoId
    const variable = { videoId : videoId }

    const [VideoDetail, setVideoDetail] = useState([])

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
    }, [])
    
    if (VideoDetail.writer) {
        return (

        
            <Row gutter={[16, 16]}>
                <Col lg={17} xs={24}>
                    <div style={{ width : '100%', padding : '3rem 4rem'}}>
                        <video style={{ width : '100%'}} src={`http://localhost:5000/${VideoDetail.filePath}`} contorls />
                        
                        <List.Item
                            actions
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={VideoDetail.writer.image} />}
                                title={VideoDetail.writer.name}
                                description={VideoDetail.description}
                            />
                        </List.Item>
                        comment
    
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