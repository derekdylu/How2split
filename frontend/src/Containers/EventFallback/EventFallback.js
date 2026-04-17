import React from 'react'
import { useParams } from 'react-router-dom';
import { Modal, Button } from 'antd';

const EventFallback = () => {
  const { id } = useParams();

  return (
    <Modal
      title="系統升級中"
      open={true}
      footer={null}
      closable={false}
      centered
    >
      <div className="flex flex-col gap-2">
        <div>系統正在進行升級，活動頁面功能暫時關閉。</div>
        <div className="text-xs text-gray-500">活動 ID: {id}</div>
        <Button type="primary" href="https://www.buymeacoffee.com/derekdylu" target="_blank" rel="noopener noreferrer">
          讚助我們 | Buy Me a Coffee
        </Button>
      </div>
    </Modal>
  )
}

export default EventFallback
