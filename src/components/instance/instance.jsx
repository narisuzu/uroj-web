import newNode from 'src/mixins/game/node';
import newSignal from 'src/mixins/game/signal';
import newTitle from 'src/mixins/game/title';
import newDock from 'src/mixins/game/dock';
import Two from 'two.js';

export function initInstance({ title, signals, nodes, onCreateRoute, onCancelRoute }) {
  let btns = [];
  let currMode = 'none';

  const clickBtn = (btn) => {
    if (currMode === 'none') {
      return;
    }
    btns.push(btn);
    if (currMode === 'createRoute' && btns.length === 2) {
      onCreateRoute(btns[0], btns[1]);
      console.info('creating route:' + btns);
      btns = [];
    }

    if (currMode === 'cancelRoute' && btns.length === 1) {
      onCancelRoute(btns[0])
      btns = [];
    }
  };

  const nodes_map = {};
  const signals_map = {};
  const two = new Two({
    fullscreen: true,
    autostart: true
  });
  two.appendTo(document.getElementById('stage'));
  const canvasGroup = two.makeGroup();
  newTitle(title, two);
  canvasGroup.id = 'stationCanvas';
  nodes.forEach(e => nodes_map[e.nodeId] = newNode(e, two, canvasGroup));
  signals.forEach(e => signals_map[e.signalId] = newSignal(e, nodes_map, two, canvasGroup, clickBtn));

  const { width, height, left, top } = canvasGroup.getBoundingClientRect();
  canvasGroup.translation.set((two.width - width) / 2 - left, (two.height - height) / 2 - top);

  const changeMode = (mode) => {
    currMode = mode;
    btns = [];
    console.log('change mode to: ' + mode);
  };

  newDock(two, changeMode);

  const updateSignal = (sid, state) => {
    const sgn = signals_map[sid];
    if (!sgn) return;
    let light1, light2;
    switch (state) {
      case 'H':
        light1 = '#f00';
        light2 = null;
        break;
      case 'L':
        light1 = '#0f0';
        light2 = null;
        break;
      case 'U':
        light1 = '#ff0';
        light2 = null;
        break;
      case 'B':
        light1 = '#fff';
        light2 = null;
        break;
      case 'A':
        light1 = '#00f';
        light2 = null;
        break;
      case 'UU':
        light1 = '#ff0';
        light2 = '#ff0';
        break;
      case 'LU':
        light1 = '#0f0';
        light2 = '#ff0';
        break;
    }
    sgn.light1.fill = light1;
    if (sgn.light2) {
      sgn.light2 = light2;
    }
    two.update();
  };

  const updateNode = (nid, state) => {
    const node = nodes_map[nid];
    if (!node) return;
    switch (state) {
      case 'LOCK': {
        node.segment.stroke = '#fff';
        break;
      }
      case 'OCCUPIED': {
        node.segment.stroke = '#f00';
        break;
      }
      case 'VACANT': {
        node.segment.stroke = '#0ff';
        break;
      }
    }

    two.update();
  };
  return {
    updateSignal,
    updateNode
  };
}