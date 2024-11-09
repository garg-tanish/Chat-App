import React from 'react'
import axios from 'axios'
import Loading from './Loading';
import taost from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';

export const DotAction = ({ onClose, dataUser, user, allMessage }) => {

  const [loading, setLoading] = React.useState(false)
  const [data, setData] = React.useState({ receiver: dataUser })

  const navigate = useNavigate()

  const handleBlock = async (e) => {
    setLoading(true)
    e.preventDefault()
    e.stopPropagation()

    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/block-user`

      const response = await axios({
        method: 'post',
        url: URL,
        data: data,
        withCredentials: true
      })

      if (response.data.success) {
        taost.success(response?.data?.message)
        setData({ receiver: "" })
        setLoading(false)
        onClose()
        navigate('/')
      }

    } catch (error) {
      taost.error(error?.response?.data?.message)
      setLoading(false)
    }
  }

  const handleDelete = async (e) => {
    setLoading(true)
    e.preventDefault()
    e.stopPropagation()

    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/delete-chat`

      const response = await axios({
        method: 'post',
        url: URL,
        data: data,
        withCredentials: true
      })

      if (response.data.success) {
        taost.success(response?.data?.message)
        setData({ receiver: "" })
        setLoading(false)
        onClose()
        navigate('/')
      }

    } catch (error) {
      taost.error(error?.response?.data?.message)
      setLoading(false)
    }
  }

  const handleExportChat = (e) => {
    setLoading(true)
    e.preventDefault()
    e.stopPropagation()

    // const PDFDocument = require('pdf-lib');

    // async function generatePDF(chatData) {
    //   const pdfDoc = await PDFDocument.create();
    //   const page = pdfDoc.addPage();

    //   const { width, height } = page.getSize();

    //   const { content } = page.drawText(formatChatData(chatData), {
    //     x: 50,
    //     y: height - 50,
    //     size: 12,
    //   });

    //   page.setWidth(content.width + 50);
    //   page.setHeight(content.height + 50);

    //   const pdfBytes = await pdfDoc.save();

    //   // Send the PDF to the user (e.g., stream to browser or save to file)
    //   // ...
    // }

    // function formatChatData(chatData) {
    //   // Format the chat data into a string suitable for PDF generation
    //   // For example, you might create an HTML string with message content, timestamps, and user information
    //   return chatData.map(message => {
    //     return `${message.user}: ${message.text}\n`;
    //   }).join('\n');
    // }
  }

  return (
    <div className="container d-flex flex-col absolute top-16 right-1" style={{ width: "10rem" }}>
      <button type="button" className="btn btn-light" data-bs-toggle="modal" data-bs-target="#blockModal">Block User</button>
      <button type="button" className="btn btn-light" data-bs-toggle="modal" data-bs-target="#deleteModal">Delete Chat</button>
      {/* <button type="button" className="btn btn-light" data-bs-toggle="modal" data-bs-target="#exportModal">Export Chat</button> */}

      {loading &&
        (<div className='fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-gray-700 bg-opacity-40 z-10'>
          <Loading />
        </div>)
      }

      {
        <div className="modal" id='blockModal' tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <p>Are you sure to block this User?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleBlock}>Yes</button>
              </div>
            </div>
          </div>
        </div>
      }

      {
        <div className="modal" id='deleteModal' tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <p>Are you sure to delete whole conversation with this User?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleDelete}>Yes</button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* {
        <div className="modal" id='exportModal' tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <p>Are you sure to export chat with?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleExportChat}>Yes</button>
              </div>
            </div>
          </div>
        </div>
      } */}

    </div>
  )
}
