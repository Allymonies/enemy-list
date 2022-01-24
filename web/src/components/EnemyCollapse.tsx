import { Collapse } from "antd";
import Enemy from "../types/enemy";

export interface EnemyCollapseProps {
    index: number,
    enemy: Enemy
}

export default function EnemyCollapse({index, enemy}: EnemyCollapseProps): JSX.Element {
    
    return <Collapse bordered={false}>
        <Collapse.Panel header={(index + 1).toString() + ". " + enemy.name} key={index}>
            <p>{enemy.description}</p>
        </Collapse.Panel>
    </Collapse>;
}