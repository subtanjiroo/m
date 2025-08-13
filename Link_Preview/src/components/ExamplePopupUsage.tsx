import React, { useState } from 'react'
import Popup from './ui/popup'
import { Button } from './ui/button'

const ExamplePopupUsage: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const handleOpenPopup = () => setIsPopupOpen(true)
  const handleClosePopup = () => setIsPopupOpen(false)

  return (
    <div>
      <Button onClick={handleOpenPopup}>Open Popup</Button>

      <Popup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        title="Example Popup"
        size="md"
        position="center"
      >
        <div className="space-y-4">
          <p className="text-slate-200">
            This is an example popup content. You can put any content here.
          </p>
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={handleClosePopup}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                // Handle confirmation action
                handleClosePopup()
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Popup>
    </div>
  )
}

export default ExamplePopupUsage 