import type { DefaultLinkModel } from "@projectstorm/react-diagrams";
import createEngine, {
  CanvasWidget,
  DefaultNodeModel,
  DiagramModel,
} from "@projectstorm/react-diagrams";
import isEqual from "lodash.isequal";
import React from "react";

import type { Level } from "~/models/dialog.server";

type LevelsDiagramProps = {
  data: Level<string>[];
};

// eslint-disable-next-line react/display-name
const LevelsDiagram = React.memo(
  ({ data }: LevelsDiagramProps) => {
    const engine = createEngine();

    const model = new DiagramModel();

    const spaceX = 200;
    const spaceY = 100;
    const maxLength = 30;

    const levelsObject = data.reduce((acc, level) => {
      let name = `(${level.levelNum}) - ${
        level.topic.trim() ? level.topic : level.title
      }`;

      if (name.length > maxLength) {
        name = name.substring(0, maxLength) + "...";
      }
      acc.set(level.levelNum, {
        data: level,
        node: new DefaultNodeModel({
          name,
          color: "rgb(0,192,255)",
        }),
      });
      return acc;
    }, new Map<number, { data: Level<string>; node: DefaultNodeModel }>());

    const rangY: number[] = [];

    function doLevel(levelNum: number, rangX: number) {
      const levelObject = levelsObject.get(levelNum);
      if (!levelObject) return;

      rangY[rangX] = rangY[rangX] ?? 0;

      levelObject.node.setPosition(spaceX * rangX, spaceY * rangY[rangX]);
      model.addNode(levelObject.node);

      rangY[rangX] += 1;
      const nextRangX = rangX + 1;

      levelObject.data.actor.actions.forEach((action) => {
        const levelObjectIn = levelsObject.get(action.onAction);
        if (levelObjectIn) {
          doLevel(action.onAction, nextRangX);

          const portOut = levelObject.node.addOutPort("Out");
          const portIn = levelObjectIn.node.addInPort("In");
          const link = portOut.link<DefaultLinkModel>(portIn);
          // link.addLabel(action.actionKeywords);
          model.addLink(link);
        }
      });
    }

    doLevel(0, 0);

    model.setLocked(true);
    engine.setModel(model);

    return <CanvasWidget engine={engine} className="h-72 w-full" />;
  },
  (prev, props) => isEqual(prev.data, props.data)
);

export default LevelsDiagram;
