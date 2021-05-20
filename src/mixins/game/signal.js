export default function newSignal(data, nodes, two, canvasGroup, clickBtn) {
  const radius = 10;
  const bias = 10;
  const lineWidth = 2;

  const { signalId, pos, dir, side, sgnType, sgnMnt, protectNodeId, btns } = data;
  const node = nodes[protectNodeId];
  const sgnGroup = two.makeGroup();
  const btnGroup = two.makeGroup();
  const isLeft = dir === 'LEFT';
  const isUp = side === 'UPPER';
  const baselineY = isUp ? -10 : 10;
  const postH = isLeft ? 10 : -10;

  //baseline
  two.makeLine(0, 0, 0, 2 * baselineY).addTo(sgnGroup);

  //btns
  const blen = 20;
  let ptr = isLeft ? -25 + 10 : 25 - 10;
  btns.forEach(btn => {
    let fill = '';
    switch (btn) {
      case 'PASS':
        fill = '#0f0';
        break;
      case 'SHUNT':
        fill = '#fff';
        break;
      case 'TRAIN':
        fill = '#0f0';
        break;
      case 'GUIDE':
        fill = '#700574';
        isLeft ? ptr -= 5: ptr += 5;
        break;
      case 'LZA':
        fill = '#0f0';
        break;
    }
    const rectangle = two.makeRectangle(ptr, baselineY, blen, blen);
    rectangle.fill = fill;
    two.update();
    rectangle.renderer.elem.addEventListener('click', () => {
      clickBtn({
        signalId: signalId,
        kind: btn,
      })
    })
    rectangle.addTo(btnGroup)
    isLeft ? ptr -= (blen + 5) : ptr += (blen + 5);
  });

  let ox = isLeft ? radius : -radius;
  if (sgnMnt === 'POST_MOUNTING') {
    //post line
    two.makeLine(0, baselineY, postH, baselineY).addTo(sgnGroup);
    ox += postH;
  }
  //light1
  const light1 = two.makeCircle(ox, baselineY, radius);
  light1.noFill();
  light1.addTo(sgnGroup);

  let light2;
  if (sgnType === 'HOME_SIGNAL' || sgnType === 'STARTING_SIGNAL') {
    ox += isLeft ? 2 * radius : -2 * radius;
    //light2
    light2 = two.makeCircle(ox, baselineY, radius);
    light2.noFill();
    light2.addTo(sgnGroup);
  }

  const elem = two.makeGroup(sgnGroup, btnGroup)
  elem.stroke = '#fff';
  elem.linewidth = lineWidth;
  let offset = [0, 0];
  if (node !== undefined) {
    const p = node.segment.vertices;
    const [x1, y1] = [p[0].x, p[0].y];
    const [x2, y2] = [p[1].x, p[1].y];
    const [dx, dy] = [x2 - x1, y2 - y1];
    const len = Math.sqrt(dx * dx + dy * dy);
    const [cos, sin] = [dx / len, dy / len];
    elem.rotation = Math.atan(dy / dx);
    const k = dx > 0 ? 1 : -1;
    offset = [
      k * (isUp ? bias : -bias) * sin,
      k * (isUp ? -bias : bias) * cos
    ];
  }
  elem.translation.set(pos.x + offset[0], pos.y + offset[1]);

  two.update();
  const hoverAreaEle = sgnGroup.renderer.elem;
  const label = two.makeText(signalId, 0, 0);
  let hover = true;

  label.visible = false;
  label.fill = '#fff';
  label.addTo(elem);

  hoverAreaEle.addEventListener('mouseover', e => {
    if (!hover) return;
    label.visible = true;
  });
  hoverAreaEle.addEventListener('mousemove', e => {
    if (!hover) return;
    label.position.set(e.x - canvasGroup.translation.x - elem.translation.x, e.y - canvasGroup.translation.y - elem.translation.y - 10);
  });
  hoverAreaEle.addEventListener('mouseleave', () => {
    if (!hover) return;
    label.visible = false;
  });

  canvasGroup.add(elem);

  return {
    id: signalId,
    light1,
    light2
  };
}
