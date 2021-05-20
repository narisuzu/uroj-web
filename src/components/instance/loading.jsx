import Two from "two.js";
import {useEffect, useState} from "react";

export function LoadingAnime() {
    const ID = "loading-anime"
    const [two] = useState(new Two({
        autostart: true,
        width: 200,
        height: 200,
    }))

    const DARK_RED = "#820000"
    const BRIGHT_RED = "#ff2828"

    const post = two.makeRoundedRectangle(0, -30, 10, 170, 5)
    post.fill = "#bfbfbf"
    const lightBar = two.makeRectangle(0, 0, 100, 10)
    const c1 = two.makeCircle(-50, 0, 20)
    const c2 = two.makeCircle(50, 0, 20)
    const lightG = two.makeGroup(lightBar, c1, c2)
    lightG.translation.set(0, 20)
    lightG.fill = "#000"
    const c11 = two.makeCircle(-50, 0, 15)
    const c12 = two.makeCircle(50, 0, 15)
    const g1 = two.makeGroup(c11, c12).addTo(lightG)
    g1.fill = DARK_RED
    const ban = two.makeRectangle(0, 0, 150, 20)
    ban.fill = "#ffac33"
    const blacks = two.makeGroup()
    two.makeRectangle(-45, 0, 20, 20).addTo(blacks)
    two.makeRectangle(45, 0, 20, 20).addTo(blacks)
    blacks.fill = "#000"
    const bar1 = two.makeGroup(ban, blacks)
    bar1.translation.set(0, -60)
    const bar2 = bar1.clone()
    bar1.rotation = Math.PI / 6
    bar2.rotation = -Math.PI / 6
    const square = two.makePath(-20, -60, 0, -60 - 20 / Math.sqrt(3), 20, -60, 0, -60 + 20 / Math.sqrt(3))
    square.fill = "#000"
    const group = two.makeGroup(post, lightG, bar1, bar2, square)
    group.translation.set(two.width / 2, two.height / 2 + 30);

    two.bind("update", (frame) => {
        if (frame % 30 === 0) {
            c11.fill = DARK_RED
            c12.fill = BRIGHT_RED
        } else if (frame % 15 === 0) {
            c11.fill = BRIGHT_RED
            c12.fill = DARK_RED
        }
    }).play()

    useEffect(() => {
        two.appendTo(document.getElementById(ID))
    }, [two])

    return <div id={ID}/>
}