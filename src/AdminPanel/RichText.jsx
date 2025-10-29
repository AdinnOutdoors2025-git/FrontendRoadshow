import React, { useState } from 'react';
import './RichText.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
function RichText() {
    const [value, setValue] = useState('');
    // Define toolbar modules
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'align': [] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' },
            ],
            ['link', 'image', 'video'],
            ['clean']
        ]
    };
    return (
        <div className='richTextEditorMain'>
            <div className='BlogContentEditorMain'>
                <div className='BlogContentEditor'>
                    <ReactQuill
                        theme="snow"
                        value={value}
                        onChange={setValue}
                        modules={modules}
                        className='BlogContentEditor-frame'
                    />
                </div>
                <div
                    className='BlogContentPreview'
                    dangerouslySetInnerHTML={{ __html: value }}
                >
                </div>
            </div>
        </div>
    );
}

export default RichText;