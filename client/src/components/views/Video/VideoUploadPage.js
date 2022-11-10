import { Form, Input, Icon, Button, Typography, message } from 'antd';
import Axios from 'axios';
import React from 'react';
import { useState } from 'react';
import Dropzone from 'react-dropzone';
import { useSelector } from 'react-redux';

const { TextArea } = Input
const { Title } = Typography;

const PrivacyOptions = [
    { value :0, label : "Private" },
    { value :1, label : "Public" },
]

const categoryOptions = [
    { value :0, label : "Film & Animation"},
    { value :1, label : "Autos & Vehicles"},
    { value :2, label : "Music"},
    { value :3, label : "Pets & Animals"},
]

function VideoUploadPage(props) {
    const user = useSelector(state => state.user)
    const [vidoeTitle, setVidoeTitle] = useState('');
    const [description, setDescription] = useState('');
    const [Privacy, setPrivacy] = useState(0);
    const [category, setCategory] = useState('Film & Animation');
    const [filePath, setFilePath] = useState('');
    const [duration, setDuration] = useState('');
    const [thumbnailPath, setThumbnailPath] = useState('initialState');

    const onTitleChange = e => {
        setVidoeTitle(e.target.value)
    }
    const onDescriptionChange = e => {
        setDescription(e.target.value)
    }
    const onPrivacyChange = e => {
        setPrivacy(e.target.value)
    }
    const onCategoryChange = e => {
        setCategory(e.target.value)
    }
    const onDrop = (files) => {
        let formData = new FormData;
        const config = {
            header : {'content-type' : 'multipart/form-data'}
        }
        formData.append("file", files[0])

        Axios.post('/api/video/uploadfiles', formData, config)
            .then(response => {
                if(response.data.success) {
                    console.log(response.data)

                    let variable = {
                        url : response.data.url,
                        fileName : response.data.filename
                    }

                    setFilePath(response.data.url)
                    setThumbnailPath(response.data.url)

                    Axios.post('/api/video/thumbnail', variable)
                        .then(response => {
                            if(response.data.success) {
                                setDuration(response.data.fileDuration)
                                setThumbnailPath(response.data.url)
                                
                            } else {
                                alert('썸네일 생성에 실패 했습니다.')
                            }
                        })
                }
                else{
                    alert('비디오 업로드를 실패했습니다.')
                }
            } 
            )
    }

    const onSubmit = e => {
        e.preventDefault();
        
        const variables = {
            writer : user.userData._id,
            title : vidoeTitle,
            description : description,
            privacy : Privacy,
            category : category,
            filePath : filePath,
            duration : duration,
            thumbnail : thumbnailPath,
        }

        Axios.post('/api/video/uploadVideo', variables)
            .then( response => {
                if(response.data.success) {
                    message.success('성공적으로 업로드를 했습니다.')

                    setTimeout(() => {
                        props.history.push('/')
                    }, 1000);
                    
                } else { 
                    alert('비디오 업로드에 실패')
                }
            })
    }

    return (
        <div style={{ maxWidth : "700px", margin:'2rem auto' }}>
            <div style={{ textAlign : 'center', marginBottom : '2rem' }}>
                <Title level={2}>Upload Video</Title>
            </div>
            <Form onSubmit={onSubmit}>
                <div style={{ display : 'flex', justifyContent : 'space-between' }}> 
                    {/* Drop Zone */}

                    <Dropzone
                        onDrop={onDrop}
                        multiple={false}
                        maxSize={1000000000}
                    >
                        {({getRootProps, getInputProps}) => (
                            <div style={{ 
                                width:'300px', height:'240px', border:'1px solid lightgray', display:'flex',
                                alignItems:'center', justifyContent:'center'
                                }} {...getRootProps()}>
                                    <input {...getInputProps()}/>
                                    <Icon type="plus" style={{ fontSize:'3rem'}} />
                            </div>
                        )}
                    </Dropzone>

                    {/* Thunbnail */}
                    {thumbnailPath !== 'initialState' && 
                    <div>
                        <img src={`http://localhost:5000/${thumbnailPath}`} alt="thumbnail"/>
                    </div>
                    }
                </div>

                <br />
                <br />
                <label>Title</label>
                <Input 
                    onChange={onTitleChange}
                    value={vidoeTitle}
                />
                <br />
                <br />
                <label>Description</label>
                <TextArea 
                    onChange={onDescriptionChange}
                    value={description}
                />

                <br />
                <br />

                <select onChange={onPrivacyChange}>
                    {PrivacyOptions.map((item, idx) => (
                        <option key={idx} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <br />
                <br />

                <select onChange={onCategoryChange}>
                    {categoryOptions.map((item, idx) => (
                            <option key={idx} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <br />
                <br />

                <Button type="primary" size="large" onClick={onSubmit}>
                    Submit
                </Button>

            </Form>
        </div>
    )
}

export default VideoUploadPage;