import { Form, Input, Icon, Button, Typography } from 'antd';
import Axios from 'axios';
import React from 'react';
import { useState } from 'react';
import Dropzone from 'react-dropzone';

const { TextArea } = Input
const { Title } = Typography;

const showOptions = [
    { value :0, label : "Private" },
    { value :1, label : "Public" },
]

const categoryOptions = [
    { vlaue :0, label : "Film & Animation"},
    { vlaue :1, label : "Autos & Vehicles"},
    { vlaue :2, label : "Music"},
    { vlaue :3, label : "Pets & Animals"},
]

function VideoUploadPage() {

    const [vidoeTitle, setVidoeTitle] = useState('');
    const [description, setDescription] = useState('');
    const [show, setShow] = useState(0);
    const [category, setCategory] = useState('Film & Animation');

    const onTitleChange = e => {
        setVidoeTitle(e.target.value)
    }
    const onDescriptionChange = e => {
        setDescription(e.target.value)
    }
    const onShowChange = e => {
        setShow(e.target.value)
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

                    Axios.post('/api/video/thumbnail', variable)
                        .then(response => {
                            if(response.data.success) {
                                console.log(response.data)
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

    return (
        <div style={{ maxWidth : "700px", margin:'2rem auto' }}>
            <div style={{ textAlign : 'center', marginBottom : '2rem' }}>
                <Title level={2}>Upload Video</Title>
            </div>
            <Form onSubmit>
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
                    <div>
                        <img src alt/>
                    </div>
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

                <select onChange={onShowChange}>
                    {showOptions.map((item, idx) => (
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

                <Button type="primary" size="large" onClick>
                    Submit
                </Button>

            </Form>
        </div>
    )
}

export default VideoUploadPage;