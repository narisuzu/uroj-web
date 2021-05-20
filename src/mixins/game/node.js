import Two from 'two.js';

const jointLen = 6;
const jointWidth = 2;

function newJoint(pos, delta, type, two) {
  const [x, y] = pos;
  const [dx, dy] = delta;
  const elem = two.makeGroup();
  switch (type) {
    case 'NORMAL': {
      const joint = two.makeLine(x + dx, y + dy, x - dx, y - dy);
      joint.linewidth = jointWidth;
      joint.addTo(elem);
      break;
    }
    case 'CLEARANCE': {
      const joint = two.makeLine(x + dx, y + dy, x - dx, y - dy);
      const circle = two.makeCircle(x, y, jointLen);
      circle.noFill();
      const group = two.makeGroup(joint, circle);
      group.linewidth = jointWidth;
      group.addTo(elem);
      break;
    }
    case 'END': {
      const joint = two.makeLine(x + dx, y + dy, x - dx, y - dy);
      const p = dy > 0 ? [x + dx - 1, y + dy] : [x - dx + 1, y - dy];
      const line = two.makeLine(p[0], p[1], p[0] + dy, p[1] - dx);
      const group = two.makeGroup(joint, line);
      group.linewidth = jointWidth;
      group.addTo(elem);
      break;
    }
  }
  return elem;
}

export default function newNode(data, two, canvasGroup) {
  const segmentWidth = 4;

  const elem = two.makeGroup();

  const [[x1, y1], [x2, y2]] = [[data.leftP.x, data.leftP.y], [data.rightP.x, data.rightP.y]];
  const segment = two.makeLine(x1, y1, x2, y2);
  segment.linewidth = segmentWidth;
  segment.addTo(elem);

  const [a, b] = [x2 - x1, y2 - y1]; //ベクトル
  const len = Math.sqrt(a * a + b * b); //線分の長さ
  const [dx, dy] = [-b * jointLen / len, a * jointLen / len];

  //左側にはジョイントがあれば
  if (data.leftJoint !== 'EMPTY') {
    newJoint([x1, y1], [dx, dy], data.leftJoint, two).addTo(elem);
  }

  //右側にはジョイントがあれば
  if (data.rightJoint !== 'EMPTY') {
    newJoint([x2, y2], [dx, dy], data.rightJoint, two).addTo(elem);
  }

  const clickArea = two.makePath([
    new Two.Vector(x1 + dx, y1 + dy),
    new Two.Vector(x1 - dx, y1 - dy),
    new Two.Vector(x2 - dx, y2 - dy),
    new Two.Vector(x2 + dx, y2 + dy)
  ]);
  clickArea.opacity = 0;

  const x = (x2 - x1) / 2, y = (y2 - y1) / 2;
  const label = two.makeText(data.trackId, x, y);
  let hover = true;

  label.visible = false;
  label.fill = '#fff';
  label.addTo(elem);
  clickArea.addTo(elem);

  const node = {
    id: data.nodeId,
    trackId: data.trackId,
    segment,
    setLabelMode: (newMode) => {
      if (newMode === 'always') {
        hover = false;
        label.position.set(x, y);
        label.visible = true;
      }
      if (newMode === 'hover') {
        hover = true;
      }
      if (newMode === 'none') {
        hover = false;
        label.visible = false;
      }
    }
  };
  two.update(); //以下には必要なのだ

  const hoverAreaEle = clickArea.renderer.elem;
  hoverAreaEle.addEventListener('mouseover', e => {
    if (!hover) return;
    label.visible = true;
  });
  hoverAreaEle.addEventListener('mousemove', e => {
    if (!hover) return;
    label.position.set(e.x - canvasGroup.translation.x, e.y - canvasGroup.translation.y - dy);
  });
  hoverAreaEle.addEventListener('mouseleave', () => {
    if (!hover) return;
    label.visible = false;
  });

  elem.stroke = '#fff';
  canvasGroup.add(elem);

  return node;
}
