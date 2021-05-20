import Two from 'two.js';

const btns = [
  {
    mode: 'createRoute',
    label: '新进路'
  },
  {
    mode: 'cancelRoute',
    label: '总取消'
  },
  {
    mode: 'manuallyUnlock',
    label: '总人解'
  },
  {
    mode: 'errorUnlock',
    label: '区故解'
  }
]

export default function newDock(two, changeMode) {
  const height = 80;
  const group = two.makeGroup();
  const dock = two.makeRoundedRectangle(0, 0, btns.length * 70 + 20, height, 20)
  dock.fill = "#614848"
  dock.size = 40;
  dock.addTo(group)
  let ptrX = (btns.length - 1) * (-70) / 2
  const defocuses = [];
  btns.forEach(b => {
    let [btn, focus, defocus] = newBtn(two, b.label)
    defocuses.push({ mode: b.mode, defocus })
    btn.translation.set(ptrX, 0);
    btn.addTo(group)
    ptrX += 70;
    two.update()
    btn.renderer.elem.addEventListener('click', ()=>{
      changeMode(b.mode)
      focus()
      defocuses.forEach(({ mode, defocus }) => {
        if (mode !== b.mode){
          defocus()
        }
      })
    })

    btn.renderer.elem.addEventListener('mouseover', () => {
      btn.renderer.elem.style.cursor = 'pointer'
    })
  })

  group.translation.set(two.width/2, two.height - height/2)
}

function newBtn(two, text) {
  const group = two.makeGroup();
  const btn = two.makeRoundedRectangle(0,0,60,60, 10)
  btn.fill = "#fffafa"
  btn.noStroke()
  btn.addTo(group)

  const label = two.makeText(text, 0, 0, undefined);
  label.addTo(group)

  const focus = () => {
    label.weight = 'bold';
    btn.fill = '#fff'
  }

  const defocus = () => {
    label.weight = 'normal';
    btn.fill = "#fffafa"
  }

  return [group, focus, defocus]
}
