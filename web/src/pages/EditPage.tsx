import { Button, Collapse, Form, message } from "antd";
import { useCallback, useEffect, useState } from "react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Link } from "react-router-dom";
import update from 'immutability-helper'
import getEnemeyList from "../api/getEnemyList";
import Enemy from "../types/enemy";
import { EnemyEntry } from "../components/EnemyEntry";
import { useForm } from "antd/lib/form/Form";
import { findRenderedDOMComponentWithTag } from "react-dom/test-utils";
import { PlusOutlined } from "@ant-design/icons";
import setEnemyList from "../api/setEnemyList";

function EditPage(): JSX.Element {
    const [form] = useForm();
    const [enemies, setEnemies] = useState<Enemy[]>([]);

    useEffect(() => {
        getEnemeyList().then(newEnemies => {
            setEnemies(newEnemies);
        })
    }, []);

    const moveEnemy = useCallback(
        (dragIndex: number, hoverIndex: number) => {
            const values = form.getFieldsValue(true);
            console.log(values);
            const enemyValues = [];
            for (let i = 0; i < enemies.length; i++) {
                enemyValues.push({
                    "name": values["enemies[" + i + "].name"],
                    "description": values["enemies[" + i + "].description"]
                });
            }
            //setEnemies(enemyValues);
            console.log(values);
            const dragEnemy = enemyValues[dragIndex]
            const newEnemies = update(enemyValues, {
                $splice: [
                [dragIndex, 1],
                [hoverIndex, 0, dragEnemy],
                ],
            })
            console.log(newEnemies);
            for (let i = 0; i < newEnemies.length; i++) {
                values["enemies[" + i + "].name"] = newEnemies[i].name;
                values["enemies[" + i + "].description"] = newEnemies[i].description;
            }
            form.setFieldsValue(values);
            setEnemies(newEnemies);
            
        },
        [enemies],
    )

    const deleteEnemy = (index: number) => {
        const values = form.getFieldsValue(true);
        console.log(values);
        const enemyValues = [];
        for (let i = 0; i < enemies.length; i++) {
            enemyValues.push({
                "name": values["enemies[" + i + "].name"],
                "description": values["enemies[" + i + "].description"]
            });
        }
        //setEnemies(enemyValues);
        console.log(values);
        const newEnemies = enemyValues.filter((enemy, i) => i !== index);
        console.log(newEnemies);
        for (let i = 0; i < newEnemies.length; i++) {
            values["enemies[" + i + "].name"] = newEnemies[i].name;
            values["enemies[" + i + "].description"] = newEnemies[i].description;
        }
        delete values["enemies[" + index + "].name"];
        delete values["enemies[" + index + "].description"];
        form.setFieldsValue(values);
        setEnemies(newEnemies);
    }

    const newEnemy = () => {
        const newEnemies = [...enemies, { name: "", description: "" }];
        const values = form.getFieldsValue(true);
        values["enemies[" + (newEnemies.length - 1) + "].name"] = "";
        values["enemies[" + (newEnemies.length - 1) + "].description"] = "";
        form.setFieldsValue(values);
        setEnemies(newEnemies);
    }

    const renderEnemy = (enemy: Enemy, index: number) => {
        return (
            <EnemyEntry
                key={enemy.name}
                index={index}
                id={enemy.name}
                enemy={enemy}
                moveCard={moveEnemy}
                deleteEnemy={deleteEnemy}
            />
        )
    }

    const onFinish = async (values: any) => {
        const enemyValues = [];
        for (let i = 0; i < enemies.length; i++) {
            enemyValues.push({
                "name": values["enemies[" + i + "].name"],
                "description": values["enemies[" + i + "].description"]
            });
        }
        const result = await setEnemyList(enemyValues);
        if (result) {
            message.success('Enemies updated');
        } else {
            message.error('Failed to update enemies!');
        }
    }

    return <div className="enemy-list">
        <h1>Enemy List</h1>
        <Form form={form} onFinish={onFinish}>
            <DndProvider backend={HTML5Backend}>
                {enemies.map( (enemy, index) => {
                    return renderEnemy(enemy, index)
                })}
            </DndProvider>
            <div style={{"marginBottom": "5px"}}>
                <Button icon={<PlusOutlined style={{color: "#42A41A"}} />} onClick={newEnemy}/>
            </div>
            <Button type="primary" htmlType="submit">Update</Button>
        </Form>
    </div>;
}

export { EditPage };