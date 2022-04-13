import { NodeCanvasRenderingContext2D as CanvasContext } from "canvas";
import { background, format, text } from "../src/config";
import { genColor } from "./randomiser";

export function addCanvasContent(
  renderObject: any,
  index: number,
  ctx: CanvasContext
) {
  ctx.globalAlpha = renderObject.layer.opacity;
  ctx.globalCompositeOperation = renderObject.layer.blend;

  text.only
    ? addText(
        ctx,
        `${renderObject.layer.name}${text.spacer}${renderObject.layer.selectedElement.name}`,
        text.xGap,
        text.yGap * (index + 1)
      )
    : ctx.drawImage(
        renderObject.loadedImage,
        0,
        0,
        format.width,
        format.height
      );
}

export function drawBackground(ctx: CanvasContext) {
  if (background.generate) {
    ctx.fillStyle = background.static ? background.default : genColor();
    ctx.fillRect(0, 0, format.width, format.height);
  }
}

const addText = (ctx: CanvasContext, _sig: string, x: number, y: number) => {
  ctx.fillStyle = text.color;
  ctx.font = `${text.weight} ${text.size}pt ${text.family}`;
  ctx.textBaseline = text.baseline;
  ctx.textAlign = text.align;
  ctx.fillText(_sig, x, y);
};
