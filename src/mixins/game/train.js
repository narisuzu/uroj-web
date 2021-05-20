export default function newTrain(at, two, canvasGroup) {
  const train = two.makeCircle(...at, 5)
  train.fill = "#eeff00"

  train.addTo(canvasGroup)
}
