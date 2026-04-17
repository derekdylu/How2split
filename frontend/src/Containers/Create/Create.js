import React, { useState } from 'react'
import {
  Input,
  Space,
  Button,
  List,
  message,
  Modal
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const serverUrl = process.env.REACT_APP_SERVER_URL

const Create = () => {
  const [loading, setLoading] = useState(false);
  const [inputEvent, setInputEvent] = useState("")
  const [inputMember, setInputMember] = useState("")
  const [members, setMembers] = useState([])
  const [messageApi, contextHolder] = message.useMessage();
  const [locked, setLocked] = useState(false) // eslint-disable-line
  const [password, setPassword] = useState("") // eslint-disable-line
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false)

  const error = () => {
    messageApi.open({
      type: 'error',
      content: '成員名稱重複',
    });
  };

  const addMember = () => {
    // check duplicates
    if (members.includes(inputMember)) {
      error()
      return
    }
    setMembers([...members, inputMember])
    setInputMember("")
  }

  const removeMember = (name) => {
    setMembers(members.filter(member => member !== name))
  }

  async function postEvent(eventData) { // eslint-disable-line no-unused-vars
    try {
      const response = await fetch(`${serverUrl}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      window.location.href = `/events/${data._id}`
    } catch (error) {
      console.error("Could not post event:", error);
      setLoading(false);
    }
  }

  const submitEvent = async () => {
    setLoading(true)
    setOpenUpgradeModal(true)
    setLoading(false)
    // const eventData = {
    //   name: inputEvent,
    //   accounts: members,
    //   locked: locked,
    //   password: password
    // }
    // await postEvent(eventData)
  }

  return (
    <>
      {contextHolder}
      <Modal
        title="系統升級中"
        open={openUpgradeModal}
        onCancel={() => setOpenUpgradeModal(false)}
        footer={null}
      >
        <div className="flex flex-col gap-2">
          <div>系統正在進行升級，建立活動功能暫時關閉。</div>
          <Button type="primary" href="https://www.buymeacoffee.com/derekdylu" target="_blank" rel="noopener noreferrer">
            讚助我們 | Buy Me a Coffee
          </Button>
        </div>
      </Modal>
      <Space direction='vertical' size="middle">
        建立活動
        <Input placeholder="活動名稱" onChange={(e) => setInputEvent(e.target.value)} />
        <Space wrap>
          <Input placeholder="成員名稱" value={inputMember} onChange={(e) => setInputMember(e.target.value)} />
          <Button onClick={() => addMember()} disabled={!inputMember}>新增成員</Button>
        </Space>
        <List
          bordered
          dataSource={members}
          renderItem={(member) => (
            <List.Item actions={[<Button danger icon={<DeleteOutlined />} onClick={() => removeMember(member)} />]}>
              {member}
            </List.Item>
          )}
        />
        {/* <Space warp>
            密碼保護
          <Switch defaultChecked checked={locked} onChange={() => setLocked(!locked)} />
        </Space>
        {
          locked && <Input.Password placeholder="設定密碼" value={password} onChange={(e) => setPassword(e.target.value)}/>
        } */}
        <div className="text-xs text-gray-700">
          *活動建立後即無法刪除既有成員*
        </div>
        {
          loading ?
            <Button loading>建立活動</Button>
            :
            <Button disabled={!inputEvent || members.length === 0 || (locked && password === "")} onClick={() => submitEvent()}>建立活動</Button>
        }
      </Space>
    </>
  )
}

export default Create