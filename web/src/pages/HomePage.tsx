import { Collapse } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import getEnemeyList from "../api/getEnemyList";
import EnemyCollapse from "../components/EnemyCollapse";
import { EnemyEntry } from "../components/EnemyEntry";
import Enemy from "../types/enemy";

function HomePage(): JSX.Element {
    const [enemies, setEnemies] = useState<Enemy[]>([]);

    useEffect(() => {
        getEnemeyList().then(newEnemies => {
            setEnemies(newEnemies);
        })
    }, []);

    return <div className="enemy-list">
        <h1>Enemy List</h1>
        <a href="/edit">Edit</a>
        <div>
            {enemies.map( (enemy, index) => {
                return <EnemyCollapse enemy={enemy} index={index} />
            })}
        </div>
    </div>;
}

export { HomePage };