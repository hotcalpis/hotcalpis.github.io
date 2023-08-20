export default {
  fillCircle(
    c: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    color: string,
    startAngle: number = 0,
    endAngle: number = Math.PI * 2
  ) {
    c.beginPath()
    c.arc(x, y, radius, startAngle, endAngle)
    c.fillStyle = color
    c.fill()
  },

  fillSemiCircle(
    c: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    color: string,
    startAngle: number = 0
  ) {
    c.beginPath()
    c.arc(x, y, radius, startAngle, startAngle + Math.PI)
    c.fillStyle = color
    c.fill()
  },

  fillRoundedArc(
    c: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    color: string,
    width: number,
    startAngle: number = 0,
    endAngle: number = 0,
    lineCap: CanvasLineCap = 'round'
  ) {
    c.beginPath()
    c.arc(x, y, radius, startAngle, endAngle)
    c.strokeStyle = color
    c.lineCap = lineCap
    c.lineWidth = width
    c.stroke()
  },
}
