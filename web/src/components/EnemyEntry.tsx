import { Button, Collapse, Form, Input } from 'antd'
import { FC, useRef } from 'react'
import { useDrag, useDrop, DropTargetMonitor, XYCoord } from 'react-dnd'
import { DeleteOutlined } from '@ant-design/icons';
import Enemy from '../types/enemy'
import { ItemTypes } from './ItemTypes'

const style = {
  "cursor": 'move',
  "borderBottom": '1px solid #e9e9e9',
  "paddingBottom": "5px",
  "marginBottom": '10px'
}

export interface CardProps {
  id: any
  enemy: Enemy
  index: number
  moveCard: (dragIndex: number, hoverIndex: number) => void
  deleteEnemy?: (index: number) => void
}

interface DragItem {
  index: number
  id: string
  type: string
}

export const EnemyEntry: FC<CardProps> = ({ id, enemy, index, moveCard, deleteEnemy}) => {
    const ref = useRef<HTMLDivElement>(null)
    const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.CARD,
    collect(monitor) {
        return {
        handlerId: monitor.getHandlerId(),
        }
    },
    hover(item: DragItem, monitor: DropTargetMonitor) {
        if (!ref.current) {
        return
        }
        const dragIndex = item.index
        const hoverIndex = index

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
        return
        }

        // Determine rectangle on screen
        const hoverBoundingRect = ref.current?.getBoundingClientRect()

        // Get vertical middle
        const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

        // Determine mouse position
        const clientOffset = monitor.getClientOffset()

        // Get pixels to the top
        const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%

        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
        }

        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
        }

        // Time to actually perform the action
        moveCard(dragIndex, hoverIndex)

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        item.index = hoverIndex
    },
    })

    const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
        return { id, index }
    },
    collect: (monitor: any) => ({
        isDragging: monitor.isDragging(),
    }),
    })

    const opacity = isDragging ? 0 : 1
    drag(drop(ref))
    return (
    <div ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId}>
        <Form.Item
            label="Name"
            name={`enemies[${index}].name`}
            initialValue={enemy.name}
            rules={[{ required: true, message: 'Please input the name of the enemy!' }]}
        >
            <Input />
        </Form.Item>
        <Form.Item
            label="Description"
            name={`enemies[${index}].description`}
            initialValue={enemy.description}
            rules={[{ required: true, message: 'Please input the description of the enemy!' }]}
        >
            <Input.TextArea />
        </Form.Item>
        <Button
            icon={<DeleteOutlined style={{"color": "#a61d24"}}/>}
            onClick={() => deleteEnemy ? deleteEnemy(index) : null}
        />
    </div>
    )
}
