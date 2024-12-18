import { useState } from "react"
import { Popover, PopoverTrigger, PopoverContent, Button } from "@nextui-org/react"
import { GripVertical } from "lucide-react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { getAuth } from 'firebase/auth'
import axios from 'axios'


const SortableImageThumbnail = ({ image, index, isSelected, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: image.imageUrl })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex items-center gap-2 select-none p-2 rounded"
    >
      <div {...listeners} className="cursor-grab">
        <GripVertical className="h-5 w-5 text-gray-400" />
      </div>
      <div 
        onClick={onClick}
        className="h-20 w-20 rounded"
      >
        <img
          src={image.imageUrl}
          alt={`Dish Image ${index + 1}`}
          className={`h-full w-full object-cover rounded
            ${isSelected ? "ring-2 ring-primary" : ""}`}
        />
      </div>
    </div>
  )
}

const ImageCell = ({ images: initialImages }) => {
  const [images, setImages] = useState(initialImages || [])
  const [selectedImage, setSelectedImage] = useState(images?.[0]?.imageUrl)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => item.imageUrl === active.id)
        const newIndex = items.findIndex((item) => item.imageUrl === over.id)
        const reorderedItems = arrayMove(items, oldIndex, newIndex)
        
        // Update sortOrder for each item based on new position
        return reorderedItems.map((item, index) => ({
          ...item,
          sortOrder: index
        }))
      })
    }
  }

  const handleUpdateOrder = async () => {
    try {
      const auth = getAuth()
      const user = auth.currentUser
      if (!user) {
        throw new Error('User not authenticated')
      }
      const token = await user.getIdToken()
      
      const imageUpdates = images.map(img => ({
        id: img.id,
        sortOrder: img.sortOrder
      }))

      const response = await axios.put('http://127.0.0.1:4000/api/items/images/reorder', 
        imageUpdates,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      // Optional: Show success message
      console.log('Image order updated successfully')
    } catch (error) {
      // Handle error appropriately
      console.error('Error updating image order:', error)
    }
  }

  return (
    <div className="h-10 w-10">
      {images?.length > 0 ? (
        <Popover placement="right">
          <PopoverTrigger>
            <img
              src={images[0].imageUrl}
              alt="Dish"
              className="h-full w-full object-cover rounded cursor-pointer"
            />
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-col gap-4 p-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <img
                    src={selectedImage}
                    alt="Dish Preview"
                    className="max-w-[300px] max-h-[300px] object-contain"
                  />
                </div>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={images.map(img => img.imageUrl)}
                    strategy={verticalListSortingStrategy}
                  >
                    <ul className="flex flex-col gap-2">
                      {images.map((image, index) => (
                        <li key={image.imageUrl}>
                          <SortableImageThumbnail
                            image={image}
                            index={index}
                            isSelected={selectedImage === image.imageUrl}
                            onClick={() => setSelectedImage(image.imageUrl)}
                          />
                        </li>
                      ))}
                    </ul>
                  </SortableContext>
                </DndContext>
              </div>
              <Button 
                color="primary" 
                className="w-full"
                onClick={handleUpdateOrder}
              >
                Update Order
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <div className="h-full w-full bg-gray-200 rounded" />
      )}
    </div>
  )
}

export default ImageCell
